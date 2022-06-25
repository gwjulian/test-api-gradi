const { Router } = require("express");
const {
  applyDiscountToProduct,
  testHandler,
} = require("../handlers/discounts");

const discountsRouter = Router();

discountsRouter.post(
  "/discount/:discountCode/:variantId",
  applyDiscountToProduct
);
discountsRouter.post("test", testHandler);

module.exports = discountsRouter;
