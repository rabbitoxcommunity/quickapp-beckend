const Bid = require("../Models/Bid");
const Category = require("../Models/Category");


exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;


    let category = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }


    category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};


exports.getAllCategories = async (req, res) => {
  const { page, limit, search = '', exact = false } = req.body;

  try {

    let searchCriteria = {};

    if (search) {
      if (exact) {

        searchCriteria = { name: search };
      } else {

        searchCriteria = { name: { $regex: search, $options: 'i' } };
      }
    }

    let categories;
    let totalCategories;

    if (page && limit) {

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      categories = await Category.find(searchCriteria)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);


      totalCategories = await Category.countDocuments(searchCriteria);
    } else {

      categories = await Category.find(searchCriteria);
      totalCategories = categories.length;
    }


    res.json({
      categories,
      totalCategories,
      totalPages: page && limit ? Math.ceil(totalCategories / limit) : 1,
      currentPage: page ? parseInt(page, 10) : null,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};



exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    const bids = await Bid.findOne({ category: category.name });
    if (bids) {
      return res.status(400).json({ msg: 'Category cannot be deleted because it has associated bids' });
    }
    await Category.findByIdAndDelete(id);
    res.json({ msg: 'Category deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

