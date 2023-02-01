const express = require("express");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  fs.readdir("./entries", (err, files) => {
    if (err) throw err;
    files.sort().reverse();
    let entryList = "";
    console.log("Accessing entries at: " + moment().format('MMMM Do YYYY, h:mm:ss a'));
    for (let file of files) {
      
      const entry = fs.readFileSync(`./entries/${file}`, "utf8");
      const lines = entry.split("\n");
      const title = lines.shift();
      const content = lines.join("\n");
      const date = moment(file.slice(0, -4), "YYYY-MM-DD").format("MMM DD, YYYY");
      entryList += `
        <div class="entry">
          <h2 class="title">${title}</h2>
          <p class="content">${content.replace(/\n/g, "</p><p class='entry-content'>")}</p>
          <p class="date">${date}</p>
        </div>
      `;
    }
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" type="text/css" href="style.css">
          <link rel="stylesheet" href="https://unpkg.com/@sakun/system.css" />
          <title>My Analog Journal</title>
        </head>
        <body>
          <div class="container">
          <div class="window" style="height:90vh;">
  <div class="title-bar">
    <button aria-label="Close" class="close"></button>
    <h1 class="title">My Analog Journal</h1>
    <button aria-label="Resize" class="resize"></button>
  </div>
  <div class="separator"></div>

  <div class="window-pane" style="height:99vh;">
  ${entryList}
  </div>
</div>
            
          </div>
        </body>
      </html>
    `;
    res.send(html);
    console.log("Serving page at: " + moment().format('MMMM Do YYYY, h:mm:ss a'));
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
