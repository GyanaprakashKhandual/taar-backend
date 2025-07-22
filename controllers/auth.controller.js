const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  const { email, fullName, password, profilePic } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      profilePic,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res
        .status(401)
        .json({ message: 'Some error occurred while creating the new user.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }

};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};


const updateProfile = async (req, res) => {
  try {
    
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic) {
      return res.status(400)
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});
  } catch (error) {
    console.log('Error in update profile: ', error);
    res.status(500).json({message: 'Internal server error'});
  }
}

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error in check auth controller', error);
    res.status(500).json({message: 'Internal server error'});
  }
}

module.exports = { register, login, logout, updateProfile, checkAuth };
