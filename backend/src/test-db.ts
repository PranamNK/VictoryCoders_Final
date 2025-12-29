import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    const uri = process.env.MONGODB_URI;
    console.log('Testing MongoDB Connection...');
    console.log('URI present:', !!uri);

    if (!uri) {
        console.error('No MONGODB_URI found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('SUCCESS: Connected to MongoDB!');
        console.log('Host:', mongoose.connection.host);
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error: any) {
        console.error('ERROR: Failed to connect.');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        if (error.reason) console.error('Reason:', error.reason);
    }
};

testConnection();
