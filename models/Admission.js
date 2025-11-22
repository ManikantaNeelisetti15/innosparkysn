const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  mode: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admission', admissionSchema);
