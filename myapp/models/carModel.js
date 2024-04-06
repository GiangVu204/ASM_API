
const {mongoose} = require('./db');
const carSchema = new mongoose.Schema(
   {
       ten:{type:String, required: true},
       namSX:{type:Number},
       hang:{type:String, required: true},
       gia:{type:Number},
       hinhAnh:{type:String}
   },
   {
       collection: 'Car'
   }
);
let Car = mongoose.model('Car', carSchema);
module.exports = {Car}
