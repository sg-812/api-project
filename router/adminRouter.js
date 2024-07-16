const express = require("express");

const router = express.Router();
const {
  postValue,
  viewProducts,
  deleteProduct,
  editPage,
  getSingleProduct,
  searchProduct
} = require("../controller/adminController");

const AuthJwt = require("../middle-ware/isAuth");

const multer = require("multer");
const path = require("path");

//to use the images folder after adding it to database
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "..", "uploads","product"), (err, data) => {
      if (err) throw err;
    });
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname, (err, data) => {
      if (err) throw err;
    });
  },
});

//file.mimetype==='image/jpg'
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype.includes("png") ||
    file.mimetype.includes("jpg") ||
    file.mimetype.includes("jpeg")||
    file.mimetype.includes("webp")||
    file.mimetype.includes("jfif")
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


router.post("/add-product",AuthJwt.authJwt,upload.single('product_image'), postValue);

// router.post("/admin/postData", upload.array("product_images", 2),postValue);

router.get("/all-products", viewProducts);

router.delete("/delete-product/:id", deleteProduct);

router.put("/update-product/:id", upload.single('product_image'),editPage);

router.get('/single-product/:id',getSingleProduct)

router.post("/search-product", searchProduct);


module.exports = router;
