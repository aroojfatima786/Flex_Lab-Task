const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const redis = require("../config/redis");

const invalidateUserCache = async () => {
    await redis.del("users:all");
    const keys = await redis.keys("users:page:*");
    if (keys.length) await redis.del(keys);
};

const getAllUsers = async (req, res, next) => {
  try {
    const cacheKey = "users:all";

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache Hit - Users");
      return res.json(JSON.parse(cached));
    }

    const users = await User.find().select("-password");

    await redis.set(cacheKey, JSON.stringify(users), "EX", 300);

    console.log("Cache Miss - Users from DB");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.user.role === 'user' && req.user._id.toString() !== id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;

  if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Access denied" });
  }

  try {
      if (req.body.password) {
          req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      const user = await User.findById(id);

      if (req.file) {
          const streamUpload = (buffer) => {
              return new Promise((resolve, reject) => {
                  const stream = cloudinary.uploader.upload_stream(
                      { folder: 'profile_images', resource_type: 'image' },
                      (error, result) => (result ? resolve(result) : reject(error))
                  );
                  streamifier.createReadStream(buffer).pipe(stream);
              });
          };

          const result = await streamUpload(req.file.buffer);
          req.body.profileImageUrl = result.secure_url;

          if (user.profileImageUrl && !user.profileImageUrl.includes('default-avatar.png')) {
              const publicId = user.profileImageUrl.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(`profile_images/${publicId}`);
          }
      } 
      else if (req.body.profileImage === "") {
          if (user.profileImageUrl && !user.profileImageUrl.includes('default-avatar.png')) {
              const publicId = user.profileImageUrl.split('/').pop().split('.')[0];
              await cloudinary.uploader.destroy(`profile_images/${publicId}`);
          }
          req.body.profileImageUrl = "https://res.cloudinary.com/dl0ufwxua/image/upload/v1755600620/samples/paper.png";
      }
      else if (!user.profileImageUrl) {
          req.body.profileImageUrl = "https://res.cloudinary.com/dl0ufwxua/image/upload/v1755600620/samples/paper.png";
      }

      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password');

      await invalidateUserCache();

      res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
      next(err);
  }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        await invalidateUserCache();

        res.json({ message: "User deleted" });
    } catch (err) {
        next(err);
    }
};

const profile = async (req, res, next) => {
    res.json({ user: req.user });
};

const getUsersPaginated = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const cacheKey = `users:page:${page}:limit:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Cache Hit - Paginated Users");
      return res.json(JSON.parse(cached));
    }

    const users = await User.find()
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    await redis.set(cacheKey, JSON.stringify(users), "EX", 300);

    console.log("Cache Miss - Paginated Users from DB");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, profile, getUsersPaginated };
