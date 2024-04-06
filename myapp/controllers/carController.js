const { Car } = require('../models/carModel');

exports.lay_ds = async (req, res, next) => {
   let dieuKien = null;
   try {
       if (typeof(req.query.tenxe) !== 'undefined') {
           dieuKien = { ten: req.query.tenxe };
       }
       let list = await Car.find(dieuKien);
       res.status(200).json(list);
   } catch (error) {
       res.status(400).json({ "msg": error.message });
   }
};

exports.xem_chi_tiet = async (req, res, next) => {
   try {
       let id = req.params.id;
       let objXe = await Car.findById(id);
       res.status(200).json(objXe);
   } catch (error) {
       res.status(400).json({ "msg": error.message });
   }
};

exports.them_xe = async (req, res, next) => {
   try {
       let { ten, namSX, hang, gia, hinhAnh } = req.body;
       if (ten.length < 3) {
           return res.status(400).json({ "msg": 'Tên xe phải nhập ít nhất 3 ký tự' });
       }

       let kq = await Car.create({
        ten: ten,
        namSX: namSX,
        hang: hang,
        gia: gia,
        hinhAnh: hinhAnh
      });
       res.status(201).json(kq);
   } catch (error) {
       res.status(400).json({ "msg": error.message });
   }
};

exports.sua_xe = async (req, res, next) => {
   try {
       let id = req.params.id;
       let { ten, namSX, hang, gia, hinhAnh } = req.body;
       let objXe = await Car.findById(id);

       if (!objXe) {
           return res.status(404).json({ "msg": "Không tìm thấy xe" });
       }

       let kq = await Car.findByIdAndUpdate(id, {
        ten: ten,
        namSX: namSX,
        hang: hang,
        gia: gia,
        hinhAnh: hinhAnh
      }, { new: true });

       res.status(200).json(kq);
   } catch (error) {
       res.status(400).json({ "msg": error.message });
   }
};

exports.xoa_xe = async (req, res, next) => {
    try {
        let id = req.params.id;
        let objXe = await Car.findById(id);
 
        if (objXe && typeof objXe.remove === 'function') {
         await objXe.remove();
         res.status(200).json({ "msg": "Xóa xe thành công" });
       } else {
         res.status(404).json({ "msg": "Không tìm thấy xe" });
       }
    } catch (error) {
        res.status(400).json({ "msg": error.message });
    }
 };