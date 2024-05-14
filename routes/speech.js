const express = require("express");
const SpeechRouter = express.Router({ mergeParams: true });
const SpeechController = require("../controllers/speechController");
const multer = require("multer");
const path = require("path");

// Define the allowed file types
const allowedFileTypes = ["audio/mp3", "audio/wav"];
let fileNameWithTime;

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "SpeechAudiosUploads/"); // Define the destination folder
  },

  filename: function (req, file, cb) {
    // Define the file name
    const now = new Date();
    const year = now.getFullYear(); // Get the full year (e.g., 2024)
    const month = now.getMonth() + 1; // Get the month (0-11, so add 1 for January to December)
    const day = now.getDate(); // Get the day of the month (1-31)
    const hours = now.getHours(); // Get the hours (0-23)
    const minutes = now.getMinutes(); // Get the minutes (0-59)
    const seconds = now.getSeconds(); // Get the seconds (0-59)
    const filenameWithoutExtension = path.parse(file.originalname).name;
    fileNameWithTime =
      filenameWithoutExtension +
      "_" +
      day +
      month +
      year +
      hours +
      minutes +
      seconds +
      path.extname(file.originalname);
    cb(null, fileNameWithTime);
  },
});

const fileFilter = function (req, file, cb) {
  // Check if the file type is allowed
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file with an error message
    cb(new Error("File type not allowed"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

SpeechRouter.get("/speech", SpeechController.getSpeeches);
SpeechRouter.post(
  "/speech/create",
  upload.single("speechAudio"),
  (req, res, next) => {
    req.body.fileNameWithTime = fileNameWithTime; // Pass fileNameWithTime to next middleware
    next();
  },
  SpeechController.createSpeechPost
);
// SpeechRouter.post("/speech/create", SpeechController.createSpeechPost);
// SpeechRouter.patch(
//   "/ivr-campaign/:ivrCampaignId/speech/:speechId/edit",
//   upload.single("speechAudio"),
//   SpeechController.updateSpeechPatch
// );
SpeechRouter.patch(
  "/ivr-campaign/:ivrCampaignId/speech/:speechId/edit",
  SpeechController.updateSpeechPatch
);
SpeechRouter.delete(
  "/ivr-campaign/:ivrCampaignId/speech/:speechId/delete",
  SpeechController.removeSpeechDelete
);

module.exports = SpeechRouter;
