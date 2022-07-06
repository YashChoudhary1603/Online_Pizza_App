const LocalStrategy = require('passport-local').Strategy;
const User =require('../models/user')
const bcrypt = require('bcrypt');

function init(passport){
    passport.use(
      new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
          //check if email exist
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "No user with this email" });
          }

          bcrypt
            .compare(password, user.password)
            .then((match) => {
              if (match) {
                return done(null, user, { message: "Loged in Succesfull" });
              }
              return done(null, false, { message: "Wrong Password or Username" });
            })
            .catch((err) => {
              return done(null, false, { message: "Something went wrong" });
            });
        }
      )
    );

    passport.serializeUser((user,done)=>{
        done(null,user._id) //yha hum id ke alawa user ki aur bhi koi property ko session me  store karwa sakte hai
    })

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });



}

module.exports = init