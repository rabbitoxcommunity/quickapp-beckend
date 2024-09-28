const Category = require("../Models/Category");


exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if category already exists
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    // Create new category
    category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.deleteCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
      }
      res.json({ msg: 'Category deleted successfully' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Category not found' });
      }
      res.status(500).json({ msg: 'Server Error' });
    }
  };