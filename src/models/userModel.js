const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,  
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,  
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,  
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    phonenumber: {  
      type: String, 
      trim: true,
    },
    role: {
    type: String,
    enum: ["admin", "user", "moderator"],
    default: "user"
  },
    profileImageUrl: { 
    type: String, 
    default: "https://res.cloudinary.com/dl0ufwxua/image/upload/v1755600620/samples/paper.png"
  },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;