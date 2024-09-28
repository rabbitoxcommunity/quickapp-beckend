const AdBanner = require("../Models/AdBanner");


exports.createBanner = async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { dateFrom, dateTo, url, position } = req.body;
    console.log(dateFrom, dateTo, url, ':::::');

    // Check if required fields are provided
    if (!dateFrom || !dateTo || !url || !position) {
      return res.status(400).json({ error: 'Date From, Date To, Position, and URL are required' });
    }

    // Check if the position is already in use
    const existingBanner = await AdBanner.findOne({ position });
    if (existingBanner) {
      return res.status(400).json({ error: 'Position is already in use' });
    }

    // Create a new banner with the provided data
    const banner = new AdBanner({
      image: req.file.path,
      type: 'ad',
      dateFrom,
      dateTo,
      position,
      url
    });

    // Save the new banner to the database
    await banner.save();

    // Respond with the created banner
    res.status(201).json(banner);
  } catch (error) {
    // Handle any errors that occur
    res.status(400).json({ error: error.message });
  }
};



exports.getAllBanners = async (req, res) => {
  try {
    // Fetch all banners from the database, sorted by creation date in descending order
    const banners = await AdBanner.find().sort({ createdAt: -1 });

    // Map through the banners and add an `expiry` field to each one
    const bannersWithExpiry = banners.map(banner => {
      const dateFrom = new Date(banner.dateFrom);
      const dateTo = new Date(banner.dateTo);

      // Check if the current date is past the expiry date
      const isExpired = new Date() > dateTo;

      // Add the `expiry` field
      return {
        ...banner.toObject(), // Convert the Mongoose document to a plain JS object
        expiry: isExpired
      };
    });

    // Sort the banners by position. If `position` is missing, it defaults to Infinity (i.e., it will appear last)
    const sortedBanners = bannersWithExpiry.sort((a, b) => {
      return (a.position || Infinity) - (b.position || Infinity);
    });

    // Send the modified banners as the response
    res.json(sortedBanners);
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ error: error.message });
  }
};




exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await AdBanner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};