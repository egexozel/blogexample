const express = require("express");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const app = express();
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Handle the main page
app.get("/", (req, res) => {
  fs.readdir("./entries", (err, files) => {
    if (err) throw err;
    files.sort().reverse();
    let entryList = "";
    for (let file of files) {

      const entry = fs.readFileSync(`./entries/${file}`, "utf8");
      const lines = entry.split("\n");
      const title = lines.shift();
      const content = lines.join("\n");
      const date = moment(file.slice(0, -4), "YYYY-MM-DD-hh-mm-ss").format("MMM DD, YYYY, hh:mm");
      entryList += `
        <div class="entry">
          <h2 class="title">${title}</h2><br>
          <p class="content">${content.replace(/\n/g, "</p><p class='content'>")}</p>
          <p class="date">${date}</p>
        </div>
      `;
    }
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/@sakun/system.css" />
          <link rel="stylesheet" type="text/css" href="style.css">
          
          <title>My Analog Journal</title>
        </head>
        <body>
          <div class="container">
          <div class="window" style="height:640px;">
  <div class="title-bar">
    <button aria-label="Close" class="close"></button>
    <h1 class="title">My Analog Journal</h1>
    <button aria-label="Resize" class="resize"></button>
  </div>
  <div class="details-bar">
    <span><a href="/post">New Entry</a></span>
    <span>About</span>
  </div>
  <div class="separator"></div>

  <div class="window-pane">
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

// Handle the entry submission page
app.get('/post', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Handle the post request
app.post('/entry', (req, res) => {
  const date = moment().format('YYYY-MM-DD-hh-mm-ss');
  const title = req.body.title;
  const body = req.body.body;
  const entry = `${title}\n${body}`;

  fs.writeFile(`entries/${date}.txt`, entry, 'utf8', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Could not save entry');
      return;
    }

    res.send('Your entry has been published succesfully. <a href="/">Go back</a>');
    fetch('https://ntfy.sh/myaj', {
      method: 'POST', // PUT works too
      body: "New entry is saved at: " + moment().format('MMMM Do YYYY, h:mm:ss a') + " Title: " + `${title}`,
      headers: { 'Title': 'New entry has been submitted' }
    });
    console.log("New entry is saved at: " + moment().format('MMMM Do YYYY, h:mm:ss a') + " Title: " + `${title}`);
  });
});

// Start the server on defined post
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});