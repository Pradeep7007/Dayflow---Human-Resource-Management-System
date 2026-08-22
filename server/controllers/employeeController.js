const User = require('../models/User');

// GET Employee Profile
exports.getProfile = async (req, res) => {
  try {
    const targetId = req.params.id || req.user.id;
    const user = await User.findById(targetId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee profile not found.' });
    }

    res.status(200).json({
      success: true,
      profile: user.toAuthJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};

// UPDATE Employee Profile
exports.updateProfile = async (req, res) => {
  try {
    const targetId = req.params.id || req.user.id;
    const user = await User.findById(targetId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee profile not found.' });
    }

    const isSelf = req.user.id === targetId;
    const isAdminOrHr = req.user.role === 'admin' || req.user.role === 'hr';

    if (!isSelf && !isAdminOrHr) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges.' });
    }

    const {
      name,
      phone,
      address,
      dob,
      gender,
      emergencyContact,
      avatarUrl,
      // Admin/HR controlled fields
      jobTitle,
      department,
      manager,
      employmentType,
      workLocation,
      dateOfJoining,
      status,
      salaryStructure,
    } = req.body;

    // Fields accessible to self (employee)
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    // Additional fields accessible only to Admin / HR
    if (isAdminOrHr) {
      if (name !== undefined) user.name = name;
      if (dob !== undefined) user.dob = dob;
      if (gender !== undefined) user.gender = gender;
      if (jobTitle !== undefined) user.jobTitle = jobTitle;
      if (department !== undefined) user.department = department;
      if (manager !== undefined) user.manager = manager;
      if (employmentType !== undefined) user.employmentType = employmentType;
      if (workLocation !== undefined) user.workLocation = workLocation;
      if (dateOfJoining !== undefined) user.dateOfJoining = dateOfJoining;
      if (status !== undefined) user.status = status;
      if (salaryStructure !== undefined) {
        user.salaryStructure = { ...user.salaryStructure, ...salaryStructure };
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Employee profile updated successfully.',
      profile: user.toAuthJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update profile.' });
  }
};

// ADD Document to Profile
exports.addDocument = async (req, res) => {
  try {
    const targetId = req.params.id || req.user.id;
    const user = await User.findById(targetId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const { name, type, fileUrl } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Document name and type are required.' });
    }

    const newDoc = {
      name,
      type,
      fileUrl: fileUrl || '#',
      status: 'Verified',
      uploadDate: new Date(),
    };

    user.documents.push(newDoc);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully.',
      documents: user.documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add document.' });
  }
};

// DELETE Document
exports.deleteDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const user = await User.findById(id || req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    user.documents = user.documents.filter((doc) => doc._id.toString() !== docId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully.',
      documents: user.documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete document.' });
  }
};

// CREATE Employee Account (Admin / HR Only)
exports.createEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, password, role, department, jobTitle, phone, workLocation } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Employee ID, Name, Email and Password are required.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email address already registered.' });
    }

    const existingId = await User.findOne({ employeeId });
    if (existingId) {
      return res.status(400).json({ success: false, message: 'Employee ID already exists.' });
    }

    const newUser = await User.create({
      employeeId,
      name,
      email,
      password,
      role: role || 'employee',
      department: department || 'Engineering',
      jobTitle: jobTitle || 'Software Engineer',
      phone: phone || '',
      workLocation: workLocation || 'Office',
      status: 'active',
      isEmailVerified: true,
    });

    res.status(201).json({
      success: true,
      message: `${newUser.role.toUpperCase()} account created successfully for ${newUser.name}.`,
      employee: newUser.toAuthJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create employee account.' });
  }
};
