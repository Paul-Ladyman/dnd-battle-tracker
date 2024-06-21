const fs = require('fs');

fs.copyFileSync(`${__dirname}/../public/sw.js`, `${__dirname}/../dist/sw.js`);
fs.copyFileSync(`${__dirname}/../public/dndbattletracker.webmanifest`, `${__dirname}/../dist/dndbattletracker.webmanifest`);
