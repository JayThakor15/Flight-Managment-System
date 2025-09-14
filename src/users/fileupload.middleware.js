import multer from "multer";
import fs from "fs";
import path from "path";

//Upload directory
const uploadDir = "/uploads";
// if uploads directory not exits, than create new one
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const strorage = multer.diskStorage({
  //Destination of files
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const uploadFile = multer({ storage: strorage });

export default uploadFile;
