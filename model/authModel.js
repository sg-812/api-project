const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const AuthSchema=new Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:false
    },
    dob:{
       type:Date,
       required:false
    },
    email:{
        type:String,
        required:true
    },
   password:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    user_image:{
        type:String,
        required:false
    },
},{
    timestamps: true,
    versionKey: false
})

const AuthModel = new mongoose.model("user_details", AuthSchema);  
module.exports = AuthModel;



