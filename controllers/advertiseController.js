const Advertise = require("../Models/Advertise");

exports.createAdvertise = async (req, res) => {
    try {
      const { fullname, number, email, description } = req.body;
  
      // Validate required fields
      if (!fullname || !number || !email) {
        return res.status(400).json({ error: 'Fullname, Contact Number, and Email are required.' });
      }
  
      // Create a new advertisement entry
      const advertise = new Advertise({ fullname, number, email, description });
  
      // Save the entry to the database
      await advertise.save();
  
      // Respond with the created entry and status code 201 (Created)
      res.status(201).json(advertise);
    } catch (error) {
      // Log the actual error for debugging
      console.error('Error creating advertisement:', error);
  
      // Respond with a status code 500 (Internal Server Error) and the actual error message
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getAllAdvertise = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.body;
  
    try {
      // Convert page and limit to numbers
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      // Define search criteria (adjust fields as needed)
      const searchCriteria = search
        ? {
            $or: [
              { title: { $regex: search, $options: 'i' } }, // Case-insensitive search for title
              { description: { $regex: search, $options: 'i' } }, // Case-insensitive search for description
            ],
          }
        : {};
  
      // Fetch advertisements with search criteria and pagination
      const advertise = await Advertise.find(searchCriteria)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
  
      // Get the total number of advertisements that match the search criteria
      const totalAdvertise = await Advertise.countDocuments(searchCriteria);
  
      // Send advertisements along with pagination and search info
      res.status(200).json({
        advertise,
        totalPages: Math.ceil(totalAdvertise / limitNumber),
        currentPage: pageNumber,
        search,
      });
    } catch (error) {
      console.error('Error retrieving advertise:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

exports.deleteAdvertise = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdvertise = await Advertise.findByIdAndDelete(id);

        if (!deletedAdvertise) {
            return res.status(404).json({ error: 'Advertise not found' });
        }

        res.status(200).json({ message: 'Advertise deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ error: error.message });
    }
};