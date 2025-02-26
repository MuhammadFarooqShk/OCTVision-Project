require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const marketplaceRoutes = require('./routes/marketplaces');

connection();

app.use(express.json());
app.use(cors());


app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/patients",patientRoutes);
app.use("/api/marketplace",marketplaceRoutes);

const port = process.env.PORT || 8080;
app.listen(port,()=>console.log(`Listening on PORT ${port}`));