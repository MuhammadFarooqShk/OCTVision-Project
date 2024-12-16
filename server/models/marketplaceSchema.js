const mongoose = require('mongoose');

// Define the schema for the "marketplace" collection
const marketplaceSchema = new mongoose.Schema({
  Image: {
    type: String,
    required: true, // Ensure the Name field is mandatory
    trim: true // Remove extra spaces
  },
  Name: {
    type: String,
    required: true, // Ensure the Name field is mandatory
    trim: true // Remove extra spaces
  },
  Description: {
    type: String,
    required: true, // Ensure the Description field is mandatory
    trim: true
  },
  Provider: {
    type: String,
    required: true, // Ensure the Provider field is mandatory
    trim: true
  },
  Contact: {
    type: String,
    required: true, // Ensure the Provider field is mandatory
    trim: true
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt timestamps
});

// Export the model
module.exports = mongoose.model('Marketplace', marketplaceSchema);
