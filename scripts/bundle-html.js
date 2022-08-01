const fs = require('fs');
const Mustache = require('mustache');
const js = fs.readFileSync(__dirname + '/../dist/main.js').toString();
const css = fs.readFileSync(__dirname + '/../dist/main.css').toString();
const htmlTemplate = fs.readFileSync(__dirname + '/../public/index.mustache.html').toString();

const buildTime = new Date().getTime();

console.log(`>> build time: ${buildTime}`);

const bundle = {
  bundle: `<script>window.BUILD_TIME=${buildTime}</script><script>${js}</script>`,
  styleBundle: `<style type="text/css">${css}</style>`
};
const html = Mustache.render(htmlTemplate, bundle);

fs.writeFileSync(__dirname + '/../dist/dnd-battle-tracker.html', html);