import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];

export const multerImageConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  }),
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Only PNG, JPEG and WEBP images are allowed'),
        false,
      );
    }

    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
};
