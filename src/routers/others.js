const express = require("express");
const fs = require("node:fs");
const { sendEmailToMe } = require("../helper/email");

const router = express.Router();

router.get("/", (req, res) => res.send("ok"));

router.get("/profile-pic", (req, res) => {
    try {
        fs.ReadStream("./assets/img_002.jpg").pipe(res);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

router.get("/skills", (req, res) => {
    try {
        res.send({
            back: ["Node js", "Express", "Socket.io"],
            front: [
                "React",
                "Nextjs",
                "Electron",
                "HTML",
                "CSS",
                "Vanela javascript",
                "Tailwind",
                "Typescript"
            ],
            tools: ['VS Code', "JSON", "Prettier"]
        });
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

router.post("/email", async (req, res) => {
    try {
	console.log("body: ", req.body);
	console.log("headers" ,req.headers);
        const { from, name, text, contact } = req.body;
        if (
            !from ||
            !name ||
            !text ||
            !contact ||
            typeof from !== "string" ||
            typeof name !== "string" ||
            typeof contact !== "string" ||
            typeof text !== "string"
        ) return res.status(400).send();

		await sendEmailToMe({from, text, name, contact});

		res.send('ok');
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

module.exports = { otherRouter: router };
