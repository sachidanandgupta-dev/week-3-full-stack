const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    originalName: { type: String },
    size: { type: Number },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);
