# Fix API BaseURL Issue - Update Components to Use Configured Axios Instance

## Problem
Components are importing axios directly instead of using the configured api instance from `client/src/services/api.js`. This causes requests to go to the frontend domain instead of the backend API, resulting in 404 errors.

## Files to Update
- [ ] client/src/pages/public/Login.jsx
- [ ] client/src/pages/public/Register.jsx
- [ ] client/src/pages/public/ForgotPassword.jsx
- [ ] client/src/pages/student/Dashboard.jsx
- [ ] client/src/pages/student/SubmitComplaint.jsx
- [ ] client/src/pages/student/MyComplaints.jsx
- [ ] client/src/pages/student/TrackComplaint.jsx
- [ ] client/src/pages/student/Profile.jsx
- [ ] client/src/pages/student/Feedback.jsx

## Changes Required
For each file:
1. Change import from `import axios from 'axios';` to `import api from '../services/api';`
2. Replace all `axios.` calls with `api.`

## Testing
After updates, test registration functionality on deployed site to ensure 404 error is resolved.
