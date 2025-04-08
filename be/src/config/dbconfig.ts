import mongoose from 'mongoose';
export const ConnectDataBase = async (uri: string) => {
    try {
        await mongoose.connect(uri);
        console.log("Success");
    } catch (error) {
        console.log("Failed");
    }
};
