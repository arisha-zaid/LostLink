const mongoose=require('mongoose');
const initData=require('./data'); // wo data
const ItemList =require("../models/Item"); //us data ka schema 
const MONGO_URL='mongodb://127.0.0.1:27017/LostLink';

main()
  .then(() => {
    console.log('Connected!')
  })
  .catch((e)=>{
    console.log("Error in mongodb");
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
     await ItemList.deleteMany({});
     await ItemList.insertMany(initData.sampleLostData);
}
console.log("Database initialized!");

initDb();