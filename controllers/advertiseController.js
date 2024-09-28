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
    try {
        const advertise = await Advertise.find();
        res.status(200).json(advertise);
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