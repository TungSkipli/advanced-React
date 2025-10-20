const authService = require('../services/authService');
const AuthService = require('../services/authService')


const Register = async (req, res) => {
    const userData = await AuthService.Register(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            user: userData,
        },
    })
};

const Login = async(req, res ) =>{
    const userData = await authService.login(req.body.Token)
    res.status(200).json({
        status:'success',
        data:{
            user :userData
        }
    })
};

const getUserProfile = async(req,res)=>{
    const userProfileData = await authService.getUserProfile(req.params.id)
    res.status(200).json({
        status:'success',
        data:{user:userProfileData}
    })
};

const updateUserProfile = async(req,res)=>{
    const updatedUserData = await authService.updateUserProfile(req.params.id, req.body)
    res.status(200).json({
        status:'success',
        data:{user:updatedUserData}
    })
};

module.exports = {
    Register,
    Login,
    getUserProfile,
    updateUserProfile
};