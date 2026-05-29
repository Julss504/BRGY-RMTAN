const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = 'admin@email.com';
    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      // If exists, update role and status if needed
      if (admin.role !== 'admin' || admin.status !== 'approved') {
        admin.role = 'admin';
        admin.status = 'approved';
        await admin.save();
        console.log('Admin user updated to have admin role and approved status');
      } else {
        console.log('Admin user already exists with correct role and status');
      }
    } else {
      // Create new admin user
      admin = new User({
        email: adminEmail,
        password: 'admin123',
        fullName: 'System Administrator',
        contactNumber: '00000000000',
        role: 'admin',
        status: 'approved',
      });
      await admin.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();