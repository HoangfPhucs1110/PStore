const User = require("../models/User");

// User functions
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
    
    // Cập nhật các trường thông tin cơ bản
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.avatarUrl !== undefined) user.avatarUrl = req.body.avatarUrl;
    
    // FIX: Đảm bảo trường addresses được nhận và lưu
    if (req.body.addresses !== undefined) {
      user.addresses = req.body.addresses;
    }
    
    await user.save();
    // Trả về đối tượng user đã cập nhật (bao gồm mảng addresses mới)
    res.json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};

const uploadAvatar = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
    try {
        const user = await User.findById(req.user._id);
        user.avatarUrl = req.file.path; // req.file.path là URL từ Cloudinary
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }).select("-passwordHash");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa người dùng" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateProfile, uploadAvatar, getAllUsers, updateUserStatus, deleteUser };