const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    // Encrypted student ID for anonymous complaints (only HOD can decrypt)
    actualStudentId: {
      type: String, // Encrypted string
    },
    // Complaint Details
    category: {
      type: String,
      enum: [
        'Lab Equipment',
        'Classroom Infrastructure',
        'Faculty Related',
        'Academic Issues',
        'Project/Internship',
        'Exam Related',
        'Attendance Issues',
        'Timetable Issues',
        'Others',
      ],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Please provide a complaint description'],
      maxlength: 2000,
    },
    attachments: [
      {
        url: String,
        publicId: String,
        filename: String,
      },
    ],
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    // Hierarchical Assignment
    currentLevel: {
      type: String,
      enum: ['teacher', 'mentor', 'hod'],
      default: 'teacher',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Status Tracking
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Resolved', 'Escalated', 'Rejected', 'Reopened'],
      default: 'Pending',
    },
    // Resolution Details
    resolutionNotes: [
      {
        resolvedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        resolverName: String,
        role: String,
        note: String,
        action: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Escalation History
    escalationHistory: [
      {
        from: String,
        to: String,
        reason: String,
        escalatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Reopening
    isReopened: {
      type: Boolean,
      default: false,
    },
    reopenReason: String,
    reopenedAt: Date,
    reopenCount: {
      type: Number,
      default: 0,
    },
    // Feedback
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      submittedAt: Date,
    },
    // Timestamps
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
complaintSchema.index({ complaintId: 1 });
complaintSchema.index({ studentId: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ currentLevel: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
