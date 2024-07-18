const AuthModel = require("../model/authModel");
const bcrypt = require("bcryptjs");

// token setup
const jwt = require("jsonwebtoken");

// ************************************ Registration Part ************************************

//post registration form's value
const postRegData = async (req, res) => {
  try {
    console.log("Collected from registration form", req.body, req.file);
    if (!req.body.firstname) {
      return res.status(401).json({
        success: false,
        message: "Firstname is required",
      });
    } else if (!req.body.lastname) {
      return res.status(401).json({
        success: false,
        message: "Lastname  is required",
      });
    } else if (!req.body.username) {
      return res.status(401).json({
        success: false,
        message: "Username is required",
      });
    } else if (!req.body.email) {
      return res.status(401).json({
        success: false,
        message: "Email is required",
      });
    } else if (!req.body.password) {
      return res.status(401).json({
        success: false,
        message: "Password is required",
      });
    } else if (!req.body.contact) {
      return res.status(401).json({
        success: false,
        message: "Contact is required",
      });
    } else {
      let verifyUser = await AuthModel.findOne({ email: req.body.email });
      // console.log("User found", verifyUser);
      if (verifyUser === null) {
        let hashPassword = await bcrypt.hash(req.body.password, 12);
        // console.log("After hashing:", hashPassword);
        let authData = new AuthModel({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          gender: req.body.gender,
          dob: req.body.dob,
          email: req.body.email,
          password: hashPassword,
          contact: req.body.contact,
          user_image: req.file.filename||null,
        });
        // console.log("Auth data to be saved ",authData);
        let savedUser = await authData.save();
        if (savedUser) {
          console.log("Registration done");
          return res.status(200).json({
            success: true,
            message: "Registration done",
            status: 200,
          });
        }
      } else {
        console.log("Existing email , try with another email address");
        return res.status(201).json({
          success: false,
          message: "Existing email , try with another email address",
          status: 201,
        });
      }
    }
  } catch (err) {
    console.log("Registration failed", err);
    return res.status(401).json({
      success: false,
      message: err,
    });
  }
};

// ************************************ Login Part ************************************

//post login form's value
const postLoginData = async (req, res) => {
  try {
    // console.log("After login", req.body)
    if (!req.body.email) {
      return res.status(401).json({
        success: false,
        message: "Email is required",
      });
    } else if (!req.body.password) {
      return res.status(401).json({
        success: false,
        message: "Password  is required",
      });
    } else {
      let existingUser = await AuthModel.findOne({ email: req.body.email });
      // console.log("existing",existingUser);
      if (!existingUser) {
        return res.status(401).json({
          success: false,
          message: "Invalid email",
        });
      } else {
        let result = await bcrypt.compare(
          req.body.password,
          existingUser.password
        );
        //  console.log(result,"password comparison");
        if (result) {
          console.log("Login done");
          let token_payload = { userdata: existingUser };
          const token_jwt = jwt.sign(token_payload, process.env.SECRET_KEY, {
            expiresIn: "1h",
          });
          return res.status(200).json({
            success: true,
            message: "Login done",
            status: 200,
            token: token_jwt,
          });
        } else {
          console.log("Wrong password");
          return res.status(201).json({
            success: false,
            message: "Wrong password",
            status: 201,
          });
        }
      }
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error occured " + error,
    });
  }
};


// ************************************ Profile Part ************************************

//view profile page
const viewProfile = async (req, res) => {
  try {
    let user_data = req.user.userdata;
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      status: 200,
      result: user_data,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }
};



module.exports = {
  postRegData,
  postLoginData,
  viewProfile,
};
