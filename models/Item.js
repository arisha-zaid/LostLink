// models/Item.js
const mongoose = require('mongoose');
const claim=require('./Claim');

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    default: 'lost',
    required: true
  },
  title: String,
  description: String,
  location: String,
  dateLost: Date,
  category: String,
  image: {
  url: String,
  filename: String
  },
  status: {
    type: String,
    enum: ['open', 'claimed'],
    default: 'open'
  },
  claims:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim'
  }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Middleware to delete associated claims when an item is deleted
itemSchema.post('findOneAndDelete', async (listing) => {
  if(listing){
    await claim.deleteMany({ _id: { $in: listing.claims } });
  }
})


module.exports = mongoose.model('Item', itemSchema);
