const {
  PORT,
  CONNECTION_URL,
  JWT_SECRET,
  SENDER_EMAIL,
  EMAIL_PASSWORD,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

module.exports = {
  port: PORT,
  connectionURL: CONNECTION_URL,
  jwtSecret: JWT_SECRET,
  senderEmail: SENDER_EMAIL,
  emailPassword: EMAIL_PASSWORD,
  cloudinaryCloudName: CLOUDINARY_CLOUD_NAME,
  cloudinaryAPIKey: CLOUDINARY_API_KEY,
  cloudinaryAPISecret: CLOUDINARY_API_SECRET,
};
