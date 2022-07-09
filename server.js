const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/products", (req, res) => {
  const query = req.query;
  console.log("QUERY :", query);
  res.send({
    products: [
      {
        id: 1,
        name: "농구공",
        price: 100000,
        seller: "조던",
        imageUrl: "images/products/basketball1.jpeg",
      },
      {
        id: 2,
        name: "축구공",
        price: 50000,
        seller: "Jordan",
        imageUrl: "images/products/soccerball1.jpg",
      },
      {
        id: 3,
        name: "키보드",
        price: 15000,
        seller: "Grab",
        imageUrl: "images/products/keyboard1.jpg",
      },
    ],
  });
});

app.get("/products/:id", (req, res) => {
  const { params } = req;
  const { id } = params;
  res.send(`id는 ${id} 입니다.`);
});

app.post("/products", (req, res) => {
  const { body } = req;
  const { description, name, seller, price } = body;
  if (!name || !description || !seller || !price) {
    res.status(400).send("모든 필드를 입력해 주세요.");
  }
  models.Product.create({
    name,
    description,
    seller,
    price,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send("상품 업로드에 문제가 발생했습니다.");
    });
});

app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공!");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit();
    });
});
