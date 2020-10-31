const fs = require('fs');
const Mustache = require('mustache');
const htmlTemplate = fs.readFileSync(__dirname + '/../public/index.mustache.html').toString();

const bundle = {
  bundle: '',
  styleBundle: ''
};
const html = Mustache.render(htmlTemplate, bundle);

fs.writeFileSync(__dirname + '/../public/index.html', html);