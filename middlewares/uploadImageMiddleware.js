const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  //3- Memory Storage
  //3
  const multerStorage = multer.memoryStorage();

  //4- multerFilter => ensure that only image files
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true); // Allow the file to be uploaded
    } else {
      cb(new ApiError("Only Images allowed", 400), false); // Disallow the file to be uploaded
    }
  };
  //4
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  //5
  const uploadCategoryImage = upload.single(fieldName);
};
