const express = require("express");
const router = express.Router();
const Marketplace = require("../models/marketplaceSchema");

// API endpoint to fetch all marketplace data
router.get("/", async (req, res) => {
  try {
    const marketplaces = await Marketplace.find({}, "Image Name Provider Contact"); // Fetch only required fields
    res.json(marketplaces);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Marketplace.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
