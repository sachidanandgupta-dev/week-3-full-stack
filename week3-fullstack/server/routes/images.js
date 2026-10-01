const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please choose an image file' });
    const image = await Image.create({
      user: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    });
    res.status(201).json(image);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    res.json(await Image.find({ user: req.user._id }).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const image = await Image.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!image) return res.status(404).json({ message: 'Image not found' });
    fs.unlink(path.join(__dirname, '..', 'uploads', image.filename), () => {});
    res.json({ message: 'Image deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
