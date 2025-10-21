import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as courseService from "../services/courseService";
import '../styles/course.css';

export default function Course() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        parentId: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [createdCourses, setCreatedCourses] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setMessage({ type: 'error', text: 'Please login to create a course' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { title, description, price, parentId } = formData;
            
            // Validate
            if (!title.trim() || !description.trim() || !price) {
                throw new Error('Title, description, and price are required');
            }

            const priceNumber = parseFloat(price);
            if (isNaN(priceNumber) || priceNumber < 0) {
                throw new Error('Price must be a valid positive number');
            }

            const newCourse = await courseService.createCourse(
                title.trim(),
                description.trim(),
                priceNumber,
                parentId.trim() || null
            );

            setMessage({ type: 'success', text: 'Course created successfully!' });
            setCreatedCourses(prev => [newCourse, ...prev]);
            
            // Reset form
            setFormData({
                title: '',
                description: '',
                price: '',
                parentId: ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="course-page">
            <div className="course-container">
                <h1>Course Creation</h1>
                
                {!user && (
                    <div className="warning-message">
                        Please login to create courses
                    </div>
                )}

                <form onSubmit={handleSubmit} className="course-form">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter course title"
                            disabled={!user || isLoading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter course description"
                            rows="4"
                            disabled={!user || isLoading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price *</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter course price"
                            step="0.01"
                            min="0"
                            disabled={!user || isLoading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="parentId">Parent ID (optional)</label>
                        <input
                            type="text"
                            id="parentId"
                            name="parentId"
                            value={formData.parentId}
                            onChange={handleChange}
                            placeholder="Enter parent course ID (optional)"
                            disabled={!user || isLoading}
                        />
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={!user || isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Course'}
                    </button>
                </form>

                {createdCourses.length > 0 && (
                    <div className="created-courses">
                        <h2>Created Courses</h2>
                        <div className="courses-list">
                            {createdCourses.map((course) => (
                                <div key={course.id} className="course-item">
                                    <h3>{course.title}</h3>
                                    <p className="course-description">{course.description}</p>
                                    <div className="course-meta">
                                        <span className="course-price">Price: ${course.price}</span>
                                        <span className="course-id">ID: {course.id}</span>
                                    </div>
                                    {course.parentId && (
                                        <div className="course-parent">
                                            Parent ID: {course.parentId}
                                        </div>
                                    )}
                                    <div className="course-timestamps">
                                        <small>Created: {new Date(course.createdAt).toLocaleString()}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}