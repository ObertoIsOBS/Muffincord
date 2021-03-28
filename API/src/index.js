const express = require("express");
const fs = require("fs");
const appURL = "http://localhost:8080";
const apiURL = "http://localhost:69";

const api = express();

const RL = new Set();
/* Skip getting auth for now */

var tokens = require("../models/UserToken");

api.get("/", (req, res) => {
    res.redirect(appURL);
})

/* Users */
// Get user
api.get("/users/:id", async (req, res) => {
    const authorization = req.headers.authorization;
    const data = req.body;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    const user = await require("../models/User").findOne({id: req.query.id});

    if (!user) return res.sendStatus(404);

    res.json(user);

})

// Get self
api.patch("/users/me", async (req, res) => {
    const authorization = req.headers.authorization;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    const user = authorized.user;

    res.json(user);

})

// User Settings
api.patch("/users/me/settings/:setting", async (req, res) => {
    const authorization = req.headers.authorization;
    const data = req.body;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    var user = authorized.user;

    const setting = req.query.setting;

    if (!user[setting]) return res.sendStatus(404);

    user[setting] = data;

    await user.save();

    res.send(200);

});

// User Friends
api.put("users/me/friends/:id", async (req, res) => {
    const authorization = req.headers.authorization;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    var user = authorized.user;

    user.friends.push(req.query.id);

    await user.save();

    res.send(200);
    
})

api.delete("users/me/friends/:id", async (req, res) => {
    const authorization = req.headers.authorization;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    var user = authorized.user;

    user.friends = user.friends.filter(u => u !== req.query.id);

    await user.save();

    res.send(200);
    
})

// User Friends
api.put("users/me/friends/requests/:id", async (req, res) => {
    const authorization = req.headers.authorization;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    var user = authorized.user;

    var toRequest = await require("../models/User").findOne({id: req.query.id});

    if (!toRequest) return res.sendStatus(404);

    if (!toRequest.acceptingFriends) return res.sendStatus(403);

    user.requests.outgoing.push(req.query.id);

    await user.save();

    var toRequestClient = await require("../models/ClientUser").findOne({id: req.query.id});

    toRequestClient.requests.incoming.push(user.id);

    await toRequestClient.save();

    res.send(200);
    
})

api.delete("users/me/friends/requests/:type/:id", async (req, res) => {
    const authorization = req.headers.authorization;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    var user = authorized.user;

    var toRequest = await require("../models/User").findOne({id: req.query.id});

    if (!toRequest) return res.sendStatus(404);

    user.requests[req.query.type] = user.requests[req.query.type].filter(u => u !== req.query.id);

    await user.save();

    var toRequestClient = await require("../models/ClientUser").findOne({id: req.query.id});

    toRequestClient.requests[req.query.type] = toRequestClient.requests[req.query.type].filter(u => u !== req.query.id);

    await toRequestClient.save();

    res.send(200);
    
})







api.listen(69); // api will just use it's own port, to make it easy