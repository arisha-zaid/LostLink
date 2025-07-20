const mongoose = require('mongoose');
const User = require('./User');

const claimSchema = new mongoose.Schema({
  claimant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
   },
  itemId: mongoose.Schema.Types.ObjectId, // ID of LostItem or FoundItem
  itemType: { 
    type: String, 
    enum: ['lost', 'found'] 
    },
  message: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
   },
  createdAt: { 
    type: Date, 
    default: Date.now 
   }
});

module.exports = mongoose.model('Claim', claimSchema);