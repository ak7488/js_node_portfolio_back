const express = require('express');
const fs = require('node:fs');

const router = express.Router();

router.get('/', (req, res) => res.send('ok'))

router.get('/profile-pic', (req, res) => {
	try {
		fs.ReadStream('./assets/img_002.jpg').pipe(res);
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
})

router.get('/skills', (req, res) => {
	try {
		res.send({
			back: ["Node js", "Express", "Socket.io"],
			front: ["React", "Nextjs", "Electron", "HTML", "CSS", "Vanela javascript", "Tailwind"]
		})
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
})

module.exports = {otherRouter: router}