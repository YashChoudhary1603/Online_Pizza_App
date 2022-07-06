const homeC = require("../app/http/controllers/homeController");
const authC = require("../app/http/controllers/authController");
const cartC = require("../app/http/controllers/customers/cartController");
const guest =require('../app/http/middleware/guest')
const orderC = require("../app/http/controllers/customers/orderController");
const auth = require('../app/http/middleware/auth')
const AdminC = require("../app/http/controllers/admin/adminController");
const admin = require("../app/http/middleware/admin");
const statusC = require("../app/http/controllers/admin/statusController");


function initRoute(app){
    //Yha homeC se ek function milega usko call karenge than call ke baad jo return ayega wo ek object hai 
    //jiske ander ek index function hai usko .index karke call karenge
    app.get("/", homeC().index);
    app.get("/login",guest, authC().login);
    app.post("/login", authC().postlogin);
    app.get("/register",guest,authC().register);
    app.post('/register', authC().postRegister)
    app.post('/logout',authC().logout)
    app.get("/cart",cartC().index);
    app.post("/update-cart",cartC().update);

    //cutomer routes
    app.post("/orders",auth,orderC().store);
    //app.post("/cleanCart", auth, orderC().cleanCart);
    app.get('/customer/orders',auth, orderC().index)
    //Admin routes
    app.get('/admin/orders',admin, AdminC().index);
    app.post('/admin/orders/status',admin, statusC().update)
    app.get("/admin/orders/status", admin, statusC().backk);
    
    app.get("/customer/orders/:id", auth, orderC().show);

}





module.exports = initRoute;