const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

const connectionstring = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sdk1o7l.mongodb.net/test`;

mongoose.connect(connectionstring, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err.message);
});

const server = app.listen(process.env.PORT || 5050, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
