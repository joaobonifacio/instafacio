const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {

  bcrypt.hash(req.body.password, 10)
  .then(hash => {

    const user = new User({
      email: req.body.email,
      password: hash
    });

    user.save()
    .then(result => {

      res.status(201).json({
        message: "User Added",
        id: result._id,
        email: result.email,
        pass: result.password,
        v: result.__v
      });
    })
    .catch(err => {

      res.status(500).json({
        message: "Invalid Authentication credentials!"
      });
    });
  });
}

exports.userLogin = (req, res, next) => {

  // 1 verificar se o email existe

  let fetchedUser;

 User.findOne({ email: req.body.email })
 .then(user => {

   if(!user){
     return res.status(401).json({
       message: "Auth failed"
     });
   }

   fetchedUser = user;

   // compare pass inserted and hashed pass in db
   return bcrypt.compare(req.body.password, user.password);
 })
 .then(result => {

     if(!result) {
       return res.status(401).json({
         message: "Invalid logging credentials"
       });
     }
     // create token
     const token = jwt.sign(
       { email: fetchedUser.email, userId: fetchedUser._id },
       process.env.JWT_KEY,
       { expiresIn: "1h" }
       );

       res.status(200).json({
         token: token,
         expiresIn: 3600,
         userId:  fetchedUser._id
       });
   })
   .catch(err => {
     return res.status(401).json({
       message: "Error in logging credentials"
     });
   });
}
