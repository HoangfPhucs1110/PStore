const Product = require("../models/Product");

// @desc    Lấy danh sách sản phẩm (Lọc, Tìm kiếm, Phân trang, Sắp xếp)
// @route   GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { 
      keyword, categorySlug, brand, sort, 
      page = 1, limit = 12, 
      isFeatured, isNew 
    } = req.query;
    
    // 1. Xây dựng bộ lọc (Query Builder)
    let query = {}; 

    // Tìm kiếm (Regex: tìm gần đúng, không phân biệt hoa thường)
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      query.$or = [
        { name: { $regex: regex } },
        { brand: { $regex: regex } },
        { sku: { $regex: regex } }
      ];
    }

    // Lọc theo danh mục
    if (categorySlug && categorySlug !== "all") {
      query.categorySlug = categorySlug;
    }
    
    // Lọc theo thương hiệu
    if (brand && brand !== "all") {
      query.brand = brand;
    }

    // Lọc sản phẩm nổi bật
    if (isFeatured === "true") {
      query.isFeatured = true;
    }

    // Lọc sản phẩm mới
    if (isNew === "true") {
      query.isNew = true;
    }

    // 2. Xử lý sắp xếp
    let sortOption = { createdAt: -1 }; // Mặc định: Mới nhất trước
    if (sort === "priceAsc") sortOption = { price: 1 };
    if (sort === "priceDesc") sortOption = { price: -1 };
    if (sort === "sold") sortOption = { soldCount: -1 };

    // 3. Phân trang
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 12;
    const skip = (pageNumber - 1) * limitNumber;

    // 4. Thực thi truy vấn
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await Product.countDocuments(query);

    // 5. Trả về kết quả
    res.json({
      products,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });

  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};

// @desc    Lấy chi tiết 1 sản phẩm theo Slug (SEO Friendly)
// @route   GET /api/products/slug/:slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy chi tiết theo ID (Dùng cho Admin sửa)
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo sản phẩm mới (Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Lỗi tạo sản phẩm", error: error.message });
  }
};

// @desc    Cập nhật sản phẩm (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

// @desc    Xóa sản phẩm (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json({ message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload ảnh sản phẩm lên Cloudinary
// @route   POST /api/products/upload-image
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
  }
  
  // Cloudinary tự động trả về đường dẫn ảnh tuyệt đối trong req.file.path
  // Không cần ghép localhost nữa
  res.json({ url: req.file.path });
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage
};