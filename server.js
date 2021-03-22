const express = require("express");
const path = require("path");

const { getImages } = require("./db");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
    response.send("server is up and running on port 8080");
});

app.get("/images", (request, response) => {
    getImages()
        .then((images) => response.send(images))
        .catch((error) => console.log("ERROR:", error));
});

app.listen(8080);
