const express = require("express");
const path = require("path");
const { uploader } = require("./upload");
const { s3upload } = require("./s3");
const {
    createImage,
    getImages,
    getImageById,
    addCommentToImage,
} = require("./db");
const { request } = require("express");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/images", (request, response) => {
    getImages()
        .then((images) => response.json(images))
        .catch((error) => {
            console.log("[imageboard:express] error getting images:", error);
            response.sendStatus(500);
        });
});

app.post("/images", uploader.single("file"), s3upload, (request, response) => {
    const url = `https://s3.amazonaws.com/spicedling/${request.file.filename}`;
    createImage({ url, ...request.body })
        .then((image) => response.json(image))
        //--> hier noch error/early return
        //render images!
        .catch((error) => {
            console.log("[imageboard:express] error saving image", error);
            response.sendStatus(500);
        });
});

app.get("/images/:imageId", (request, response) => {
    const imageId = request.params.imageId;
    getImageById(imageId)
        .then((result) => {
            //hier noch error/early return!
            response.json(result);
        })
        .catch((error) => {
            console.log(
                "[imageboard:express] error getting image by id",
                error
            );
            response.sendStatus(500);
        });
});

/* app.get("/images/:imageId/comments", (request, response) => {
    const imageId = request.params.imageId;
    //zeige die comments des jeweiligen Bildes
}); */

app.post("/images/:imageId/comments", (request, response) => {
    //speicher imageId + username + text im table comments
    //nimm image id
    const imageId = request.params.imageId;
    // nimm username
    const details = { ...request.body };
    console.log("[comments:express] post-details:", imageId, details);
});

app.listen(8080, () => console.log("server is up and running on port 8080"));
