const path = require("path");
const { validateExtension } = require("../validators/file");
const {
  uploadFileToCloudinary,
  signedUrl,
  deleteFileFromCloudinary,
} = require("../utils/cloudinary");
const { File } = require("../models");
const { default: mongoose } = require("mongoose");

const uploadFile = async (req, res, next) => {
  try {
    const { file } = req;
    // console.log(file);

    if (!file) {
      res.code = 400;
      throw new Error("File must be selected!");
    }

    const ext = path.extname(file.originalname);
    const isValidExt = validateExtension(ext);

    if (!isValidExt) {
      res.code = 400;
      throw new Error("Only .jpg or .jpeg or .png format is allowed!");
    }

    const { key, cloudinaryResult } = await uploadFileToCloudinary({
      file,
      ext: path.extname(req.file.originalname),
    });

    if (key) {
      const newFile = new File({
        key,
        size: file.size,
        mimetype: file.mimetype,
        createdBy: req.user._id,
      });
      await newFile.save();
    }

    res.status(201).json({
      code: 201,
      status: true,
      message: "File Uploaded Successfully",
      data: { key },
    });
  } catch (error) {
    next(error);
  }
};

const getSignedUrl = async (req, res, next) => {
  try {
    const { key } = req.query;
    const url = await signedUrl(key);

    const isKeyExist = await File.findOne({ key });
    if (!isKeyExist) {
      res.code = 404;
      throw new Error("File not found!");
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "Get Signed Url Successfully!",
      data: { url },
    });
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { key } = req.query;
    // console.log("Received key:", key);

    const cloudinaryResult = await deleteFileFromCloudinary(key);
    // console.log("Cloudinary delete response:", cloudinaryResult);

    const dbResult = await File.findOneAndDelete({ key });
    // console.log("MongoDB delete response:", dbResult);

    if (cloudinaryResult?.result !== "ok" || !dbResult) {
      return res.status(404).json({
        code: 404,
        status: false,
        // message: "File not found on Cloudinary or MongoDB.",
        message: "File not found!",
      });
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "File Deleted Successfully!",
    });
  } catch (error) {
    console.error("Deletion error:", error);
    next(error);
  }
};

module.exports = { uploadFile, getSignedUrl, deleteFile };
