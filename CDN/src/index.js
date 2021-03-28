require("dotenv").config();
const express = require("express");
const imgConversion = require("image-conversion");

const cdn = express();


const got = require("got");

cdn.get("/:f", async (req, res) => {
    const f = req.params.f;

    if (!f.split(".")) return res.sendStatus(400);

    const extension = f.split(".")[1];

    const filecode = f.split(".")[0];

    const serverRes = await got(`https://file.io/?search=${filecode}`, {headers: { Authorization: "Bearer RUBHXWG.WG1GPJ4-FF5MGNV-KWHD7V9-7SP94ZB"} });

    if (!serverRes) return res.sendStatus(500);
    
    const serverResponse = serverRes.body;

    const imageStore = JSON.parse(serverResponse).files;

    if (!imageStore) return res.sendStatus(404);

    const fileInfo = imageStore[0];

    if (!fileInfo) return res.sendStatus(404);

    const filename = fileInfo.name.split(".")[0];

    const fileExtension = fileInfo.name.split(".")[1];

    const file = await got(`https://file.io/${fileInfo.key}`);

    res.send(file);

})

cdn.listen(70)