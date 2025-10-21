const API_URL = process.env.REACT_APP_API_URL;

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

export const createCourse = async (title, description, price, userId, parentId = null) => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/courses/createCourse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, price, userId, parentId })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'Failed to create course');
        }

        return data.data.course;
    } catch (error) {
        console.error('Create course error:', error);
        throw error;
    }
};