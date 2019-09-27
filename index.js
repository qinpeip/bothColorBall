const mongoose = require('mongoose');
const childProcess = require('child_process');
const { BothColorBallModel } = require('./sql/index');
const { getCombinations } = require('./countNextIssueNumber');
mongoose.connect('mongodb://106.53.76.34/qinpeipei', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('open', () => console.log('sql is connection'));

const redBall = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", 
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", 
"22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33"];

BothColorBallModel.find({}, null, {sort: {issueNumber: 1}}, (err, findData) => {
  if (err) {
    console.log(err);
    return ;
  };
  const bothColorBallNumber = {};
  const allRedBallArr = findData.map(item => {
    const prizeNumberArr = item.prizeNumber.split(',');
    prizeNumberArr.pop();
    return prizeNumberArr;
  })

  findData.forEach(item => {
    const prizeNumberArr = item.prizeNumber.split(',');
    prizeNumberArr.pop();
    prizeNumberArr.forEach(item => {
      bothColorBallNumber[item] ?　bothColorBallNumber[item]++ : bothColorBallNumber[item] = 1;
    })
  })

  // const areaNumbers = getMaxNumbers(bothColorBallNumber);
  const moreNumbers = getMoreNumber(findData[findData.length -1 ].redBallCount);
  moreNumbers.forEach(p => {
    let combinations = getCombinations(p);
  combinations = combinations.filter((combination) => {
    let isReturn = true;
    allRedBallArr.forEach(arr => {
      let showCount = 0;
      combination.split(',').forEach(item => {
        if (arr.includes(item)) showCount++;
      })
      if (showCount >= 4) {
        isReturn = false;
      }
    });
    return isReturn;
  });
  if (combinations.length > 0) {
    console.log(`${p}:`, combinations);
  }
  
  })
  // let combinations = getCombinations(150);
  // combinations = combinations.filter((combination) => {
  //   let isReturn = true;
  //   allRedBallArr.forEach(arr => {
  //     let showCount = 0;
  //     combination.split(',').forEach(item => {
  //       if (arr.includes(item)) showCount++;
  //     })
  //     if (showCount >= 4) {
  //       console.log(`匹配到了:`, arr, combination);
  //       isReturn = false;
  //     }
    // });
    // const prizeNumberArr = item.prizeNumber.split(',');
    // prizeNumberArr.pop();
    // let min = 0, max = 0, middle = 0;
    // combination.split(',').forEach(num => {
    //   if (areaNumbers.maxNums.includes(num)) {
    //     max++;
    //   }
    //   if (areaNumbers.minNums.includes(num)) {
    //     min++;
    //   }
    //   if (areaNumbers.middleNums.includes(num)) {
    //     middle++;
    //   }
    // });
    // return (min==2&& max==2&&middle==2);
    // return isReturn;
  // });
  // console.log(combinations);
})



function getMoreNumber(num) {
  const moreNumber = [];
  for(let i = 0; i < 40; i++) {
    moreNumber.push(num + (i+1));
    moreNumber.push(num - (i + 1));
  };
  return moreNumber;
}

function getMaxNumbers (data) {
  const threeCombination = {
    maxNums: [],
    minNums: [],
    middleNums: []
  };
  let maxNum = 0;
  let maxKey = '';
  let minNum = 0;
  let minKey = '';
  for (let i = 0; i <11; i++) {
    maxNum = 0;
    minNum = data[Object.keys(data)[0]];
    Object.keys(data).forEach(key => {
      if (maxNum < data[key] && !threeCombination.maxNums.includes(key)) {
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
  redBall.forEach(item => {
    if (!threeCombination.maxNums.includes(item) && !threeCombination.minNums.includes(item)) {
      threeCombination.middleNums.push(item);
    }
  })
  return threeCombination;
}

