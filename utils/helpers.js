const jwt = require("jsonwebtoken");
const { createTransport } = require("nodemailer");
const bycrypt = require("bcrypt");
const Speakeasy = require("speakeasy");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const config = require("../config/config");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const throwError = (errorMsg, statusCode, validationError) => {
  const error = new Error(errorMsg);
  error.statusCode = statusCode;
  error.validationError = validationError;
  throw error;
};
const salt = async () => await bycrypt.genSalt(10);
const companyLogoUrl = `${config.BACKEND_URL}/images/company-logo.svg`;

const hashPassword = async (password) => {
  const hash = await bycrypt.hash(password, await salt());

  return hash;
};

const JWTToken = (email, authId) => {
  const token = jwt.sign(
    {
      email,
      authId,
    },
    `${config.JWT_SECRET}`,
    {
      expiresIn: "30d",
    }
  );

  return token;
};

const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bycrypt.compare(password, hashedPassword);
    if (!isMatch) {
      throwError("Invalid password", StatusCodes.BAD_REQUEST);
    }
  } catch (error) {
    console.error(error);
    throwError("Invalid password", StatusCodes.BAD_REQUEST);
  }
};

const sendEmail = async function (content, to, subject) {
  const mailOption = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    html: content,
  };

  try {
    const transport = createTransport({
      service: config.HOST, // Example: 'smtp.yourprovider.com'
      // port: 465,
      // secure: true,
      host: "smtp.gmail.com",
      auth: {
        user: config.EMAIL,
        pass: config.MAIL_PASSWORD,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    const info = await transport.sendMail(mailOption);

    return info;
  } catch (error) {
    console.log(error);
  }
};

async function reqTwoFactorAuth() {
  const secret = Speakeasy.generateSecret({ length: 10 });

  const token = Speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
    step: 240,
    digits: 4,
  });

  return { token, secret: secret.base32 };
}

async function verifyTwoFactorAuth(token, secret) {
  const isValid = Speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
    step: 240,
  });

  return isValid;
}

async function detetectFileype(file) {
  const extension = path.extname(file); // Get the file extension
  return extension;
}
// async function uploadMultipleFiles(files) {
//   try {
//     const promises = files.map((file) => {
//       return new Promise(async (resolve, reject) => {
//         const fileType = await detetectFileype(file.filename);
//         if (fileType === ".mp4") {
//           const upload = await cloudinary.uploader.upload(file.path, {
//             resource_type: "video",
//             type: "upload",
//           });
//           resolve(upload);
//         }

//         if (
//           fileType === ".png" ||
//           fileType === ".jpg" ||
//           fileType === ".jpeg"
//         ) {
//           const upload = await cloudinary.uploader.upload(file.path, {
//             resource_type: "image",
//             type: "upload",
//           });
//           resolve(upload);
//         }
//         if (
//           fileType !== ".mp4" ||
//           fileType !== ".png" ||
//           fileType !== ".jpg" ||
//           fileType !== ".jpeg"
//         ) {
//           const upload = await cloudinary.uploader.upload(file.path, {
//             resource_type: "raw",
//             type: "upload",
//           });
//           resolve(upload);
//         }

//         // cloudinary.uploader.upload(file.path, (error, result) => {
//         //   if (error) reject(error);
//         //   else resolve(result);
//         // });
//       });
//     });

//     const uploads = await Promise.all(promises);
//     console.log("Uploads:", uploads);
//     return uploads;
//   } catch (error) {
//     console.error("Error uploading files:", error);
//     throw error;
//   }
// }
async function uploadMultipleFiles(files) {
  try {
    const uploads = await Promise.all(
      files.map(async (file) => {
        try {
          const fileType = await detetectFileype(file.filename);
          if (fileType === ".mp4") {
            const upload = await cloudinary.uploader.upload(file.path, {
              resource_type: "video",
              type: "upload",
            });
            return upload;
          }

          if (
            fileType === ".png" ||
            fileType === ".jpg" ||
            fileType === ".jpeg"
          ) {
            const upload = await cloudinary.uploader.upload(file.path, {
              resource_type: "image",
              type: "upload",
            });
            return upload;
          }

          // Handle other cases here
          const upload = await cloudinary.uploader.upload(file.path, {
            resource_type: "raw",
            type: "upload",
          });
          return upload;
        } catch (error) {
          console.error("Error processing file:", error);
          throw error; // Propagate the error to the outer catch block
        }
      })
    );
    console.log("Uploads:", uploads);
    return uploads;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
}

module.exports = {
  throwError,
  salt,
  hashPassword,
  JWTToken,
  comparePassword,
  sendEmail,
  reqTwoFactorAuth,
  verifyTwoFactorAuth,
  companyLogoUrl,
  uploadMultipleFiles,
};
