const Order = require("../../../models/order");
const moment = require("moment");
function orderController() {
  return {
    store(req, res) {
      //validate request
      const { address, phone } = req.body;
      if (!phone || !address) {
        req.flash("error", "All fields are required");
        return res.redirect("/cart");
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });

      order
        .save()
        .then((result) => {
          Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
            req.flash("success", "Order placed successfully");
            delete req.session.cart;
            //Emit
            const eventEmitter = req.app.get("eventEmitter"); //app ka use karke usko get kate hue
            eventEmitter.emit("orderPlaced", placedOrder);
            return res.redirect("/customer/orders"); 
          });
        })
        .catch((err) => {
          req.flash("error", "Something Went Wrong");
          return res.redirect("/cart");
        });
    },

    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      //console.log(orders);
      res.header("Cache-Control", "no-store");
      res.render("customer/orders", { orders: orders, moment: moment });
    },

    async show(req, res) {
      const order = await Order.findById(req.params.id);
      //authorize user
      if (req.user._id.toString() === order.customerId.toString()) {
        res.render("customer/singleOrder", { order: order });
      } else {
        return res.render("/");
      }
    },


    // cleanCart(req,res){
    //   delete req.session.cart;
    //   return res.redirect("/cart");

    // }
  };
}

module.exports = orderController;
