import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  action: { type: String, required: true },
  details: String
});

const Log = mongoose.model('Log', logSchema);
export default Log;

