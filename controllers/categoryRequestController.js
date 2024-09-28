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