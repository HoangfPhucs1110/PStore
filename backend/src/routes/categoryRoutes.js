const express = require("express");
const router = express.Router();
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/auth");

router.get("/", getAllCategories);
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory); // <--- THÊM DÒNG NÀY
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;