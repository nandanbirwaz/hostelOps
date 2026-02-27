require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

// Connect to DB
connectDB();

const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@hostelops.com' });

        if (adminExists) {
            console.log('Admin user already exists!');
            process.exit();
        }

        const adminUser = await User.create({
            name: 'Hostel Admin',
            email: 'admin@hostelops.com',
            password: 'adminpassword123',
            role: 'admin',
        });

        console.log(`Admin seeded successfully: ${adminUser.email}`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
