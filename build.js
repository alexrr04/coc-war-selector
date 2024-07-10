const fs = require("fs");
const path = require("path");
require("dotenv").config();

const envVars = {
  COC_API_TOKEN: process.env.COC_API_TOKEN,
};

const envFilePath = path.join(__dirname, "src", "env.js");
fs.writeFileSync(envFilePath, `module.exports = ${JSON.stringify(envVars)}`);
