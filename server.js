const express = require("express");

const {
  join
} = require("path");

const {
  getAllProducts,
  getProductById,
  addProduct,
  editProduct,
  deleteProduct
} = require("./controllers/product-controller")

const app = express();
const host = "127.0.0.1";
const port = 8001;

app.use(express.static(join(__dirname, "./public")));
app.use(express.json());

app.get("/", (_request, response) => {
  response.status(200).json({
    status: "success",
    data: {
      message: "Root Route"
    }
  })
});

app.get("/product-get-all-products", (request, response) => {
  getAllProducts(request, response)
});

app.get("/product/get-product/:id", (request, response) => {
  getProductById(request, response)
});

app.post("/product/create-product", (request, response) => {
  addProduct(request, response)
})

app.patch("/product/update-product/:id", (request, response) => {
  editProduct(request, response)
});

app.delete("/product/remove-product/:id", (request, response) => {
  deleteProduct(request, response)
});

app.all("*", (request, response) => {
  response.status(404).json({
    status: "fail",
    error: {
      message: `not-found`,
    },
  });
});
app.listen(port, host, () => {
  `you are listening on ${host}:${port}`;
});