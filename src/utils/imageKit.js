const ImageKit = require("imagekit");

const { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT } =
  process.env;

const imageKit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file) {
  return new Promise(async (resolve, reject) => {
    try {
      const base64Data = file.buffer.toString("base64");
      const fileUploaded = await imageKit.upload({
        file: base64Data,
        fileName: file.originalname,
      });
      resolve(fileUploaded.url);
    } catch (error) {
      reject(error);
    }
  });
}

async function getFileId(filename) {
  return new Promise(async (resolve, reject) => {
    try {
      const fileId = await imageKit.listFiles({
        searchQuery: `name="${filename.split('/').slice(-1)[0]}"`,
      });
      if (fileId[0]) {
        resolve(fileId[0].fileId);
      }
      resolve(0);
    } catch (error) {
      reject(error);
    }
  });
}

async function deleteFile(filename) {
  return new Promise(async (resolve, reject) => {
    try {
      if(filename == "https://ik.imagekit.io/8zmr0xxik/Colorful%20Gradient%20Background%20Man%203D%20Avatar.png") {
        return resolve(null);
      }
      const fileId = await getFileId(filename);
      if(fileId) {
        const deletedFile = await imageKit.deleteFile(fileId);
        resolve(deletedFile);
      }
      resolve(null);
    } catch (error) {
      reject(error);
    }
  });
}


async function validationFile(file, type = "image", res) {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "image") {
        const allowedMimeType = ["image/jpeg", "image/png", "image/jpg"];
        if (!file.mimetype) {
          if (!allowedMimeType.includes(file[0].mimetype)) {
            return res.status(400).json({
              status: false,
              message: "File must be an image",
            });
          }
        } else if(!allowedMimeType.includes(file.mimetype)) {
          return res.status(400).json({
            status: false,
            message: "File must be an image",
          });
        }
      } else {
        const allowedMimeType = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
        ];
        if (!allowedMimeType.includes(file[0].mimetype)) {
          return res.status(400).json({
            status: false,
            message: "File must be an pdf or word",
          });
        }
      }
      if(file.mimetype) {
        const upload = await uploadFile(file);
        return resolve(upload);
      }
      const upload = await uploadFile(file[0]);
      resolve(upload);
    } catch (error) {
      reject(error);
    }
  });
}



module.exports = {
  uploadFile,
  getFileId,
  deleteFile,
  validationFile
};