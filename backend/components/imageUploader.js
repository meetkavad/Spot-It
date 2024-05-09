const multer = require("multer");

const storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
