const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        profilePic: {
            type: String,
            default: '',
        },
        password: {
            type: String,
            required: true,
            select: true
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
