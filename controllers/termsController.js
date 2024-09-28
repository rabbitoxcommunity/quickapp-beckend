const Terms = require("../Models/Terms");

exports.addOrUpdateTerms = async (req, res) => {
    try {
        console.log(req.body,'test')
        const { title, desc } = req.body;

        // Validate input
        if (!title || !desc) {
            return res.status(400).json({ msg: 'Please provide both title and description' });
        }

        // Check if terms already exist
        let terms = await Terms.findOne();

        if (terms) {
            // Update existing terms
            terms.title = title;
            terms.desc = desc;
            await terms.save();
            
            return res.json({
                msg: 'Terms and conditions updated successfully',
                terms: terms
            });
        } else {
            // Create new terms
            terms = new Terms({ title, desc });
            await terms.save();

            return res.status(201).json({
                msg: 'Terms and conditions added successfully',
                terms: terms
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.getTerms = async (req, res) => {
    try {
        const terms = await Terms.findOne();

        if (!terms) {
            return res.status(404).json({ msg: 'Terms and conditions not found' });
        }

        res.json({
            msg: 'Terms and conditions retrieved successfully',
            terms: terms
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};