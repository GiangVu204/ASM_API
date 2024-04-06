
var express = require('express');
var router = express.Router();
var {lay_ds, xem_chi_tiet, them_xe, sua_xe, xoa_xe} = require('../controllers/carController');
// http://localhost:3000/api/xemay
router.get('/list-car', lay_ds );
// xem chi tiết
router.get('/list-car/:id', xem_chi_tiet);
router.post('/add-car', them_xe );
router.put('/update-car/:id', sua_xe);
router.delete('/delete-car/:id', xoa_xe);

module.exports = router;
