const mongoose = require('mongoose');

const studentPromotionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fromYear: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    toYear: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    promotedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    promoterName: {
      type: String,
    },
    academicYear: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
    },
    promotedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
studentPromotionSchema.index({ studentId: 1 });
studentPromotionSchema.index({ academicYear: 1 });

module.exports = mongoose.model('StudentPromotion', studentPromotionSchema);
