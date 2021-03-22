const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
    response.send("server is up and running on port 8080");
});

app.get("/images", (request, response) => {
    response.send("images");
});

app.listen(8080);
