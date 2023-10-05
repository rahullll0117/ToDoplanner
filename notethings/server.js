const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const mongodbSession = require('connect-mongodb-session')(session);
const mongouri = 'mongodb+srv://yrahulkumar012:1234@cluster0.yoi0ls6.mongodb.net/?retryWrites=true&w=majority';
const router = require('./routes/web.js')
const port = process.env.port || 8000;

app.use(express.urlencoded({extended:true}));

mongoose.connect(mongouri,{useNewUrlParser:true,useUnifiedTopology:true})
.then((res)=>{
    console.log("mongodb connected");
})
const store = new mongodbSession({
    uri:mongouri,
    collection:"mySession"
})
app.use(
    session({
        secret:"key that will sign cookie",
        resave:false,
        saveUninitialized:false,
        store:store

    })
)

app.set('view engine','ejs');

app.use('/',router);
app.listen(port,()=>{
    console.log(`connecting at port ${port}`);
})