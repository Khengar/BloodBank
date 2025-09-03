import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodType: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  location: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  contact: { type: String, required: true, trim: true, minlength: 10, maxlength: 50 },
  urgency: { type: String, required: true, enum: ['low','medium','high'], default: 'medium' },
  description: { type: String, trim: true, maxlength: 500 },
  isActive: { type: Boolean, default: true },
  fulfillmentDate: { type: Date, default: null }
}, { timestamps: true });

// Indexes for performance
bloodRequestSchema.index({ bloodType: 1, location: 1, urgency: 1, isActive: 1 });
bloodRequestSchema.index({ userId: 1 });
bloodRequestSchema.index({ createdAt: -1 });

// ✅ Named export
export const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);