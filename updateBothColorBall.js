const request = require('request');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const { BothColorBallModel } = require('./sql/index');

const updateBallLocationAPi = 'http://kaijiang.zhcw.com/zhcw/html/ssq/list_1.html';
mongoose.connect('mongodb://106.53.76.34/qinpeipei', {useNewUrlParser:true});

const db = mongoose.connection;
db.on('open', () => console.log('sql is connection'));




function saveNewData() {
  request.get(updateBallLocationAPi, (err, head, findData) => {
    if (err) {
      console.log(err);
      saveNewData();
      return;
    }
    const $ = cheerio.load(findData.toString());
    const tds = getTds($('tr')[2].children);
    const obj = {
      lotteryDate: '',
      issueNumber: '',
      prizeNumber: '',
      saleMoney: '',
      firstPrize: '',
      secondPrize: ''
    };
    tds.forEach((item, index) => {
      obj[Object.keys(obj)[index]] = $(item).text().replace(/\r|\n/g, '').split(' ').filter(item =>item).join(',');
    });
    const prizeNumberArr = obj.prizeNumber.split(','); 
    const allBallCount = prizeNumberArr.reduce((count, item) => {
      count += Number(item);
      return count; 
    }, 0);
    const redBallCount = allBallCount - prizeNumberArr[prizeNumberArr.length - 1];
    obj.allBallCount = allBallCount;
    obj.redBallCount = redBallCount;

    BothColorBallModel.find().countDocuments().exec((err, length) => {
      BothColorBallModel.find({issueNumber: obj.issueNumber - 1}, (err, data) => {
        obj.allBallQuantity = data[0].allBallQuantity + obj.allBallCount;
        obj.allRedBallQuantity = data[0].allRedBallQuantity + obj.redBallCount;
        obj.redBallAverage = obj.allRedBallQuantity / (length + 1);
        obj.allBallAverage = obj.allBallQuantity / (length + 1);
        const saveData = new BothColorBallModel(obj);
        BothColorBallModel.find({issueNumber: obj.issueNumber}, (err, data) => {
          if (data.length <= 0) {
            saveData.save((err, data) => {
              if (err) {
                console.log(`save error`, err);
                return;
              }
              console.log(`save successful: `, data);
              process.exit();
            })
          } else {
            process.exit()
          }
        })
      })
    });
   
  })
}

function getTds (data) {
  return data.filter(item => item.name === 'td');
}

saveNewData();
// const SaveData = new BothColorBallModel({
//   lotteryDate: '2019-09-19',
//   issueNumber: 2019110,
//   prizeNumber: '01,18,22,26,27,28,08',
//   saleMoney: '345,297,696',
//   firstPrize: '8',
//   secondPrize: '89',
//   allBallCount: 130,
//   redBallCount: 122
// })

// request.get(updateBallLocationAPi, (err, head, htmlData) => {
//   if(err) {
//     console.log(err);
//     return;
//   }
//   const buf = iconv.decode(htmlData, 'gb2312').toString();
//   console.log(htmlData);
// })

