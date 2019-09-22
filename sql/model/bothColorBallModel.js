const mongoose = require('mongoose');

const bothColorBallSchema = new mongoose.Schema({
  lotteryDate: Date,
  issueNumber: Number,
  prizeNumber: String,
  saleMoney: String,
  firstPrize: String,
  secondPrize: String,
  allBallCount: Number,
  allBallAverage: String,
  redBAllAverage: String,
  redBallCount: Number,
  allRedBallQuantity: Number,
  allBallQuantity:Number
});
const BothColorBallModel = mongoose.model('bothColorBalls', bothColorBallSchema);

module.exports = BothColorBallModel;