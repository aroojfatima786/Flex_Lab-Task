const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role === 'user' && req.user._id.toString() !== id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (err) {
        res.status(400).json({ message: "Invalid user ID" });
    }
};
const updateUser = async (req, res) => {
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
      res.json({ message: "User updated", user: updatedUser });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Cloudinary upload failed", error: err.message });
  }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(400).json({ message: "Invalid user ID" });
    }
};

const profile = async (req, res) => {
    res.json({ user: req.user });
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, profile };
