const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const Mustache = require('mustache');

const js = fs.readFileSync(`${__dirname}/../dist/main.js`).toString();
const css = fs.readFileSync(`${__dirname}/../dist/main.css`).toString();
const htmlTemplate = fs.readFileSync(`${__dirname}/../public/index.mustache.html`).toString();

const buildTime = new Date().getTime();

const bundle = {
  bundle: `<script>window.BUILD_TIME=${buildTime}</script><script>${js}</script>`,
  styleBundle: `<style type="text/css">${css}</style>`,
};
const html = Mustache.render(htmlTemplate, bundle);

fs.mkdirSync(`${__dirname}/../dist-final`, { recursive: true });
fs.writeFileSync(`${__dirname}/../dist-final/dnd-battle-tracker.html`, html);
fs.copyFileSync(`${__dirname}/../public/favicon.png`, `${__dirname}/../dist-final/favicon.png`);
fs.copyFileSync(`${__dirname}/../public/sw.js`, `${__dirname}/../dist-final/sw.js`);
fs.copyFileSync(`${__dirname}/../public/dndbattletracker.webmanifest`, `${__dirname}/../dist-final/dndbattletracker.webmanifest`);
