
import mongoose from 'mongoose';

const localUri = 'mongodb://localhost:27017/templeverse';

const checkLocal = async () => {
    try {
        console.log('Testing Local MongoDB...');
        await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
        console.log('SUCCESS: Local MongoDB is running!');
        process.exit(0);
    } catch (e) {
        console.error('FAILURE: Local MongoDB not accessible.');
        process.exit(1);
    }
};

checkLocal();
