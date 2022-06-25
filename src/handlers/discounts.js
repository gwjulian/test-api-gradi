const shopifyApi = require("../services/shopify");

const applyDiscountToProduct = async (req, res) => {
  const {
    body: {
      data: {
        priceRules: { edges: priceRules },
      },
    },
  } = await shopifyApi().query({
    data: `
      {
        priceRules(first: 10) {
          edges {
            node{
              title,
              id
            }
          }
        }
      }
    `,
  });

  const priceRuleInitial = priceRules
    .map((pr) => pr.node)
    .find((pr) => pr.title === req.params.discountCode);

  if (!priceRuleInitial) {
    return res.status(404).json({
      message: "Discount code not found",
    });
  }

  const {
    body: {
      data: { priceRule },
    },
  } = await shopifyApi().query({
    data: `
    {

      priceRule(id: "${priceRuleInitial.id}") {
        valueV2 {
          ... on MoneyV2 {
            amount
          },
          ... on PricingPercentageValue {
            percentage
          }
        }
      }
    }`,
  });

  const { variantId } = req.params;

  const {
    body: {
      data: { productVariant },
    },
  } = await shopifyApi().query({
    data: `
     {
      productVariant(id: "gid://shopify/ProductVariant/${variantId}") {
        price 
      }
     }
    `,
  });

  const productPrice = parseFloat(productVariant.price);
  let newPrice = 0;

  if (priceRule.valueV2.percentage) {
    newPrice =
      productPrice + productPrice * (priceRule.valueV2.percentage / 100);
  } else {
    newPrice = productPrice + parseFloat(priceRule.valueV2.amount);
  }

  return res.status(200).json({
    data: {
      newPrice,
    },
  });
};

const testHandler = (req, res) => {};

module.exports = {
  applyDiscountToProduct,
  testHandler,
};
