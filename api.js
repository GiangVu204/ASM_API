const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const carModel = require('./carModel');
const COMMON = require('./COMMON');

// Middleware để đọc dữ liệu từ body của yêu cầu POST
router.use(express.json());

// Route GET "/api" để kiểm tra hoạt động của API
router.get('/', (req, res) => {
    res.send('vao api mobile');
});

// Route GET "/api/list" để lấy danh sách các xe
router.get('/list', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const cars = await carModel.find();
        console.log(cars);

        res.status(200).json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách xe' });
    }
});

// Route POST "/api/addCar" để thêm một xe mới
router.post('/addCar', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        // Lấy thông tin sản phẩm từ body của yêu cầu
        const { ten, namSX, hang, gia } = req.body;

        // Tạo đối tượng CarModel mới
        const newCar = new carModel({
            ten,
            namSX,
            hang,
            gia
        });

        // Lưu đối tượng CarModel vào cơ sở dữ liệu
        const savedCar = await newCar.save();

        res.status(200).json(savedCar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi thêm sản phẩm' });
    }
});

// Route PUT "/api/updateCar/:id" để cập nhật thông tin của một xe
router.put('/updateCar/:id', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const carId = req.params.id; // Lấy id của xe từ URL
        const { ten, namSX, hang, gia } = req.body; // Lấy thông tin cần cập nhật từ body của yêu cầu

        // Tìm xe theo id và cập nhật thông tin
        const updatedCar = await carModel.findByIdAndUpdate(carId, { ten, namSX, hang, gia }, { new: true });

        res.status(200).json(updatedCar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi cập nhật thông tin xe' });
    }
});
router.delete('/deleteCar/:id', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const carId = req.params.id; // Lấy id của xe từ URL

        // Xóa xe theo id
        await carModel.findByIdAndDelete(carId);

        res.status(200).json({ message: 'Xóa xe thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi xóa xe' });
    }
});

module.exports = router;