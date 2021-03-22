const spicedPg = require("spiced-pg");

const database = "imageboard";

function getDatabaseURL() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    const { username, password } = require("./secrets.json");
    return `postgres:${username}:${password}@localhost:5432/${database}`;
}

const db = spicedPg(getDatabaseURL());

function getImages() {
    return db.query("SELECT * FROM images").then((result) => result.rows);
}

module.exports = {
    getImages,
};
