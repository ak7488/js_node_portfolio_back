const express = require('express');
const multer = require('multer');
const {Readable} = require('stream')
const {client, GridFSBucket} = require('../helper/db');
const {filterStr} = require('../helper/filterStr');
const {auth} = require('../helper/auth')

const router = express.Router();
const upload = multer();

router.post('/api/files/upload', auth, upload.array('files[]'), async (req, res) => {
    try {
        if(!req.body.title || !req.files || req.files === 0) return res.status(400).send();
        const db = await(await client).db('Files');
        const bucket = new GridFSBucket(db, {bucketName: "files"})
        const date = new Date().getTime();
        const fileData = []
        req.files.slice(0,5).forEach(file => {
            if(file.buffer.length > 32000000) return
            const name = filterStr(`${file.originalname}_${date}_${Math.random()}`)
            const readable = new Readable();
            readable.push(file.buffer);
            readable.push(null);
            readable.pipe(bucket.openUploadStream(name))
            fileData.push({
                fileName: name,
                title: req.body.title.trim().slice(0, 300),
                mimeType: file.mimetype,
                originalName: file.originalname
            });
        });
        await db.collection('FileData').insertMany(fileData, {ordered: true})
        console.log(fileData)
        res.send(fileData)
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

module.exports = {
    filesRouter: router,
};