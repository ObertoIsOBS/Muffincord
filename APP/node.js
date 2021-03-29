const express = require("express");
const fs = require("fs");

const appURL = "http://localhost:8080";
const apiURL = "http://localhost:69";
const cdnURL = "http://localhost:90";

const app = express();

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "\\index.html");
});

app.listen(8080);

