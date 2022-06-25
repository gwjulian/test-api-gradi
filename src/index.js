const express = require("express");
const dotenv = require("dotenv");
const discountsRouter = require("./routes/discounts");

dotenv.config();

const app = express();

app.use(express.json());
app.use(discountsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
