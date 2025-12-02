import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Temple from '../models/Temple.js';
import connectDatabase from '../config/database.js';

dotenv.config();

const verifyImages = async () => {
    try {
        await connectDatabase();
        const temples = await Temple.find({});
        console.log('--- Current Temple Images in DB ---');
        temples.forEach(t => {
            console.log(`${t.name}: ${t.image}`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyImages();
