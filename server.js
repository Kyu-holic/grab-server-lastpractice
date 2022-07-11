const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});
const port = 8080;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "createdAt", "imageUrl", "seller", "name"],
  })
    .then((result) => {
      console.log("PRODUCTS : ", result);
      res.send({
        products: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("에러 발생");
    });
});

app.get("/products/:id", (req, res) => {
  const { params } = req;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 에러가 발생 했습니다.");
    });
});

app.post("/products", (req, res) => {
  const { body } = req;
  const { description, name, seller, price, imageUrl } = body;
  if (!name || !description || !seller || !price || !imageUrl) {
    res.status(400).send("모든 필드를 입력해 주세요.");
  }
  models.Product.create({
    name,
    description,
    seller,
    price,
    imageUrl,
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

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
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
