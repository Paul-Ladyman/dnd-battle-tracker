const fs = require('fs');
const Mustache = require('mustache');
const js = fs.readFileSync(__dirname + '/../dist/bundle.min.js').toString();
const htmlTemplate = fs.readFileSync(__dirname + '/../public/index.mustache.html').toString();

const bundle = {
  bundle: `<script>${js}</script>`
};
const html = Mustache.render(htmlTemplate, bundle);

fs.writeFileSync(__dirname + '/../dist/dnd-battle-tracker.html', html);