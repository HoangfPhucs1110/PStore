const Category = require("../models/Category");

// Lấy danh sách danh mục
const getAllCategories = async (req, res) => {
  try {
    // Thêm log để debug
    console.log("Đang lấy danh sách danh mục...");
    
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    
    console.log(`Tìm thấy ${categories.length} danh mục.`);
    res.json(categories);
  } catch (error) {
    console.error("LỖI LẤY DANH MỤC:", error); // In lỗi ra terminal
    res.status(500).json({ message: "Lỗi Server khi lấy danh mục", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, icon, sortOrder } = req.body;
    
    const exists = await Category.findOne({ slug });
    if (exists) return res.status(400).json({ message: "Slug danh mục đã tồn tại" });

    const category = await Category.create({ name, slug, icon, sortOrder });
    res.status(201).json(category);
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, slug, sortOrder, icon } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      { name, slug, sortOrder, icon }, 
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };