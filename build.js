const fs = require("fs");
const path = require("path");
require("dotenv").config();

const envVars = {
  COC_API_TOKEN: process.env.COC_API_TOKEN,
};

const outDir = path.join(__dirname, "out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const envFilePath = path.join(outDir, "env.js");
fs.writeFileSync(envFilePath, `module.exports = ${JSON.stringify(envVars)}`);
