const express= require('express');
const router = express.Router();
const wrapasync = require('../utils/wrapasync.js');
const {isLoggedIn, isOwner, validateItem}=require('../middleware.js');
const itemController=require('../controllers/items.js');
const multer=require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({storage});

router
   .route('/')
   .get( wrapasync(itemController.index))
   .post(isLoggedIn,  
        validateItem,
         upload.single('imageUrl'),
        wrapasync(itemController.createListing))// add item to Lostpage
   
// add item to Lostpage
router.get('/new', isLoggedIn, itemController.renderNewForm)


router  
   .route('/:id')
   .get( wrapasync(itemController.showListing))//Show route for particular id
   .put(isLoggedIn,       //edit route update the listing details for particular id 
     isOwner,
     validateItem, 
     wrapasync(itemController.updateListing))
     .delete(isLoggedIn,  // Delete route for particular id
     isOwner,
     wrapasync(itemController.destroyListing));


// Edit route for particular id
router.get("/:id/edit",
   isLoggedIn,
   isOwner,
    wrapasync( itemController.renderEditForm));


module.exports=router;