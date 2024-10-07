const AdBanner = require("../Models/AdBanner");


exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { dateFrom, dateTo, url, position } = req.body;
    console.log(dateFrom, dateTo, url, ':::::');
    if (!dateFrom || !dateTo || !url || !position) {
      return res.status(400).json({ error: 'Date From, Date To, Position, and URL are required' });
    }
    const existingBanner = await AdBanner.findOne({ position });
    if (existingBanner) {
      return res.status(400).json({ error: 'Position is already in use' });
    }


    const banner = new AdBanner({
      image: req.file.path,
      type: 'ad',
      dateFrom,
      dateTo,
      position,
      url
    });


    await banner.save();


    res.status(201).json(banner);
  } catch (error) {

    res.status(400).json({ error: error.message });
  }
};



exports.getAllBanners = async (req, res) => {
  try {

    const banners = await AdBanner.find().sort({ createdAt: -1 });


    const bannersWithExpiry = banners.map(banner => {
      const dateFrom = new Date(banner.dateFrom);
      const dateTo = new Date(banner.dateTo);


      const isExpired = new Date() > dateTo;


      return {
        ...banner.toObject(),
        expiry: isExpired
      };
    });


    const nonExpiredBanners = bannersWithExpiry.filter(banner => !banner.expiry);


    const sortedBanners = nonExpiredBanners.sort((a, b) => {
      return (a.position || Infinity) - (b.position || Infinity);
    });


    res.json(sortedBanners);
  } catch (error) {

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