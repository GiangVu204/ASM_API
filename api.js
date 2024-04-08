const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const carModel = require('./carModel');
const COMMON = require('./COMMON');
const upload = require("./upload");

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
        // const { ten, namSX, hang, gia, anh } = req.body;
        const data = req.body;

        // Tạo đối tượng CarModel mới
        const newCar = new carModel({
            ten: data.ten,
            namSX: data.namSX,
            hang: data.hang,
            gia: data.gia,
            anh: data.anh,
        });

        const result = await newCar.save();
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Thêm không thành công",
                "data": []
            })

        }
    } catch (error) {
        console.log(error);
    }

    // Lưu đối tượng CarModel vào cơ sở dữ liệu
    // const savedCar = await newCar.save();

    //     res.status(200).json(savedCar);
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: 'Lỗi khi thêm sản phẩm' });
    // }
});

// Route PUT "/api/updateCar/:id" để cập nhật thông tin của một xe
router.put('/updateCar/:id', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const carId = req.params.id; // Lấy id của xe từ URL
        const { ten, namSX, hang, gia, anh } = req.body; // Lấy thông tin cần cập nhật từ body của yêu cầu

        // Tìm xe theo id và cập nhật thông tin
        const updatedCar = await carModel.findByIdAndUpdate(carId, { ten, namSX, hang, gia, anh }, { new: true });

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

//get fruit have name a or x
router.get('/get-list-carModel-have-name-a-or-x', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const cars = await carModel.find({
            $or: [
                { ten: { $regex: 'A' } },
                { ten: { $regex: 'X' } },
            ]
        });

        res.json({
            status: 200,
            messenger: 'Danh sách xe',
            data: cars
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách xe' });
    }
});

// Route GET "/api/cars" để tìm kiếm xe theo tên
router.get('/search', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const { name } = req.query; // Lấy giá trị của tham số truy vấn 'name' từ URL

        const cars = await carModel.find({ ten: { "$regex": name, "$options": 'i' } }); // Tìm kiếm xe theo tên (tên chứa từ khóa, không phân biệt hoa thường)

        res.status(200).json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi tìm kiếm xe' });
    }
});

router.get('/sort', async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const { sortBy } = req.query; // Lấy giá trị của tham số truy vấn 'sortBy' từ URL

        let sortOption = {};

        if (sortBy === 'asc') {
            sortOption = { gia: 1 }; // Sắp xếp tăng dần theo giá
        } else if (sortBy === 'desc') {
            sortOption = { gia: -1 }; // Sắp xếp giảm dần theo giá
        }

        // Lấy danh sách các xe và sắp xếp theo tùy chọn
        const cars = await carModel.find().sort(sortOption);

        res.status(200).json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi sắp xếp sản phẩm' });
    }
});

router.post('/add-car-with-images', upload.single('anh'), async (req, res) => {
    try {
        await mongoose.connect(COMMON.uri);

        const data = req.body;

        // Vì chỉ có một ảnh, req.file chứa tệp được tải lên
        const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";

        const newCar = new carModel({
            ten: data.ten,
            namSX: data.namSX,
            hang: data.hang,
            gia: data.gia,
            anh: imageUrl // Lưu URL của hình ảnh
        });

        const result = await newCar.save();
        res.json({
            "status": 200,
            "messenger": "Thêm thành công",
            "data": result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ "status": 500, "messenger": "Lỗi khi thêm sản phẩm", "data": [] });
    }
});


module.exports = router;