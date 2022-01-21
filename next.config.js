const path = require("path");

// node env variables.
const { COLLECTION_ADDRESS, MINT_PRICE } = process.env;

let serverRuntimeConfig = {
  COLLECTION_ADDRESS,
  MINT_PRICE,
};

let publicRuntimeConfig = {
  COLLECTION_ADDRESS,
  MINT_PRICE,
};

module.exports = {
  serverRuntimeConfig,
  publicRuntimeConfig,

  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};
