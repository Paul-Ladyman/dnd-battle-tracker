const fs = require('fs');
const js = fs.readFileSync(__dirname + '/dist/bundle.min.js');

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="theme-color" content="#000000" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script>
      ${js}
    </script>
  </body>
</html>
`; 

fs.writeFileSync(__dirname + '/dist/dnd-battle-tracker.html', html);