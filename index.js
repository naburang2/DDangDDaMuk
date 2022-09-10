const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

app.use(express.json());

app.use(cors({
  origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const rankings = sequelize.define('rankings', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
});
  

(async () => {
await rankings.sync();
})();

//delete 
// (async () => {
//   await rankings.destroy({
//     // where: {
//     //   id: 103
//     // }
//     truncate: true
//   });
// })();

//Create
// (async () => {
//   for(let i =0; i <20; i++){
//     const user = await rankings.create({name:'나부랭이', score:0});
//   }
// })();

let tenScore = 0; 

app.post('/', async function (req, res) {
  console.log(req.body);
  const score = req.body.score;

  if(score > tenScore){
    // Create a new user
    const user = await rankings.create({name:'', score:score});
    console.log(user);
    
    //read 뒤 내림차순
    const ranking = await rankings.findAll({
      order: [['score', 'DESC']],
      limit: 10
    });

    const db = [ranking, user.id]; //json 형태로 보내야하나봐
    res.send(db);

    tenScore = ranking[ranking.length-1].score; //10등 점수 저장해놓기

    const tenDelete = await rankings.findAll({ //20등 밑은 삭제
      order: [['score', 'DESC']],
      offset: 20
    });
    for(let i = 0; i < tenDelete.length; i++){
        await rankings.destroy({
          where: {
            id: tenDelete[i].id
          }
        });
    };

  }else{
    //read 뒤 내림차순
    const ranking = await rankings.findAll({
      order: [['score', 'DESC']],
      limit: 10
    });

    const db = [ranking, user.id]; //json 형태로 보내야하나봐
    res.send(db);
  }
});

app.post('/name', async function (req, res) {
  
  const name = req.body.name;
  const id = req.body.id;
  console.log(name,id);

  //update 
  await rankings.update({ name:name }, {
    where: {
      id: id
    }
  });
});

  

  //read 
  //const ranking = await rankings.findAll();

  //offset 부터 찾기
  //rankings.findAll({ offset: 8 });

  
app.listen(port, () => {
    console.log(`링크스타토!!! ${port}`)
  });