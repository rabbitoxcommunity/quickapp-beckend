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
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
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