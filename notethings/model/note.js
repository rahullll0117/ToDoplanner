const mongoose = require('mongoose');
const userschema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
    },

    title:{
        type:String,
        trim:true,
    },
    content:{
        type:String,
    },
    priority:{
        type:String
    },
    time:{
        type:Date,
        default:Date.now
    }
});
module.exports = mongoose.model("noters",userschema);

