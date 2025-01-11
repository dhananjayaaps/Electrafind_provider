import React, { useState, useEffect } from 'react';
import './ServiceStation.css';
import Profile from './Profile';

const ServiceStationLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Loading state for the sign-in
    const [profile, setProfile] = useState(null); // To store user profile
    const [editingProfile, setEditingProfile] = useState(false); // Toggle edit mode

    // Validation for sign-in
    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        return newErrors;
    };

    // Fetch user profile if token is available
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchProfile = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/users/profile', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const profileData = await response.json();
                        setProfile(profileData);
                    } else {
                        console.error('Failed to fetch profile');
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            };

            fetchProfile();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            try {
                setLoading(true);

                const response = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Email: formData.email,
                        Password: formData.password,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);

                const profileResponse = await fetch('http://localhost:3000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                    },
                });

                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setProfile(profileData);
                }

                // alert('Login Successful');
            } catch (error) {
                console.error('Error during login:', error);
                alert('Error during login');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    return (
        <div className="service-container">
            {!profile ? (
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <h2>Sign In</h2>

                        <div className="input-box">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>

                        <div className="input-box">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>

                        <a href="/servicestations">Don't Have a account? Register here<br/><br/></a>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            ) : (
                <Profile />
            )}
        </div>
    );
};

export default ServiceStationLogin;
