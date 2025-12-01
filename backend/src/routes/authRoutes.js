const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { updateProfile, uploadAvatar } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/profile", protect, getMe); 
router.put("/profile", protect, updateProfile);
router.post("/profile/avatar", protect, upload.single("avatar"), uploadAvatar);

module.exports = router;