const datamodel = require('../model/user.js')
const noters = require('../model/note.js')
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

class userController{

    static home =(req,res)=>{
    res.render('home')
    }

    static register = (req,res)=>{
        res.render("register");
    }

    static login = (req,res)=>{
        res.render("login",{title:"login Page",msg:null});
    }

    static isAuth = (req,res,next)=>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/login')
    }}

    static registerUser = async(req,res)=>{
        try {
          const {name,email,password} = req.body
          const user = await datamodel.findOne({email})
          if(user!=null){
              res.send("this is a registered user")
          }else{
              if(name && email && password){
                  const hashpass = await bcrypt.hash(req.body.password,10);
      
              const newdata = new datamodel({
                  name:req.body.name,
                  email:req.body.email,
                  password:hashpass,
              });    
              await newdata.save();
              res.redirect('/login')
              }else{
                  res.send("fill all the details")
              }
          
          }
      } catch (error) {
          res.send("user is not register")
      }
      }
    
    static loginuser = async (req,res)=>{
        try {
            const{email,password} = req.body;
            if(email && password){
                const user = await datamodel.findOne({email:email});
                // console.log(user);
                if(user!=null){
                    const hashcompare = await bcrypt.compare(password,user.password);
                    if(hashcompare){
                        req.session.username = email;
                        req.session.isAuth = true;
                        res.redirect('/dashboard')
                    }else{
                        res.render("login",{title:"login Page",msg:"email or password not matched"});
                    }
                }
                else{
                    res.render("login",{title:"login Page",msg:"this email is not registered"});
                }
            }
            else{
                res.render("login",{title:"login Page",msg:"all feild are required"});
            }
        } catch (error) {
            console.log(error);
            res.render("login",{title:"login Page",msg:"there is some issue"});
        }
    }

    static dashboard = async(req,res)=>{
        const email = req.session.username;
        const userdetail = await datamodel.findOne({email:email});
        
        const notedetail = await noters.find({email:email});
        console.log(notedetail);
        res.render('dashboard',{data:notedetail,detail:userdetail})
    }

    static logout = (req,res)=>{
        req.session.destroy((err)=>{
            if(err) {throw err}
            else{
            res.redirect('/')}
        })
    }

    static addnoteshow = (req,res)=>{
        res.render("addnote");
    }

    static addnote =async(req,res)=>{
        const email = req.session.username;
        console.log(req.body);
        const note = new noters({
            email:email,
            title:req.body.title,
            content:req.body.content,
            priority:req.body.priority
        })
        await note.save();
        res.redirect('/dashboard')
    }

    static editnote = async(req,res)=>{
        try {
            const notedetail= await noters.findOne({_id:req.params.id})
            const {title,content} = notedetail
            const doc = new noters({
            title:title,
            content:content
        })        
            res.render('updatenote',{data:doc})
        } catch (error) {
            console.log(error);
        }
    }

    static updatenote = async(req,res)=>{
            const _id = req.params.id;
            console.log(mongoose.Types.ObjectId.isValid(_id));
            const {title,content} = req.body
            console.log(req.body);
            console.log(req.params.id);
            const {ObjectId} = require('mongodb')
            const userdetail = await noters.findOne({_id:req.params.id});
            console.log(userdetail);
            console.log(await noters.findByIdAndUpdate({_id:req.params.id},{$set:{title:title,content:content}}).exec());
            res.redirect('/dashboard')
        
    }

    static deletenote = async(req,res)=>{
        const userdetail = await noters.findOne({_id:req.params.id});
        console.log(userdetail);
        const notedetail= await noters.deleteOne({_id:req.params.id})
        res.redirect('/dashboard')
    }

    static search = async(req,res)=>{
        const email = req.session.username;
        const priority = req.body.search;
        const userdetail = await datamodel.findOne({email:email});
        const notedetail = await noters.find({email:email,priority:priority});
        console.log(notedetail);
        if(notedetail!=undefined){res.render('dashboard',{data:notedetail,detail:userdetail})}
        else {
            res.render('dashboard',{msg:"no data found",detail:userdetail})
        }
    }
}

module.exports = userController;

