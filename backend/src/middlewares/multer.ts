import { Request } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: Express.Multer.File) => ({
        folder: 'fake-instagram/posts',
        resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
        public_id: `${Date.now()}-${file.originalname}`,
    }),
});

const upload = multer({ storage });

export default upload;
