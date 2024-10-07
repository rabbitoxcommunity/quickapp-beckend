const Feedback = require("../Models/Feedback");


exports.addFeedback = async (req, res) => {
    try {
        const { name, number, description } = req.body;
        console.log(req.body)
    
        // Validate required fields
        if (!name || !number || !description ) {
          return res.status(400).json({ error: 'Fullname, Contact Number, and Description are required.' });
        }
    
        // Create a new advertisement entry
        const feedback = new Feedback({ name, number, description });
    
        // Save the entry to the database
        await feedback.save();
    
        // Respond with the created entry and status code 201 (Created)
        res.status(201).json(feedback);
      } catch (error) {
        // Log the actual error for debugging
        console.error('Error creating feedback:', error);
    
        // Respond with a status code 500 (Internal Server Error) and the actual error message
        res.status(500).json({ error: error.message });
      }
};

exports.getAllFeedback = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.body;
  
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
      const feedbacks = await Feedback.find(searchCriteria)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
  
      // Get the total number of feedbacks that match the search criteria
      const totalFeedbacks = await Feedback.countDocuments(searchCriteria);
  
      // Send feedbacks along with pagination and search info
      res.status(200).json({
        feedbacks,
        totalPages: Math.ceil(totalFeedbacks / limitNumber),
        currentPage: pageNumber,
        search,
      });
    } catch (error) {
      console.error('Error retrieving feedback:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFeedback = await Feedback.findByIdAndDelete(id);

        if (!deletedFeedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ error: error.message });
    }
};