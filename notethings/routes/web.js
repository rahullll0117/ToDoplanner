const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');

router.use('/dashboard',userController.isAuth)
router.use('/addnote',userController.isAuth)
router.use('/addnoteshow',userController.isAuth)

router.get('/',userController.home)
router.get('/register',userController.register)

router.post('/register',userController.registerUser)

router.get('/login',userController.login)

router.post('/login',userController.loginuser)

router.get('/dashboard',userController.dashboard)

router.post('/logout',userController.logout)

router.get('/addnoteshow',userController.addnoteshow)
router.post('/addnote',userController.addnote)

router.get('/editnote/:id',userController.editnote)
router.patch('/updatenote/:id',userController.updatenote)
router.get('/deletenote/:id',userController.deletenote)

router.post('/dashboard/search',userController.search)

module.exports = router;