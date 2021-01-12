const handlebars = require('handlebars');
const fs = require("fs");
const path = require('path');

const template = handlebars.compile(fs.readFileSync(path.join("site", "index.hbs")).toString('utf8'));
fs.writeFileSync(path.join("site", "index.html"), template(JSON.parse(fs.readFileSync(path.join("data", "ny_state.json")))));