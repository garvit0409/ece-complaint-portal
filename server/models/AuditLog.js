const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'view_anonymous_identity',
        'create_user',
        'update_user',
        'delete_user',
        'promote_student',
        'escalate_complaint',
        'resolve_complaint',
        'reject_complaint',
        'reopen_complaint',
        'add_teacher',
        'edit_teacher',
        'delete_teacher',
      ],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    targetType: {
      type: String,
      enum: ['User', 'Complaint', 'StudentPromotion'],
    },
    details: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
