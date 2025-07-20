const express= require('express');
const router = express.Router({mergeParams : true});
const wrapasync = require('../utils/wrapasync.js');
const {isLoggedIn, validateClaim, isClaimOwner}=require('../middleware.js');
const claimController = require('../controllers/claim');


// Claim items route for creation and deletion

router.post('/', 
    isLoggedIn,
    validateClaim,
    wrapasync(claimController.addNewClaim));

//to delete a claim
router.delete("/:claimid",
     isLoggedIn,
     isClaimOwner,
      wrapasync (claimController.destroyClaim))

// Approve a claim
router.post('/:claimid/approve',
   isLoggedIn,
   wrapasync(claimController.approveClaim));

// Reject a claim
router.post('/:claimid/reject',
    isLoggedIn, 
    wrapasync(claimController.rejectClaim));


module.exports = router;