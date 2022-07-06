const Order = require("../../../models/order");

function adminController() {
  return {
    index(req, res) {
      Order.find({ status: { $ne: "completed" } }, null, {
        sort: { createdAt: -1 },
      }).populate('customerId', '-password').exec((err,Orders)=>{
            if(req.xhr){
               return res.json(Orders)
            }
            
            return res.render('admin/orders')
      });
    },
  };
}

module.exports = adminController;
