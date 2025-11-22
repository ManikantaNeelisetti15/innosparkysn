// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

// =========================
// 1. Connect to MongoDB
// =========================
const mongoURI = 'mongodb://127.0.0.1:27017/innosparkDB'; // Use local MongoDB or replace with Atlas URI

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// =========================
// 2. Middleware
// =========================
app.use(express.json()); // parse JSON POST requests
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
; // serve static files (HTML, CSS, JS)

// =========================
// 3. Mongoose Schema & Model
// =========================
const admissionSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, required: true, unique: true },
  mobile: String,
  course: String,
  mode: String,
  submittedAt: { type: Date, default: Date.now }
});

const Admission = mongoose.model('Admission', admissionSchema);

// =========================
// 4. API endpoint to receive form data
// =========================
app.post('/api/admissions', async (req, res) => {
  try {
    const { fullName, email, mobile, course, mode } = req.body;

    // Check if email already exists
    const exists = await Admission.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'Student already enrolled with this email.' });
    }

    const newAdmission = new Admission({ fullName, email, mobile, course, mode });
    await newAdmission.save();

    res.json({ message: 'Form data stored successfully in MongoDB!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to store data.' });
  }
});

// =========================
// 5. Start Server
// =========================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

