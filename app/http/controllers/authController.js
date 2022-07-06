const User =require("../../models/user");

const bcrypt = require('bcrypt');
const passport = require("passport");

function authController() {
  //factory function
  const _getRedirectUrl = (req) => {
        return req.user.roll === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    
  return {
    login(req, res) {
      res.render("auth/login");
    },


    //the post request handdler function
    postlogin(req,res,next){
      const {email ,password} = req.body;
      //validate Request
      if(!email || !password){
        req.flash('error',"All Fields are required")
        return res.redirect('/login');
      }
      passport.authenticate('local',(err ,user ,info)=>{
        if(err){
          req.flash('error',info.message)
          return next(err)
        }
        if(!user){
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }           
         return res.redirect(_getRedirectUrl(req));
      })

    })(req,res,next)
  },

    register(req,res){
        res.render("auth/register");
    },

     //the post request handdler function
    async postRegister(req,res){

      const user1 = { name:req.body.name, 
                      email:req.body.email , 
                      password:req.body.password} 
      console.log(user1);

      //valiadte request
      if(!user1.name || !user1.email || !user1.password){
        req.flash('err','All fields are required ')// to make an message display on fontend when all fields are not filled 
        req.flash('name',user1.name);
        req.flash('email',user1.email);
        return res.redirect('/register')
      }
      
      //check if email exxist
      User.exists({email:user1.email},(err ,result)=>{
        if(result){
          req.flash("err", "Email Already in use"); // to make an message display on fontend when all fields are not filled
          req.flash("name", user1.name);
          req.flash("email", user1.email);
          res.redirect("/register");
        }
         
      })
       
      //hashing the password
      const hashPassword = await bcrypt.hash(user1.password,10); 



      //create the user in database
      const user = new User({
        name: user1.name,
        email: user1.email,
        password: hashPassword,
      });
      
      console.log(user)
      //saving the user
     //const store = await user.save();
     user.save().then((user)=>{
          //automatic login
          return res.redirect('/')
     }).catch(err =>{
        req.flash('err','Something Went wrong')
        return res.redirect('/register')
     })
     


      
    },

    logout(req,res){
      req.logout();
      res.redirect('/')
    }
  }
}

module.exports = authController;
