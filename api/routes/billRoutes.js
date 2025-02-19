const express = require('express');
const multer = require('multer');
const router = express.Router();
const { addBill, getBills, deleteBill } = require('../controllers/billController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add', upload.array('files'), addBill);
router.get('/', getBills);
router.delete('/:id', deleteBill);

module.exports = router;
