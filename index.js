const mongoose = require('mongoose');
const { BothColorBallModel } = require('./sql/index');
mongoose.connect('mongodb://106.53.76.34/qinpeipei', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('open', () => console.log('sql is connection'));

BothColorBallModel.find({issueNumber: {$lt: 2019110}}, null, {sort: {issueNumber: 1}}, (err, findData) => {
  if (err) {
    console.log(err);
    return ;
  };
  const bothColorBallNumber = {};

  findData.forEach(item => {
    const prizeNumberArr = item.prizeNumber.split(',');
    prizeNumberArr.pop();
    prizeNumberArr.forEach(item => {
      bothColorBallNumber[item] ?　bothColorBallNumber[item]++ : bothColorBallNumber[item] = 1;
    })
  })

  console.log(getMaxNumbers(bothColorBallNumber));
})

function getMaxNumbers (data) {
  const threeCombination = {
    maxNums: [],
    minNums: []
  };
  let maxNum = 0;
  let maxKey = '';
  let minNum = 0;
  let minKey = '';
  for (let i = 0; i <11; i++) {
    console.log(`正在进行第${i}次计算`)
    maxNum = 0;
    minNum = data[Object.keys(data)[0]];
    Object.keys(data).forEach(key => {
      if (maxNum < data[key] && !threeCombination.maxNums.includes(key)) {
        console.log(key, data[key]);
        maxNum = data[key];
        maxKey = key;
      }
      if (minNum >= data[key] && !threeCombination.minNums.includes(key)) {
        minNum = data[key];
        minKey = key;
      }
    })
    threeCombination.maxNums.push(maxKey);
    threeCombination.minNums.push(minKey);
  }
  return threeCombination;
}

