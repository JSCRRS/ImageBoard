const express = require("express");
const path = require("path");

const { getImages } = require("./db");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/images", (request, response) => {
    getImages()
        .then((images) => response.json(images))
        .catch((error) => {
            console.log("cannot get images:", error);
            response.sendStatus(500);
        });
});

app.listen(8080, () => console.log("server is up and running on port 8080"));
