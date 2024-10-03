const {
  isIdValid
} = require("./product-validation-controller")

const {
  writeFile,
  access,
  constants
} = require("fs/promises");

const productDBS = require("../products-data.json");

const {
  join
} = require("path");


const getAllProducts = (_request, response) => {
  response.status(200).json({
    status: "success",
    data: {
      total: productDBS.length,
      productDBS
    }
  })
}

const getProductById = (request, response) => {
  const {
    id: productId = null
  } = request.params;

  // if (!isIdValid(productId)) {
  //   return response.status(404).json({
  //     status: "fail",
  //     data: {
  //       message: "id is not valid"
  //     }
  //   })
  // }

  const targetProduct = productDBS.find(product => product.id === Number(productId))

  if (!targetProduct) {
    return response.status(404).json({
      status: "fail",
      data: {
        message: `product with id: ${productId} not-found`
      }
    })
  }

  response.status(200).json({
    status: "ok",
    data: {
      product: targetProduct,
    },
  });
}

const addProduct = async (request, response) => {
  try {
    const {
      id: productId = null,
      title = null,
      price = null,
      rating = null,
      stock = null,
      brand = null,
      category = null
    } = request.body;

    const isProductExistInDB = !!productDBS.find(
      (product) => product.id === productId
    );
    if (isProductExistInDB) {
      return response.json({
        status: "fail",
        error: {
          message: `id: ${productId} is already exist in dbs`,
        },
      });
    }

    productDBS.push({
      id: productId,
      title,
      price,
      rating,
      stock,
      brand,
      category
    })

    const productDBSAsJson = JSON.stringify(productDBS)
    await access(join(__dirname, "../products-data.json"), constants.F_OK)
    await writeFile(join(__dirname, "../products-data.json"), productDBSAsJson)

    response.status(200).json({
      status: "success",
      data: {
        product: {
          id: productId,
          title,
          price,
          rating,
          stock,
          brand,
          category
        }
      }
    })
  } catch (err) {
    console.log(`product-controller.js > addProduct()`, err)
    response.status(500).json({
      staus: "error",
      error: {
        message: "internal server error"
      }
    })
  }
}

const editProduct = async (request, response) => {
  try {
    const {
      id: productId = null
    } = request.params

    const {
      title = null,
        price = null,
        rating = null,
        stock = null,
        brand = null,
        category = null
    } = request.body;

    const product = productDBS.find(
      (product) => product.id === Number(productId)
    );
    if (!product) {
      return response.json({
        status: "fail",
        error: {
          message: `id: ${productId} is not exist in dbs`,
        },
      });
    }

    product.title = title || product.title;
    product.price = price || product.price;
    product.rating = rating || product.rating;
    product.stock = stock || product.stock;
    product.brand = brand || product.brand;
    product.category = category || product.category;

    const productDBSAsJson = JSON.stringify(productDBS)

    await access(join(__dirname, "../products-data.json"), constants.F_OK)
    await writeFile(join(__dirname, "../products-data.json"), productDBSAsJson)

    response.status(200).json({
      status: "success",
      data: {
        product
      }
    })
  } catch (err) {
    console.log(`product-controller.js > editProduct()`, err)
    response.status(500).json({
      staus: "error",
      error: {
        message: "internal server error"
      }
    })
  }
}

const deleteProduct = async (request, response) => {
  try {
    const {
      id: productId = null
    } = request.params;

    const indexOfProduct = productDBS.findIndex(
      (product) => product.id === Number(productId)
    );

    if (indexOfProduct === -1) {
      return response.status(404).json({
        status: "fail",
        error: {
          message: `product with Id ${productId} is not exist in dbs`,
        },
      });
    }
    productDBS.splice(indexOfProduct, 1);

    const productDBSAsJson = JSON.stringify(productDBS)

    await access(join(__dirname, "../products-data.json"), constants.F_OK)
    await writeFile(join(__dirname, "../products-data.json"), productDBSAsJson)

    response.status(204).json({
      status: "ok",
      data: {},
    });
  } catch (err) {
    console.log(`product-controller.js > deleteProduct()`, err)
    response.status(500).json({
      staus: "error",
      error: {
        message: "internal server error"
      }
    })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  editProduct,
  deleteProduct
}

