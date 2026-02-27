const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        category: {
            type: String,
            required: true,
            enum: ['Electrical', 'Plumbing', 'Internet', 'Cleaning', 'Other'],
        },
        description: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            required: true,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'In Progress', 'Resolved'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
