require("dotenv").config();
const express = require("express");
const imgConversion = require("image-conversion");
const fs = require("fs");

const cdn = express();


const got = require("got");
const { fstat } = require("fs");

cdn.get("/:f", async (req, res) => {
    const f = req.params.f;

    if (!f.split(".")) return res.sendStatus(400);

    const extension = f.split(".")[1];

    const filename = f.split(".")[0];

    const file = await fs.readFileSync(__dirname + "\\STORAGE\\" + filename + ".png");

    if (!file) return res.sendStatus(404);

    res.sendFile(__dirname + "\\STORAGE\\" + filename + ".png");
});

cdn.listen(70)