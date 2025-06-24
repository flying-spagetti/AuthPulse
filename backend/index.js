import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import argon2 from 'argon2';
import { decodeTime, ulid } from 'ulid';
import cookieParser from 'cookie-parser';





dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));



function verifyToken(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }
    try {
        const decoded = jwt.verify(token, "SecretKey");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token or an Expired one" });
    }
}

let count = 0;
let countforlogin = 0;

(async () => {
    const passwordHash = await argon2.hash('admin');

    const dummyUser = {
        username: 'user',
        password: passwordHash,
    };

    const ulidGenerate = ulid();
    const decodedTime = new Date(decodeTime(ulidGenerate));

    console.log(`Generated ULID: ${ulidGenerate}`);
    console.log(`Decoded time from ULID: ${decodedTime}`);

    const productsUrl = 'https://fakestoreapi.com/products';

    app.get('/', async (req, res) => {
        try {
            const response = await fetch(productsUrl);
            const data = await response.json();
            res.send(data);
            count++;
            console.log(`Number of times the endpoint has been hit: ${count}`);
        } catch (error) {
            res.status(500).send('Error fetching products');
            console.error(error);
        }
    });

    app.get("/api/protected", verifyToken, (req, res) => {
        res.json({ message: `Welcome back, ${req.user.username}` });
    });

    app.post('/api/login', async (req, res) => {
        countforlogin++;
        const { username, password } = req.body;
        console.log(`Login initiated for ${countforlogin} times`);

        if (username !== dummyUser.username) {
            return res.status(401).json({ message: 'User not found' });
        }

        const match = await argon2.verify(dummyUser.password, password);
        if (!match) {
            return res.status(401).json({ message: 'Password is incorrect' });
        }

        const token = jwt.sign({ username }, 'SecretKey', { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: 'lax',
            maxAge: 3600000,
        });

        res.status(200).json({ message: 'Login Successfully YASSS' });
    });
    app.get("/api/info", (_, res) => {
        res.json({
            language: "Node.js",
            framework: "Express",
            port: 3000,
            secure: true,
            jwt: "jsonwebtoken",
            passwordHash: "argon2",
            ulid: true,
            env: process.env.NODE_ENV || "development"
        });
});


    app.listen(3000, () => {
        console.log('🚀 Server is running on http://localhost:3000');
    });
})();
