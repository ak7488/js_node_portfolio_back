const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {client} = require('../helper/db');
const {filterStr} = require('../helper/filterStr');

const router = express.Router();

const generateToken = (obj) => {
    return jwt.sign(obj, process.env.JWT_SEC);
}

const hash = async (str) => {
    const hashStr = await bcrypt.hash(str, 8);
    return hashStr
}

router.post('/api/auth/signup', async (req, res) => {
    try {
        const {email, password, name, age} = req.body;

        console.log(req.body);

        if(
            !email || !password || !name || !age || 
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            typeof name !== 'string' ||
            typeof age !== "number" ||
            password.length < 6 
        ) {
            console.log(email, password)
            return res.status(400).send();
        }

        const db = await(await client).db('Files');
        const collection = await db.collection('User');

        const user = await collection.findOne({email});
        
        if(user) return res.send({error: `Email alreay exists.`});

        const randomStr = filterStr(`${new Date().getTime()}-${Math.random()}`)
        const hashedPassword = await hash(password);
        const token = generateToken({_id: randomStr, exp: new Date().getTime() + 86400});

        await collection.insertOne({
            _id: randomStr,
            name,
            email,
            age,
            password: hashedPassword,
            tokens: [token]
        });

        res.send({
            token,
            _id: randomStr,
            name,
            age,
            email
        })
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
})

router.post('/api/auth/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if(
            !email || !password ||
            typeof email !== 'string' ||
            typeof password !== 'string'
        ) return res.status(400).send();

        const db = await(await client).db('Files');
        const collection = await db.collection('User');

        const user = await collection.findOne({email});
        
        if(!user || !user._id) return res.send({error: `No user with email ${email}`});

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.send({error: `Wrong password!`});

        const token = generateToken({_id: user._id, exp: new Date().getTime() + 86400});
        const reducedToken = [token, ...user.tokens.slice(0, 3)]

        await collection.updateOne({_id: user._id}, {
            $set: {tokens: reducedToken},
        });

        res.send({
            _id: user._id,
            token,
            name: user.name,
            age: user.age,
            email: user.email
        })
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
})

module.exports = {
    authRouter: router
};