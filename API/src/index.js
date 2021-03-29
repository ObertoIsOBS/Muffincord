const express = require("express");
const fs = require("fs");
const appURL = "http://localhost:8080";
const apiURL = "http://localhost:69";
const cdnURL = "http://localhost:90";

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

    const user = await require("../models/User").findOne({id: req.params.id});

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

    const setting = req.params.setting;

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

    var toFriend = await require("../models/User").findOne({id: req.params.id});

    user.friends.push(toFriend);

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

    user.friends = user.friends.filter(u => u.id !== req.params.id);

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

    var toRequest = await require("../models/User").findOne({id: req.params.id});

    if (!toRequest) return res.sendStatus(404);

    if (!toRequest.acceptingFriends) return res.sendStatus(403);

    user.requests.outgoing.push(toRequest);

    await user.save();

    var toRequestClient = await require("../models/ClientUser").findOne({id: req.params.id});

    toRequestClient.requests.incoming.push(user);

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

    var toRequest = await require("../models/User").findOne({id: req.params.id});

    if (!toRequest) return res.sendStatus(404);

    user.requests[req.params.type] = user.requests[req.params.type].filter(u => u.id !== req.params.id);

    await user.save();

    var toRequestClient = await require("../models/ClientUser").findOne({id: req.params.id});

    toRequestClient.requests[req.params.type] = toRequestClient.requests[req.params.type].filter(u => u.id !== req.params.id);

    await toRequestClient.save();

    res.send(200);
    
})

api.get("/users/me/groups/:id", async (req, res) => {
    const authorization = req.headers.authorization;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    const user = authorized.user;

    if (!user.groups.length) return res.sendStatus(404);

    res.json(user.groups);

})

api.put("/users/me/groups/:id", async (req, res) => {
    const authorization = req.headers.authorization;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    const user = authorized.user;

    var group = await require("../models/GroupChat").findOne({id: req.params.id});

    if (!group) return res.sendStatus(404);

    group.members.push(user);

    await group.save();

    res.sendStatus(200);

})

api.delete("/users/me/groups/:id", async (req, res) => {
    const authorization = req.headers.authorization;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    const user = authorized.user;

    var group = await require("../models/GroupChat").findOne({id: req.params.id});

    if (!group) return res.sendStatus(404);

    if (!group.members.find(m => m.id === user.id)) return res.sendStatus(403);

    group.members = group.members.filter(m => m.id !== user.id);

    await group.save();

    res.sendStatus(200);
    
});





/* Group Chats */
api.put("/groups", async (req, res) => {
    const authorization = req.headers.authorization;

    if (RL.has({token: authorization, path: req.url})) return res.sendStatus(429);

    RL.add({token: authorization, path: req.url});

    setTimeout(() => {
        RL.delete({token: authorization, path: req.url});
    }, 500);

    var authorized = await tokens.findOne({token: authorization});

    if (!authorized) return res.sendStatus(401);

    const user = authorized.user;

    const Identifier = require("../classes/Identifier");

    const id = new Identifier();

    const groupChat = new require("../models/GroupChat")({ id: id, members: [user.id], owner: user, created: new Date() });

    await groupChat.save();

    res.sendStatus(200);
    
})







api.listen(69); // api will just use it's own port, to make it easy