import multer, { diskStorage } from 'multer';
import { getExtension } from 'mime';

const storage = diskStorage({
  destination(req, file, cb) {
    cb(null, 'public');
  },
  filename(req, file, cb) {
    const dateUploaded = new Date().getTime();
    const extension = getExtension(file.mimetype);

    cb(null, `${dateUploaded}.${extension}`);
  }
});

const fileUpload = multer({ storage });

export default fileUpload;
