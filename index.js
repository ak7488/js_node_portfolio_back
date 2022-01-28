const express = require('express');
const fs = require('fs');
const cors = require('cors');
const {filesRouter} = require('./src/routers/fileUploadRoutes');
const {authRouter} = require('./src/routers/auth');
const {otherRouter} = require('./src/routers/others')

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(authRouter);
app.use(filesRouter);
app.use(otherRouter);

app.listen(port, () => {
	console.log(`Server is up and running on port ${port}`)
})