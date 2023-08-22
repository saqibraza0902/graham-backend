import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
export const UploadImage = async (url) => {
    return await cloudinary.uploader.upload(url, {
        folder: "Graham_Rental"
    });
};
//# sourceMappingURL=imageUpload.js.map