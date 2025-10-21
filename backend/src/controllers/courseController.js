const courseService = require('../services/courseService');

const createCourse = async(req, res) =>{
    try {
        const {uid} = req.user;
        const {title, description, price, parentId} = req.body;

        const course = await courseService.createCourse(
            uid,
            {title, description, price, parentId}
        )

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: {
                course
            }
        })
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating course',
            error: error.message
        });
    }
}

module.exports = {
    createCourse
}