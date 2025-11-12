// Email templates for different notification types

const getComplaintSubmittedTemplate = (complaint, studentName) => {
  return {
    subject: `[ECE Portal] Complaint #${complaint.complaintId} - Submitted Successfully`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Complaint Submitted Successfully</h2>
        <p>Dear ${studentName},</p>
        <p>Your complaint has been successfully submitted to the ECE Complaint Portal.</p>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Complaint Details:</h3>
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Priority:</strong> ${complaint.priority}</p>
          <p><strong>Status:</strong> ${complaint.status}</p>
          <p><strong>Assigned To:</strong> ${complaint.currentLevel === 'teacher' ? 'Teacher' : complaint.currentLevel === 'mentor' ? 'Mentor' : 'HOD'}</p>
        </div>

        <p>You will receive email notifications when your complaint status changes.</p>
        <p>You can track your complaint status at: <a href="${process.env.CLIENT_URL}/student/track/${complaint.complaintId}" style="color: #2563eb;">Track Complaint</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          ECE Complaint Management System<br>
          Department of Electronics & Communication Engineering
        </p>
      </div>
    `,
  };
};

const getStatusChangedTemplate = (complaint, studentName, handlerName, role) => {
  return {
    subject: `[ECE Portal] Complaint #${complaint.complaintId} - Status Updated`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Complaint Status Updated</h2>
        <p>Dear ${studentName},</p>
        <p>Your complaint status has been updated.</p>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Complaint Details:</h3>
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Current Status:</strong> ${complaint.status}</p>
          <p><strong>Handled By:</strong> ${handlerName} (${role})</p>
          <p><strong>Updated At:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <p>You can track your complaint status at: <a href="${process.env.CLIENT_URL}/student/track/${complaint.complaintId}" style="color: #2563eb;">Track Complaint</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          ECE Complaint Management System<br>
          Department of Electronics & Communication Engineering
        </p>
      </div>
    `,
  };
};

const getEscalatedTemplate = (complaint, studentName, fromRole, toRole) => {
  return {
    subject: `[ECE Portal] Complaint #${complaint.complaintId} - Escalated`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Complaint Escalated</h2>
        <p>Dear ${studentName},</p>
        <p>Your complaint has been escalated to the next level for further review.</p>

        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3>Escalation Details:</h3>
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Escalated From:</strong> ${fromRole}</p>
          <p><strong>Escalated To:</strong> ${toRole}</p>
          <p><strong>Status:</strong> Escalated</p>
        </div>

        <p>The ${toRole} will review your complaint and take appropriate action.</p>
        <p>You can track your complaint status at: <a href="${process.env.CLIENT_URL}/student/track/${complaint.complaintId}" style="color: #2563eb;">Track Complaint</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          ECE Complaint Management System<br>
          Department of Electronics & Communication Engineering
        </p>
      </div>
    `,
  };
};

const getResolvedTemplate = (complaint, studentName, handlerName, role) => {
  return {
    subject: `[ECE Portal] Complaint #${complaint.complaintId} - Resolved`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Complaint Resolved</h2>
        <p>Dear ${studentName},</p>
        <p>Great news! Your complaint has been resolved.</p>

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3>Resolution Details:</h3>
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Status:</strong> Resolved</p>
          <p><strong>Resolved By:</strong> ${handlerName} (${role})</p>
          <p><strong>Resolved At:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <p>We would appreciate your feedback on how we handled your complaint.</p>
        <p>Please provide feedback at: <a href="${process.env.CLIENT_URL}/student/feedback/${complaint._id}" style="color: #2563eb;">Submit Feedback</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          ECE Complaint Management System<br>
          Department of Electronics & Communication Engineering
        </p>
      </div>
    `,
  };
};

const getRejectedTemplate = (complaint, studentName, handlerName, role) => {
  return {
    subject: `[ECE Portal] Complaint #${complaint.complaintId} - Rejected`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Complaint Rejected</h2>
        <p>Dear ${studentName},</p>
        <p>We regret to inform you that your complaint has been rejected.</p>

        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3>Complaint Details:</h3>
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Status:</strong> Rejected</p>
          <p><strong>Reviewed By:</strong> ${handlerName} (${role})</p>
        </div>

        <p>If you believe this decision was made in error, you can reopen the complaint with additional justification.</p>
        <p>You can track your complaint status at: <a href="${process.env.CLIENT_URL}/student/track/${complaint.complaintId}" style="color: #2563eb;">Track Complaint</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          ECE Complaint Management System<br>
          Department of Electronics & Communication Engineering
        </p>
      </div>
    `,
  };
};

const getReopenedTemplate = (complaint, studentName) => {
  return {
    subject: `[ECE Portal] Complaint #${complaint.complaintId} - Reopened`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Complaint Reopened</h2>
        <p>Dear ${studentName},</p>
        <p>Your complaint has been reopened for further review.</p>

        <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3>Complaint Details:</h3>
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Status:</strong> Reopened</p>
          <p><strong>Reopened At:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <p>The complaint will be reviewed again by the appropriate handler.</p>
        <p>You can track your complaint status at: <a href="${process.env.CLIENT_URL}/student/track/${complaint.complaintId}" style="color: #2563eb;">Track Complaint</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          ECE Complaint Management System<br>
          Department of Electronics & Communication Engineering
        </p>
      </div>
    `,
  };
};

const getNewComplaintHandlerTemplate = (complaint, handlerName, role) => {
  const roleTitle = role === 'teacher' ? 'Teacher' : role === 'mentor' ? 'Mentor' : 'HOD';
  return {
    subject: `[ECE Portal] New Complaint Assigned - #${complaint.complaintId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Complaint Assigned</h2>
        <p>Dear ${handlerName},</p>
        <p>A new complaint has been assigned to you for review.</p>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Complaint Details:</h3>
          <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
          <p><strong>Title:</strong> ${complaint.title}</p>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Priority:</strong> ${complaint.priority}</p>
          <p><strong>Student:</strong> ${complaint.isAnonymous ? 'Anonymous Student' : complaint.studentName}</p>
          <p><strong>Submitted:</strong> ${new Date(complaint.submittedAt).toLocaleString()}</p>
        </div>

        <p>Please review and take appropriate action on this complaint.</p>
        <p>Access the complaint at: <a href="${process.env.CLIENT_URL}/${role}/complaint/${complaint._id}" style="color: #2563eb;">View Complaint</a></p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          ECE Complaint Management System<br>
          Department of Electronics & Communication Engineering
        </p>
      </div>
    `,
  };
};

module.exports = {
  getComplaintSubmittedTemplate,
  getStatusChangedTemplate,
  getEscalatedTemplate,
  getResolvedTemplate,
  getRejectedTemplate,
  getReopenedTemplate,
  getNewComplaintHandlerTemplate,
};
