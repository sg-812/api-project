require('dotenv').config();

const express=require('express')
const appServer=express();

const cors =require('cors');

const mongoose=require('mongoose');
const PORT=process.env.PORT||1000;

// routing
const adminRouting=require('./router/adminRouter')
const authRouting=require('./router/authRouter');


// parsing
appServer.use(express.urlencoded({extended:true}))
appServer.use(express.json())

appServer.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
    next();
});
appServer.use(cors());

appServer.use(adminRouting);
appServer.use(authRouting);

appServer.use((req, res) => {
    res.send("<h1>PAGE  NOT FOUND!! Please recheck.</h1>");
  });

mongoose.connect(process.env.DB_URL)
.then(res=>{
    console.log("Database connected successfully");
    appServer.listen(PORT,()=>{
        console.log(`Server running at http://localhost:${PORT}`);
    })
})
.catch(err=>{
   console.log(err);
})

