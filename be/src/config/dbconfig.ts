import mongoose from 'mongoose';
export const ConnectDataBase = async (uri: string) => {
    try {
        await mongoose.connect(uri);
        console.log("Success");
    } catch (error: any) {
        console.error("❌ MongoDB connection failed:", error?.message);
        console.log("Failed");
    }
};
