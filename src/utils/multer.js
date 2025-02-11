const multer = require('multer');
const fs = require('fs');

const multerDiskStorage = (path) => multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('public/' + path)) {
      fs.mkdirSync('public/' + path);
    }
    cb(null, `public/${path}`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now()+ Math.round(Math.random() * 1E9);
    const fileExtension = file.mimetype.split('/')[1];
    
    if (!fileExtension) {
      return cb(new Error('Invalid file mimetype'), null);
    }
    
    cb(null, `${uniqueSuffix}.${fileExtension}`);
  },
});

const uploadImage = () => multer({ storage: multerDiskStorage('images') });


const destroyFile = async (file) => {
  if (!file) return;
  if(fs.existsSync(`${file.path}`)) {
    fs.unlinkSync(`${file.path}`);
  }
};

module.exports = { destroyFile, uploadImage };
