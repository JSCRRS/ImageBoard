const express = require("express");
const path = require("path");
const { getImages } = require("./db");
const { uploader } = require("./upload");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.get("/images", (request, response) => {
    getImages()
        .then((images) => response.json(images))
        .catch((error) => {
            console.log("cannot get images:", error);
            response.sendStatus(500);
        });
});

app.post("/images", uploader.single("file"), (request, response) => {
    console.log("upload successful", request.file, request.body);

    response.sendStatus(200);
});
/*.then((image) => response.json(image))
        .catch((error) => {
            console.log("cannot save image:", error);
            response.sendStatus(500);
        });
});*/

app.get("/upload", (request, response) => {
    response.send(`
    <form enctype="multipart/form-data" action="/upload" method="POST">
        <input type="file" accept="image/*" name="file" required>
        <button type="submit">Upload</button>
    </form>
    `);
});

app.post("/upload", uploader.single("file"), (request, response) => {
    console.log("upload successful", request.file, request.body);
    response.sendStatus(200).catch((error) => console.log(error));
});

app.listen(8080, () => console.log("server is up and running on port 8080"));
