const ProductModel = require("../model/product");
const fs = require("fs");
const path = require("path");

// post value of add product
const postValue = async (req, res) => {
  try {
    console.log("Collected value from add product form: ", req.body, req.file);

    // let imgArray = req.files.map((file) => file.filename);
    // console.log("Images of product", imgArray);

    if (!req.body.product_name) {
      return res.status(401).json({
        success: false,
        message: "Product name is required",
      });
    } else if (!req.body.product_price) {
      return res.status(401).json({
        success: false,
        message: "Product price is required",
      });
    } else if (!req.body.product_company) {
      return res.status(401).json({
        success: false,
        message: "Company is required",
      });
    } else {
      const formData = new ProductModel({
        product_name: req.body.product_name.toLowerCase(),
        product_price: req.body.product_price,
        product_company: req.body.product_company.toLowerCase(),
        product_image: req.file.filename,
        // product_image: imgArray,
      });
      let saved = await formData.save();
      // console.log(saved,"Saved Product");
      if (saved) {
        console.log("Product is saved");
        return res.status(200).json({
          success: true,
          message: "Product added successfully",
        });
      }
    }
  } catch (err) {
    console.log("Error at collecting product", err);
    return res.status(401).json({
      success: false,
      message: err,
    });
  }
};

// view all products
const viewProducts = async (req, res) => {
  try {
    let products = await ProductModel.find().select(
      "_id product_name product_price product_price product_company product_image"
    );
    if (products) {
      return res.status(201).json({
        success: true,
        message: "All products are fetched successfully",
        result: products,
        status:201
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Product fetcheing failed " + err,
    });
  }
};

//delete specific product
const deleteProduct = async (req, res) => {
  try {
    let product_id = req.params.id;
    console.log("Id of the product to be deleted", product_id);
    let deleted = await ProductModel.findOneAndDelete({ _id: product_id });
    console.log("Deleted", deleted);
    if (deleted) {
      // deleted.product_image.forEach((file) => {
      //   // console.log("Unlink",file);
      //   let filePath = path.join(__dirname, "..", "uploads", "product", file);
      //   fs.unlinkSync(filePath);
      // });
      let filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "product",
        deleted.product_image
      );
      fs.unlinkSync(filePath);
      return res.status(204).json({
        success: true,
        message: "Product deleted successfully",
      });
    }
  } catch (err) {
    console.log("Error in deletion: ", err);
    return res.status(401).json({
      success: false,
      message: "Product deletion failed",
    });
  }
};

//post edited data
const editPage = async (req, res) => {
  try {
    console.log("Received new value: ", req.body, req.file);
    const prod_id = req.params.id;
    const new_img_url = req.file;
    let ProductData = await ProductModel.findById(prod_id);
    console.log("Existing data", ProductData);
    ProductData.product_name = req.body.product_name || ProductData.product_name ;
    ProductData.product_price = req.body.product_price || ProductData.product_price ;
    ProductData.product_company = req.body.product_company || ProductData.product_company;
    if (new_img_url === undefined) {
      ProductData.product_image = ProductData.product_image;
    } else {
      let filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "product",
        ProductData.product_image
      );
      console.log("image url",filePath);
      fs.unlinkSync(filePath);
      console.log(new_img_url.path);
      ProductData.product_image = new_img_url.filename;
    }
    let saved = await ProductData.save();
    console.log(saved);
    if (saved) {
      console.log("Product is saved");
      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
      });
    }
  } catch (err) {
    console.log("Error for edit:", err);
    return res.status(401).json({
      success: false,
      message: "Product updation failed",
    });
  }
};

const getSingleProduct=async(req,res)=>{
  try{
     let product_id=req.params.id;
     // console.log("Product id",product_id)
     let single=await ProductModel.findById(product_id)
     // console.log("Collected product by id:",single)
     if(single){
        res.render('User/productDetails',{
           title:"Details",
           data:single
        })
     }      
  }
  catch(err){
      console.log("Product not found",err)
   }
}



//searching specific product according to either product name orr prroduct company
const searchProduct = async (req, res) => {
  try {
    const searchText = req.body.searchText.trim().toLowerCase();
    // console.log("Searching text: ", searchText);
    if (searchText) {
      let result = await ProductModel.find({
        $or: [{ product_name: searchText }, { product_company: searchText }],
      });
      // console.log("Searched product: ",result);
      if (result) {
        res.render("Admin/ViewProductAdmin", {
          title: "Product list after searcing",
          path: "/admin/products",
          data: result,
        });
      }
    } else {
      let product = await ProductModel.fetchData();
      if (product) {
        res.render("Admin/ViewProductAdmin", {
          title: "all product",
          path: "/admin/products",
          data: product,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};



module.exports = {
  postValue,
  viewProducts,
  deleteProduct,
  editPage,
  searchProduct,
  getSingleProduct
 
};
