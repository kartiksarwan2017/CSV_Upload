const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const FILE_PATH = path.join("/uploads/files");

const fileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },    
    filePath: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// setting up the disk storage engine for storing files to disk
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", FILE_PATH));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const fileTypeFilter = (req, file, cb) => {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  if (file.mimetype == "text/csv") {
    if (file.size > 1024 * 1024 * 4) {
      // To reject this file pass `false`, like so:
      cb(new Error("File is too large. Max size is 4MB"), false);
    } else {
      // To accept the file pass `true`, like so:
      cb(null, true);
    }
  } else {
    // You can always pass an error if something goes wrong:
    cb(new Error("Invalid file type"), false);
  }
}

// static functions
fileSchema.statics.uploadedFile = multer({
  storage: storage,
  fileFilter: fileTypeFilter,
}).single("file");

fileSchema.statics.filePath = FILE_PATH;

const File = mongoose.model("File", fileSchema);

module.exports = File;
