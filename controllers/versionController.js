const Version = require("../Models/Version");


// Fetch the latest app version
exports.getLatestVersion = async (req, res) => {
  try {
    const latestVersion = await Version.findOne().sort({ createdAt: -1 }); // Get the newest version
    if (!latestVersion) {
      return res.status(404).json({ message: 'No version info available.' });
    }
    res.status(200).json(latestVersion);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Create or update the app version
exports.setVersion = async (req, res) => {
  const { version, updateRequired, androidUrl, iosUrl } = req.body;

  console.log(req.body,'body::::')

  if (!version || !androidUrl || !iosUrl) {
    return res.status(400).json({ error: 'Version and update URL are required.' });
  }

  try {
    const newVersion = await Version.create({ version, updateRequired, androidUrl, iosUrl });
    res.status(201).json({ message: 'Version updated successfully', data: newVersion });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
