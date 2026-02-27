const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .post(protect, createComplaint)
    .get(protect, getComplaints);

router.route('/:id')
    .get(protect, getComplaintById)
    .put(protect, admin, updateComplaintStatus); // Only admin can update status

module.exports = router;
