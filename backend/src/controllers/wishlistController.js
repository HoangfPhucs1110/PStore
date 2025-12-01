const Wishlist = require("../models/Wishlist");

const getWishlist = async (req, res) => {
  const wl = await Wishlist.findOne({ userId: req.user._id });
  res.json(wl || { productIds: [] });
};

const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  let wl = await Wishlist.findOne({ userId: req.user._id });
  if (!wl) wl = await Wishlist.create({ userId: req.user._id, productIds: [] });

  const index = wl.productIds.indexOf(productId);
  if (index === -1) wl.productIds.push(productId);
  else wl.productIds.splice(index, 1);

  await wl.save();
  res.json(wl);
};

module.exports = { getWishlist, toggleWishlist };