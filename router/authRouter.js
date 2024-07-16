const express = require("express");
const router = express.Router();
const { 
  postRegData,
  postLoginData,
  viewProfile,
  // userAuth,
} = require("../controller/authController");
const AuthJwt = require("../middle-ware/isAuth");

const multer = require("multer");
const path = require("path");

//to use the images folder after adding it to database
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(
      null,
      path.join(__dirname, "..", "uploads", "auth"),
      (err, data) => {
        if (err) throw err;
      }
    );
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname, (err, data) => {
      if (err) throw err;
    });
  },
});

// MIME (Multipurpose Internet Mail Extensions)
//file.mimetype==='image/jpg'
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype.includes("png") ||
    file.mimetype.includes("jpg") ||
    file.mimetype.includes("jpeg") ||
    file.mimetype.includes("webp")
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fieldSize: 1024 * 1024 * 5 },
});

const upload_type = upload.single('user_image')


// registration paths
router.post("/auth/sign-up",upload_type, postRegData);

// login paths

router.post("/auth/sign-in", postLoginData);

//logout path
// router.get("/sign-out", signOut);

//profile path
router.get("/profile", AuthJwt.authJwt, viewProfile);

module.exports = router;
