const path = require("path");

const ENV = "development";
const PATH = path.resolve(__dirname, "../.env." + ENV);

require("dotenv").config({ path: PATH });

module.exports = ENV;
