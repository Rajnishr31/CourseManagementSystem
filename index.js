const express = require('express');
const mongoose = require('mongoose');
const route = require('./src/route');

const app = express();
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://purunaik:purunaik@cluster0.zgxxxk0.mongodb.net/course-management-system", {useNewUrlParser: true})
.then(()=>console.log("Connected to mongoose..."))
.catch((err)=>console.log(err));

app.use('/', route);

app.listen(3000, (err)=>{
    if(err) console.log(err);
    console.log("Application is running...");
});
