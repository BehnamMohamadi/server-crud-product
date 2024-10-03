// const Joi = require('joi');

// const schema = Joi.object({
//   productId: Joi.number().integer()
// })

const isIdValid = (productId) => {
  if (isNaN(Number(productId))) return false
  if (!Number.isInteger(Number(productId))) return false
  if (Number(productId) < 0) return false
}



module.exports = {
  isIdValid

}