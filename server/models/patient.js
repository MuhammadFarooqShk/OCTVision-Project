const mongoose = require("mongoose");
const { User } = require("../models/user");

const patientSchema = new mongoose.Schema({
  PatientID: { type: Number, required: true },
  PatientName: { type: String, required: true },
  Age: { type: Number, required: true },
  Gender: { type: String, required: true },
  Contact: { type: String, required: true },
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  Scans: [
    {
      ScanID: { type: Number, required: true },
      Date: { type: Date, default: Date.now },
      Disease: { type: String, default: null },
      Segmentation: { type: String, default: null },
      Report: { type: String, default: null },
    },
  ],
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;