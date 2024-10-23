const Bid = require("../Models/Bid");
const Price = require("../Models/Price");


exports.addPrice = async (req, res) => {
  try {
    const { name } = req.body;


    let price = await Price.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (price) {
      return res.status(400).json({ msg: 'Price Title already exists' });
    }


    price = new Price({ name });
    await price.save();

    res.status(201).json(price);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};


exports.getAllPrice = async (req, res) => {
  const { page, limit, search = '', exact = false } = req.body;

  try {

    let searchCriteria = {};

    if (search) {
      if (exact) {

        searchCriteria = { name: search };
      } else {

        searchCriteria = { name: { $regex: search, $options: 'i' } };
      }
    }

    let price;
    let totalPrices;

    if (page && limit) {

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      price = await Price.find(searchCriteria)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);


        totalPrices = await Price.countDocuments(searchCriteria);
    } else {

        price = await Price.find(searchCriteria);
        totalPrices = price.length;
    }


    res.json({
      price,
      totalPrices,
      totalPages: page && limit ? Math.ceil(totalPrices / limit) : 1,
      currentPage: page ? parseInt(page, 10) : null,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};



exports.deletePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const price = await Price.findById(id);
    if (!price) {
      return res.status(404).json({ msg: 'Price For not found' });
    }

    await Price.findByIdAndDelete(id);
    res.json({ msg: 'Price deleted successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Price for not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
};

