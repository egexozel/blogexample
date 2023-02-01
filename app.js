const express = require("express");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Use the "entries" directory to read text files
const entriesDirectory = path.join(__dirname, "entries");

app.get("/", (req, res) => {
  // Read all the text files in the "entries" directory
  fs.readdir(entriesDirectory, (err, files) => {
    if (err) throw err;

    // Sort the files by date
    files.sort((a, b) => {
      const aDate = moment(a.split(".")[0], "YYYY-MM-DD");
      const bDate = moment(b.split(".")[0], "YYYY-MM-DD");
      return aDate.isBefore(bDate) ? -1 : 1;
    });

    // Read the contents of each file and create an array of entry objects
    const entries = files.map((file) => {
      const filePath = path.join(entriesDirectory, file);
      const content = fs.readFileSync(filePath, "utf8");
      const [title, ...lines] = content.split("\n");

      return {
        title,
        date: moment(file.split(".")[0], "YYYY-MM-DD").format("MMM D, YYYY"),
        content: lines.map((line) => `<p>${line}</p>`).join(""),
      };
    });

    // Render the HTML page and pass the entries to it
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" type="text/css" href="/style.css">
          <title>My Journal</title>
        </head>
        <body>
          <div class="container">
            ${entries
              .map(
                (entry) => `
              <div class="entry">
                <h1>${entry.title}</h1>
                ${entry.content}
                <p class="date">${entry.date}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </body>
      </html>
    `);
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
