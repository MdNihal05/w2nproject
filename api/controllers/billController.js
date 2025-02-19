const Bill = require("../models/Bill");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "bills",
        public_id: fileName,
        resource_type: "auto",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const addBill = async (req, res) => {
  try {
    const { category, amount, note, name, date } = req.body;
    let fileUrls = [];
    let filePublicIds = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, file.originalname)
      );
      const uploadResults = await Promise.all(uploadPromises);
      fileUrls = uploadResults.map((result) => result.secure_url);
      filePublicIds = uploadResults.map((result) => result.public_id);
      console.log(uploadResults, filePublicIds)
    }

    const bill = await Bill.create({
      category,
      amount,
      note,
      date,
      name,
      files: fileUrls,
      filePublicIds,
    });
    console.log(bill);
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findById(id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    if (bill.filePublicIds && bill.filePublicIds.length > 0) {
      const deletePromises = bill.filePublicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      );
      await Promise.all(deletePromises);
    }

    await Bill.findByIdAndDelete(id);
    res.json({ message: "Bill and associated files deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBill,
  getBills,
  deleteBill,
};
