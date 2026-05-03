import Image from '../models/Image.js';

export const getGallery = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const images = await Image.find({ userId }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const image = await Image.findOneAndDelete({ _id: req.params.id, userId });
    if (!image) return res.status(404).json({ error: "Image not found" });
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
};
