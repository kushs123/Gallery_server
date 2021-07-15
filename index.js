const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');
const path = require('path');
var multer = require('multer');

const model = require("./models/image_model")
const app = express();


const db = "mongodb+srv://kushs123:Kush123@cluster0.dgfzb.mongodb.net/image_gallery?retryWrites=true&w=majority"
const port = 8000;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//---------------------------------------------mongoDB connection--------------------------------------------//
mongoose.connect(db,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false,
}).then(() => {console.log("Connection Successfully")}).catch(err => {console.log(err, "Connection Error")});

//---------------------------------------------Image upload in server----------------------------------------//
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
 
var upload = multer({ storage: storage });

//----------------------------------------------API endPoints-------------------------------------------------//

app.get("/", (req, res) => {
    model
    .find()
    .then((article)=>res.json(article))
    .catch((err)=>res.status(400).json(`Error : ${err}`));
})

app.post("/upload", upload.single("photo") ,(req, res) =>{
    const articles = new model({
        name:req.body.name,
        desc:req.body.desc,
        image:req.body.photo
    })

    articles
    .save()
    .then(()=>res.json("New article posted"))
    .catch((err)=>res.json(err))
});


app.put("/update", (req, res) => {
    res.send("Update")
})


app.delete("/delete", (req, res) => {
    res.send("Delete")
})


app.listen(port, function(){
    console.log("Server is running");
})