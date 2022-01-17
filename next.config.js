const path = require("path");

// node env variables.
const { COLLECTION_ADDRESS } = process.env;

let serverRuntimeConfig = {
  COLLECTION_ADDRESS,
};

let publicRuntimeConfig = {
  COLLECTION_ADDRESS,
};

module.exports = {
  serverRuntimeConfig,
  publicRuntimeConfig,
  
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};
