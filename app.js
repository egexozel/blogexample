const http = require("http");
const fs = require("fs");
const moment = require("moment");
const path = require("path");

const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        fs.readdir("./entries", (err, files) => {
            if (err) {
                console.error("Could not list the directory.", err);
                process.exit(1);
            }

            const entries = [];
            files.forEach(file => {
                fs.readFile(path.join("./entries", file), "utf-8", (err, data) => {
                    if (err) {
                        console.error("Could not read file.", err);
                        process.exit(1);
                    }
                    const lines = data.split("\n");
                    const title = lines[0];
                    const content = lines.slice(1).join("\n");
                    const date = moment(file.slice(0, 10), "YYYY-MM-DD");

                    entries.push({ title, content, date });

                    if (entries.length === files.length) {
                        entries.sort((a, b) => b.date - a.date);

                        res.writeHead(200, { "Content-Type": "text/html; charset=UTF-8" });
                        res.write(`
              <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta charset="UTF-8">
                    <title>Entries</title>
                  <link rel="stylesheet" type="text/css" href="style.css">
                </head>
                <body>
                  <div class="container">
            `);

                        entries.forEach(entry => {
                            res.write(`
                <div class="entry">
                  <h1 class="title">${entry.title}</h1>
                  <p class="content">${entry.content}</p>
                  <p class="date">${entry.date.format("MMMM D, YYYY")}</p>
                </div>
              `);
                        });

                        res.write(`
                  </div>
                </body>
              </html>
            `);
                        res.end();
                    }
                });
            });
        });
    } else if (req.url === "/style.css") {
        fs.readFile("./style.css", "utf-8", (err, data) => {
            if (err) {
                console.error("Could not read file.", err);
                process.exit(1);
            }

            res.writeHead(200, { "Content-Type": "text/css" });
            res.write(data);
            res.end();
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("404 Not Found");
        res.end();
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
