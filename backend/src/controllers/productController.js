const Product = require("../models/Product");

// @desc    Lấy danh sách sản phẩm (Lọc, Tìm kiếm, Phân trang, Sắp xếp)
// @route   GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { 
      keyword, categorySlug, brand, sort, 
      page = 1, limit = 12, 
      isFeatured, isNew,
      minPrice, maxPrice,
      ...others // Các tham số còn lại (dành cho lọc specs)
    } = req.query;

    let query = {};

    // 1. Tìm kiếm
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      query.$or = [
        { name: { $regex: regex } },
        { brand: { $regex: regex } },
        { sku: { $regex: regex } }
      ];
    }

    // 2. Bộ lọc cơ bản
    if (categorySlug && categorySlug !== "all") query.categorySlug = categorySlug;
    if (brand && brand !== "all") query.brand = brand;
    if (isFeatured === "true") query.isFeatured = true;
    if (isNew === "true") query.isNew = true;

    // 3. Lọc theo giá
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. --- LỌC THEO THÔNG SỐ KỸ THUẬT ---
    // Quy tắc: Client gửi param dạng: spec_RAM=16GB, spec_CPU=i7
    Object.keys(others).forEach(key => {
        if (key.startsWith("spec_")) {
            const specKey = key.replace("spec_", ""); // Lấy tên thông số (VD: RAM)
            const specValue = others[key];
            
            // Tìm trong object 'specs' của MongoDB
            // Dùng Regex để tìm tương đối
            if (specValue) {
                query[`specs.${specKey}`] = { $regex: specValue, $options: "i" };
            }
        }
    });

    // 5. Sắp xếp
    let sortOption = { createdAt: -1 };
    if (sort === "priceAsc") sortOption = { price: 1 };
    if (sort === "priceDesc") sortOption = { price: -1 };
    if (sort === "sold") sortOption = { soldCount: -1 };

    // 6. Phân trang
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 12;
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server", error: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Lỗi tạo sản phẩm", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
  }
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