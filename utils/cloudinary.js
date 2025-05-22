const cloudinary = require("cloudinary").v2;
const {
  cloudinaryCloudName,
  cloudinaryAPIKey,
  cloudinaryAPISecret,
} = require("../config/keys");
const generateCode = require("../utils/generateCode"); // your own function
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryAPIKey,
  api_secret: cloudinaryAPISecret,
});

// Upload file to Cloudinary
const uploadFileToCloudinary = ({ file, ext }) => {
  return new Promise((resolve, reject) => {
    const Key = `${generateCode(12)}_${Date.now()}`;
    const keyWithExtension = `${Key}${ext}`;
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: `uploads/${Key}`,
        resource_type: "auto",
        type: "authenticated",
        // access_mode: "authenticated",
      },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error);
          reject(error);
        } else {
          console.log("Upload result:", result);

          resolve({
            key: keyWithExtension,
            cloudinaryResult: result,
          });
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const signedUrl = (KeyWithExtension) => {
  try {
    const keyWithoutExtension = KeyWithExtension.replace(/\.[^/.]+$/, ""); // Strip extension
    const url = cloudinary.utils.private_download_url(
      `uploads/${keyWithoutExtension}`,
      null,
      {
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 30, // 30 seconds from now
      }
    );
    return url;
  } catch (error) {
    console.log("Signed URL error:", error);
  }
};

const deleteFileFromCloudinary = async (KeyWithExt) => {
  try {
    const keyWithoutExtension = KeyWithExt.replace(/\.[^/.]+$/, "");
    const publicId = `uploads/${keyWithoutExtension}`;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: "authenticated",
    });

    console.log("Cloudinary Destroy Result:", result);
    return result;
  } catch (error) {
    console.log("Delete error:", error);
    throw error;
  }
};

module.exports = {
  uploadFileToCloudinary,
  signedUrl,
  deleteFileFromCloudinary,
};
