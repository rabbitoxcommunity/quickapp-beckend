const Privacy = require("../Models/Privacy");

exports.addOrUpdatePrivacy = async (req, res) => {
    try {
        console.log(req.body,'test')
        const { title, desc } = req.body;

        // Validate input
        if (!title || !desc) {
            return res.status(400).json({ msg: 'Please provide both title and description' });
        }

        // Check if terms already exist
        let privacy = await Privacy.findOne();

        if (privacy) {
            // Update existing terms
            privacy.title = title;
            privacy.desc = desc;
            await privacy.save();
            
            return res.json({
                msg: 'Privacy policy updated successfully',
                privacy: privacy
            });
        } else {
            // Create new terms
            privacy = new Privacy({ title, desc });
            await privacy.save();

            return res.status(201).json({
                msg: 'Privacy policy added successfully',
                privacy: privacy
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getPrivacy = async (req, res) => {
    try {
        const privacy = await Privacy.findOne();

        if (!privacy) {
            return res.status(404).json({ msg: 'privacy policy not found' });
        }

        res.json({
            msg: 'Privacy and Policy retrieved successfully',
            privacy: privacy
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};