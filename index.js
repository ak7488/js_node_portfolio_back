const express = require('express');
const fs = require('fs');
const cors = require('cors');
const {filesRouter} = require('./src/routers/fileUploadRoutes');
const {authRouter} = require('./src/routers/auth')

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(authRouter);
app.use(filesRouter);

app.get('/profile-pic', (req, res) => {
	try {
		fs.ReadStream('./assets/img_002.jpg').pipe(res);
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
})

app.get('/skills', (req, res) => {
	try {
		res.send({
			back: ['Nodejs', "Express", "JSON", "Mongodb", "GULP"],
			front: ["React", "Nextjs", "Electron", "Svelte", "HTML", "CSS", "Vanela javascript"]
		})
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
})

app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`)
})