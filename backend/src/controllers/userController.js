const User = require("../models/User");

// User functions
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.avatarUrl) user.avatarUrl = req.body.avatarUrl;
    if (req.body.addresses) user.addresses = req.body.addresses;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadAvatar = (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Thiếu file" });
    const url = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
    res.json({ avatarUrl: url });
};

// Admin functions
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json(users);
};

const updateUserStatus = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-passwordHash");
  res.json(user);
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user.role === "admin") return res.status(400).json({ message: "Không thể xóa Admin" });
  await user.deleteOne();
  res.json({ message: "Đã xóa user" });
};

module.exports = { updateProfile, uploadAvatar, getAllUsers, updateUserStatus, deleteUser };