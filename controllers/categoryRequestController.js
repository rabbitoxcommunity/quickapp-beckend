const CategoryRequest = require("../Models/CategoryRequest");

exports.createNewCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;

    console.log(req.body)

    // Validate required fields
    if (!category_name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    // Create a new advertisement entry
    const request = new CategoryRequest({ category_name, description });

    // Save the entry to the database
    await request.save();

    // Respond with the created entry and status code 201 (Created)
    res.status(201).json(request);
  } catch (error) {
    // Log the actual error for debugging
    console.error('Error creating request:', error);

    // Respond with a status code 500 (Internal Server Error) and the actual error message
    res.status(500).json({ error: error.message });
  }
};


exports.getAllCategory = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.body;

  console.log(req.body, "::::::::")

  try {
    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Define search criteria (you can search by message, username, or other fields)
    const searchCriteria = search
      ? {
        $or: [
          { message: { $regex: search, $options: 'i' } }, // Case-insensitive search for feedback message
          { username: { $regex: search, $options: 'i' } }, // Case-insensitive search for username
        ]
      }
      : {};

    // Fetch feedbacks with search criteria and pagination
    const categories = await CategoryRequest.find(searchCriteria)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);


    const totalrequestedCategories = await CategoryRequest.countDocuments(searchCriteria);


    res.status(200).json({
      categories,
      totalPages: Math.ceil(totalrequestedCategories / limitNumber),
      currentPage: pageNumber,
      search,
    });
  } catch (error) {
    console.error('Error retrieving requested category:', error);
    res.status(500).json({ error: error.message });
  }
};



exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryRequest.findById(id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    await CategoryRequest.findByIdAndDelete(id);
    res.json({ msg: 'Requested category deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};