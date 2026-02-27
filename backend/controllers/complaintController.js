const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res, next) => {
    try {
        const { category, description, priority } = req.body;

        if (!category || !description) {
            res.status(400);
            throw new Error('Please add all required fields');
        }

        const complaint = await Complaint.create({
            user: req.user.id,
            category,
            description,
            priority: priority || 'Medium',
        });

        res.status(201).json(complaint);
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user's complaints or all complaints (if admin)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
    try {
        const query = {};

        // Apply filters from query params
        if (req.query.status) query.status = req.query.status;
        if (req.query.category) query.category = req.query.category;

        // If student, only show their complaints
        if (req.user.role === 'student') {
            query.user = req.user.id;
        }

        const complaints = await Complaint.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

        if (!complaint) {
            res.status(404);
            throw new Error('Complaint not found');
        }

        // Only admin or the complaint owner can view it
        if (req.user.role !== 'admin' && complaint.user._id.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to view this complaint');
        }

        res.status(200).json(complaint);
    } catch (error) {
        next(error);
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            res.status(400);
            throw new Error('Please provide a status');
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            res.status(404);
            throw new Error('Complaint not found');
        }

        complaint.status = status;
        const updatedComplaint = await complaint.save();

        res.status(200).json(updatedComplaint);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus,
};
