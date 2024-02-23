const express = require("express");
const app = express();
const PORT = 4000;
const cors = require("cors"); // Import cors middleware

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Anbu:tQ5wNYbZjfk4rEuT@cluster0.6bzyp56.mongodb.net/CSEA_Hackathon",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const facultySchema = new mongoose.Schema({
  facultyName: String,
  email: String,
  day: String,
  cabin: String,
  schedule: [String],
});



const Faculty = mongoose.model("Faculty", facultySchema);

app.use(express.json());

app.use(cors());

app.post("/api/faculty", async (req, res) => {
  const { facultyName, day, cabin, email, schedule } = req.body;

  if (!facultyName || !email || !cabin || !schedule || !day) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newFaculty = await Faculty.create({
      facultyName,
      email,
      day,
      cabin,
      schedule,
    });

    res.json(newFaculty);
  } catch (err) {
    console.error("Error creating faculty:", err);
    res.status(500).json({ error: "Server error" });
  }
});

function convertTimeToIndex(schedule) {
  const scheduleMap = {
    "8:30-9:20": 0,
    "9:20-10:10": 1,
    "10:10-11:20": 2,
    "11:20-12:10": 3,
    "1:40-2:30": 4,
    "2:30-3:20": 5,
    "3:20-4:10": 6,
  };

  return scheduleMap[schedule];
}

app.post("/api/student", async (req, res) => {
  const { facultyName, day, schedule } = req.body;

  if (!facultyName || !day || !schedule) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const faculty = await Faculty.findOne({ facultyName: facultyName, day: day });

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const scheduleIndex = convertTimeToIndex(schedule);

    const cabin = faculty.schedule[scheduleIndex];

    res.json({ cabin });
  } catch (err) {
    console.error("Error searching for faculty availability:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});