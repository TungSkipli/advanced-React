const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const userData = await authService.register(req.body);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userData,
            },
        });
    } catch (error) {
        console.error('Register controller error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

const login = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        const userData = await authService.login(token);
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userData
            }
        });
    } catch (error) {
        console.error('Login controller error:', error);
        res.status(401).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const uid = req.user.uid;

        const userProfileData = await authService.getUserProfile(uid);
        
        res.status(200).json({
            success: true,
            data: {
                user: userProfileData
            }
        });
    } catch (error) {
        console.error('Get user profile controller error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to get user profile'
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const uid = req.user.uid;

        const updatedUserData = await authService.updateUserProfile(uid, req.body);
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: updatedUserData
            }
        });
    } catch (error) {
        console.error('Update user profile controller error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to update user profile'
        });
    }
};

module.exports = {
    register,
    login,
    getUserProfile,
    updateUserProfile
};