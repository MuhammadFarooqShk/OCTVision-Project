const router = require("express").Router();
const joi = require('joi');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Patient = require("../models/patient");

router.get("/viewpatients/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({ PatientID: req.params.id });
    if (!patient) return res.status(404).send({ message: "Patient not found" });
    res.status(200).send(patient);
  } catch (error) {
    res.status(500).send({ message: "Error fetching patient details", error });
  }
});

router.get("/viewpatients", async (req, res) => {
  try {
    const { userID } = req.query;
    const patients = await Patient.find({ UserID: userID });
    res.status(200).send(patients);
  } catch (error) {
    res.status(500).send({ message: "Error fetching patients", error });
  }
});

router.post("/", async (req, res) => {
    try {
      const lastPatient = await Patient.findOne().sort({ PatientID: -1 });
      const newPatientID = lastPatient ? lastPatient.PatientID + 1 : 1;
  
      const newPatient = new Patient({
        PatientID: newPatientID,
        PatientName: req.body.PatientName,
        Age: req.body.Age,
        Gender: req.body.Gender,
        Contact: req.body.Contact,
        UserID: req.body.UserID,
        Scans: [
          {
            ScanID: 1,
            Date: new Date(),
          },
        ],
      });
  
      await newPatient.save();
      res.status(201).send(newPatient);
    } catch (error) {
      res.status(500).send({ message: "Error adding patient", error });
    }
  });
  
  router.post("/:id/scans", async (req, res) => {
    try {
      const patient = await Patient.findOne({ PatientID: req.params.id });
      if (!patient) return res.status(404).send({ message: "Patient not found" });
  
      const lastScan = patient.Scans.length > 0 ? patient.Scans[patient.Scans.length - 1] : null;
      const newScanID = lastScan ? lastScan.ScanID + 1 : 1;
  
      patient.Scans.push({
        ScanID: newScanID,
        Date: new Date(),
      });
  
      await patient.save();
      res.status(201).send(patient);
    } catch (error) {
      res.status(500).send({ message: "Error adding scan", error });
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      const { searchQuery } = req.query;
      const patients = await Patient.find({
        $or: [
          { PatientName: new RegExp(searchQuery, "i") },
          { Contact: new RegExp(searchQuery, "i") },
        ],
      });
      res.status(200).send(patients);
    } catch (error) {
      res.status(500).send({ message: "Error fetching patients", error });
    }
  });

  module.exports = router;