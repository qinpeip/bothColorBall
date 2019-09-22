const fs = require('fs');
const redBall = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", 
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", 
"22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33"];

function getCombinations (num) {
  const combinations = [];
  redBall.forEach(oneNum => {
    if (oneNum > 28) return;
    const twoNums = redBall.filter(ball => ball > oneNum);
    twoNums.forEach(twoNum => {
      if (twoNum > 29) return;
      const threeNums = redBall.filter(ball => ball > twoNum);
      threeNums.forEach(threeNum => {
        if (threeNum > 30) return;
        const fourNums = redBall.filter(ball =>ball > threeNum);
        fourNums.forEach(fourNum => {
          if (fourNum > 31) return
          const fivNums = redBall.filter(ball =>　ball > fourNum);
          fivNums.forEach(fivNum => {
            if (fivNum > 32) return;
            const sixNums = redBall.filter(ball => ball > fivNum);
            sixNums.forEach(sixNum => {
              const count = Number(oneNum) + Number(twoNum) + Number(threeNum) + Number(fourNum) + Number(fivNum) + Number(sixNum);
              const str = `${oneNum},${twoNum},${threeNum},${fourNum},${fivNum},${sixNum}`;
              if (count == num) {
                combinations.includes(str) || combinations.push(str);
                console.log('当前组合数量:', combinations.length);
              }
            })
          })
        })
      })
    })
  })
  return combinations;
}
fs.writeFileSync('ball.txt', JSON.stringify(getCombinations(122)));