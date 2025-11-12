const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { generateComplaintId } = require('../utils/generateId');
const { sendEmail } = require('../utils/sendEmail');
const { emailTemplates } = require('../utils/emailTemplates');
const { encrypt, decrypt } = require('../utils/encryption');
const cloudinary = require('../config/cloudinary');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Students only)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, assignedTeacher, isAnonymous } = req.body;
    const studentId = req.user.id;

    // Generate complaint ID
    const complaintId = await generateComplaintId();

    // Handle file uploads
    let attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'ece-complaints',
          resource_type: 'auto',
        });
        attachments.push({
          url: result.secure_url,
          publicId: result.public_id,
          filename: file.originalname,
        });
      }
    }

    // Get student details
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Determine assigned teacher
    let finalAssignedTeacher = assignedTeacher;
    if (!finalAssignedTeacher && student.assignedTeacher) {
      finalAssignedTeacher = student.assignedTeacher;
    }

    // Create complaint
    const complaintData = {
      complaintId,
      studentId,
      studentName: isAnonymous ? 'Anonymous Student' : student.name,
      title,
      description,
      category,
      priority: priority || 'Medium',
      attachments,
      isAnonymous,
      currentLevel: 'teacher',
      assignedTo: finalAssignedTeacher,
      assignedTeacher: finalAssignedTeacher,
      status: 'Pending',
    };

    // If anonymous, encrypt actual student ID
    if (isAnonymous) {
      complaintData.actualStudentId = encrypt(studentId.toString());
    }

    const complaint = await Complaint.create(complaintData);

    // Create notification for assigned teacher
    if (finalAssignedTeacher) {
      await Notification.create({
        userId: finalAssignedTeacher,
        complaintId: complaint._id,
        type: 'complaint_submitted',
        message: `New complaint submitted: ${title}`,
      });

      // Send email to teacher
      const teacher = await User.findById(finalAssignedTeacher);
      if (teacher) {
        const emailHtml = emailTemplates.newComplaint(
          teacher.name,
          complaintId,
          title,
          isAnonymous ? 'Anonymous Student' : student.name
        );

        await sendEmail({
          to: teacher.email,
          subject: `New Complaint Assigned - ${complaintId}`,
          html: emailHtml,
        });
      }
    }

    // Send confirmation email to student
    const studentEmailHtml = emailTemplates.complaintConfirmation(
      student.name,
      complaintId,
      title
    );

    await sendEmail({
      to: student.email,
      subject: `Complaint Submitted Successfully - ${complaintId}`,
      html: studentEmailHtml,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: {
        id: complaint._id,
        complaintId: complaint.complaintId,
        status: complaint.status,
        submittedAt: complaint.createdAt,
      },
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during complaint submission',
    });
  }
};

// @desc    Get complaints based on user role
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    let complaints;

    switch (user.role) {
      case 'student':
        complaints = await Complaint.find({ studentId: userId })
          .sort({ createdAt: -1 });
        break;

      case 'teacher':
        complaints = await Complaint.find({
          $or: [
            { assignedTeacher: userId },
            { assignedTo: userId },
          ],
        }).sort({ createdAt: -1 });
        break;

      case 'mentor':
        complaints = await Complaint.find({
          $or: [
            { assignedMentor: userId },
            { assignedTo: userId },
          ],
        }).sort({ createdAt: -1 });
        break;

      case 'hod':
        complaints = await Complaint.find({})
          .sort({ createdAt: -1 });
        break;

      default:
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access',
        });
    }

    res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check if user has access to this complaint
    const userId = req.user.id;
    const user = await User.findById(userId);
    let hasAccess = false;

    switch (user.role) {
      case 'student':
        hasAccess = complaint.studentId.toString() === userId;
        break;
      case 'teacher':
        hasAccess = complaint.assignedTeacher?.toString() === userId ||
                   complaint.assignedTo?.toString() === userId;
        break;
      case 'mentor':
        hasAccess = complaint.assignedMentor?.toString() === userId ||
                   complaint.assignedTo?.toString() === userId;
        break;
      case 'hod':
        hasAccess = true;
        break;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('Get complaint by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Teachers, Mentors, HOD)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaintId = req.params.id;
    const userId = req.user.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const user = await User.findById(userId);
    const oldStatus = complaint.status;

    // Update status
    complaint.status = status;
    complaint.updatedAt = new Date();

    // Add resolution notes if provided
    if (resolutionNotes) {
      complaint.resolutionNotes.push({
        resolvedBy: userId,
        role: user.role,
        note: resolutionNotes,
        action: `Status changed to ${status}`,
        timestamp: new Date(),
      });
    }

    // Set resolved date if status is resolved/rejected
    if (['Resolved', 'Rejected'].includes(status)) {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // Create notification for student
    const studentId = complaint.isAnonymous ? decrypt(complaint.actualStudentId) : complaint.studentId;
    await Notification.create({
      userId: studentId,
      complaintId: complaint._id,
      type: 'status_changed',
      message: `Your complaint ${complaint.complaintId} status changed from ${oldStatus} to ${status}`,
    });

    // Send email notification
    const student = await User.findById(studentId);
    if (student) {
      const emailHtml = emailTemplates.statusUpdate(
        complaint.studentName,
        complaint.complaintId,
        complaint.title,
        oldStatus,
        status,
        resolutionNotes || 'No additional notes'
      );

      await sendEmail({
        to: student.email,
        subject: `Complaint Status Update - ${complaint.complaintId}`,
        html: emailHtml,
      });
    }

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint,
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Escalate complaint
// @route   PUT /api/complaints/:id/escalate
// @access  Private (Teachers, Mentors)
const escalateComplaint = async (req, res) => {
  try {
    const { reason } = req.body;
    const complaintId = req.params.id;
    const userId = req.user.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const user = await User.findById(userId);
    const oldLevel = complaint.currentLevel;

    // Determine escalation level
    let newLevel, assignedTo;
    if (complaint.currentLevel === 'teacher') {
      newLevel = 'mentor';
      assignedTo = complaint.assignedMentor;
    } else if (complaint.currentLevel === 'mentor') {
      newLevel = 'hod';
      // HOD doesn't need specific assignment
    }

    // Update complaint
    complaint.currentLevel = newLevel;
    complaint.assignedTo = assignedTo;
    complaint.status = 'Escalated';
    complaint.escalationHistory.push({
      from: oldLevel,
      to: newLevel,
      reason: reason || 'No reason provided',
      timestamp: new Date(),
    });
    complaint.updatedAt = new Date();

    await complaint.save();

    // Create notifications
    const studentId = complaint.isAnonymous ? decrypt(complaint.actualStudentId) : complaint.studentId;

    // Notification for student
    await Notification.create({
      userId: studentId,
      complaintId: complaint._id,
      type: 'escalated',
      message: `Your complaint ${complaint.complaintId} has been escalated to ${newLevel}`,
    });

    // Notification for new handler
    if (assignedTo) {
      await Notification.create({
        userId: assignedTo,
        complaintId: complaint._id,
        type: 'complaint_submitted',
        message: `Escalated complaint assigned: ${complaint.title}`,
      });
    }

    // Send emails
    const student = await User.findById(studentId);
    if (student) {
      const emailHtml = emailTemplates.complaintEscalated(
        complaint.studentName,
        complaint.complaintId,
        complaint.title,
        oldLevel,
        newLevel,
        reason || 'No reason provided'
      );

      await sendEmail({
        to: student.email,
        subject: `Complaint Escalated - ${complaint.complaintId}`,
        html: emailHtml,
      });
    }

    res.json({
      success: true,
      message: `Complaint escalated to ${newLevel}`,
      complaint,
    });
  } catch (error) {
    console.error('Escalate complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Reopen complaint
// @route   PUT /api/complaints/:id/reopen
// @access  Private (Students only)
const reopenComplaint = async (req, res) => {
  try {
    const { reason } = req.body;
    const complaintId = req.params.id;
    const userId = req.user.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check if student owns this complaint
    if (complaint.studentId.toString() !== userId && !complaint.isAnonymous) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if complaint is resolved
    if (complaint.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        message: 'Only resolved complaints can be reopened',
      });
    }

    // Reopen complaint
    complaint.status = 'Reopened';
    complaint.isReopened = true;
    complaint.reopenReason = reason;
    complaint.reopenedAt = new Date();
    complaint.assignedTo = complaint.assignedTeacher; // Go back to teacher
    complaint.currentLevel = 'teacher';
    complaint.updatedAt = new Date();

    await complaint.save();

    // Create notification for teacher
    if (complaint.assignedTeacher) {
      await Notification.create({
        userId: complaint.assignedTeacher,
        complaintId: complaint._id,
        type: 'reopened',
        message: `Complaint reopened: ${complaint.title}`,
      });

      // Send email to teacher
      const teacher = await User.findById(complaint.assignedTeacher);
      if (teacher) {
        const emailHtml = emailTemplates.complaintReopened(
          teacher.name,
          complaint.complaintId,
          complaint.title,
          complaint.studentName,
          reason
        );

        await sendEmail({
          to: teacher.email,
          subject: `Complaint Reopened - ${complaint.complaintId}`,
          html: emailHtml,
        });
      }
    }

    res.json({
      success: true,
      message: 'Complaint reopened successfully',
      complaint,
    });
  } catch (error) {
    console.error('Reopen complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Submit feedback
// @route   POST /api/complaints/:id/feedback
// @access  Private (Students only)
const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaintId = req.params.id;
    const userId = req.user.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check if student owns this complaint
    if (complaint.studentId.toString() !== userId && !complaint.isAnonymous) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if complaint is resolved
    if (complaint.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for resolved complaints',
      });
    }

    // Add feedback
    complaint.feedback = {
      rating: parseInt(rating),
      comment: comment || '',
      submittedAt: new Date(),
    };

    await complaint.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get user's complaints
// @route   GET /api/complaints/my-complaints
// @access  Private (Students)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Search complaint by ID
// @route   GET /api/complaints/search/:complaintId
// @access  Private
const searchComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({ complaintId });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check access permissions
    const userId = req.user.id;
    const user = await User.findById(userId);
    let hasAccess = false;

    switch (user.role) {
      case 'student':
        hasAccess = complaint.studentId.toString() === userId;
        break;
      case 'teacher':
      case 'mentor':
      case 'hod':
        hasAccess = true; // Staff can search any complaint
        break;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('Search complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  escalateComplaint,
  reopenComplaint,
  submitFeedback,
  getMyComplaints,
  searchComplaintById,
};
