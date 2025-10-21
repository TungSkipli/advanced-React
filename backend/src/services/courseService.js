const {db} = require('../config/firebase');

const COLLECTION_NAME = 'courses';

const createCourse = async (userId, courseData) => {
    try {
        const { title, description, price, parentId = null } = courseData;

        if(!title || title.trim() === '') {
            throw new Error('Course title is required');
        }else if (!description || description.trim() === ''){
            throw new Error('Course description is required');
        } else if (!price){
            throw new Error('Course price is required');
        }

        const course = {
            userId,
            title: title.trim(),
            description: description.trim(),
            price,
            parentId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isEdited: false
        }

        const docRef = await db.collection(COLLECTION_NAME).add(course);

        return {
            id:docRef.id,
            ...course
        }

    } catch (error) {
        console.error('Error creating course:', error);
        throw new Error('Error creating course');
    }
}

module.exports = {
    createCourse
};