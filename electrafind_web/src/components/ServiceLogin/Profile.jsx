import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        address: '',
        phoneNumber: '',
        userType: '',
        imageUrl: '',
    });

    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Fetch profile data
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        name: data.Name,
                        email: data.Email,
                        address: data.Address,
                        phoneNumber: data.PhoneNumber,
                        userType: data.UserType,
                        imageUrl: data.ImageUrl,
                    });
                } else {
                    alert('Failed to fetch profile data.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                alert('An error occurred while fetching the profile.');
            }
        };

        fetchData();
    }, []);

    const handleEditToggle = () => setEditing(!editing);

    const validate = () => {
        const newErrors = {};
        if (!profileData.name) newErrors.name = 'Name is required';
        if (!profileData.email) newErrors.email = 'Email is required';
        if (!profileData.address) newErrors.address = 'Address is required';
        if (!profileData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^0\d{9}$/.test(profileData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits and start with 0';
        }
        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            try {
                setUploading(true);

                let updatedImageUrl = profileData.imageUrl;

                // Upload image if a new one is selected
                if (imageFile) {
                    const formDataObj = new FormData();
                    formDataObj.append('file', imageFile);

                    const imageResponse = await fetch('http://localhost:3000/api/upload/image', {
                        method: 'POST',
                        body: formDataObj,
                    });

                    if (!imageResponse.ok) {
                        throw new Error('Image upload failed');
                    }

                    const imageUploadData = await imageResponse.json();
                    updatedImageUrl = imageUploadData.url;
                }

                // Update profile data
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/users/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        Name: profileData.name,
                        Email: profileData.email,
                        Address: profileData.address,
                        PhoneNumber: profileData.phoneNumber,
                        UserType: profileData.userType,
                        ImageUrl: updatedImageUrl,
                    }),
                });

                if (response.ok) {
                    alert('Profile updated successfully');
                    setEditing(false);
                    setProfileData((prev) => ({ ...prev, imageUrl: updatedImageUrl }));
                } else {
                    alert('Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('An error occurred while updating the profile.');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        window.location.reload();
        alert('Signed out successfully');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/users/profile', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('Profile deleted successfully');
                localStorage.removeItem('token');
                window.location.reload();
            } else {
                alert('Failed to delete profile');
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
            alert('An error occurred while deleting the profile.');
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-view">
                <h2>Profile</h2>
                <div className="profile-image">
                    <img src={profileData.imageUrl} alt="Profile" />
                </div>
                <div className="profile-details">
                    {['name', 'email', 'address', 'phoneNumber', 'userType'].map((field) => (
                        <div key={field} className="profile-field">
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                            {editing ? (
                                field === 'userType' ? (
                                    <select
                                        name={field}
                                        value={profileData[field]}
                                        onChange={handleChange}
                                    >
                                        <option value="Garage">Garage</option>
                                        <option value="Mechanics">Mechanics</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name={field}
                                        value={profileData[field]}
                                        onChange={handleChange}
                                    />
                                )
                            ) : (
                                <span>{profileData[field]}</span>
                            )}
                        </div>
                    ))}
                    {editing && (
                        <div className="profile-field">
                            <label>Upload New Image:</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                    )}
                    {Object.keys(errors).length > 0 && (
                        <div className="error-messages">
                            {Object.values(errors).map((err, idx) => (
                                <p key={idx} className="error-message">
                                    {err}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
                <div className="profile-actions">
                    {editing ? (
                        <>
                            <button className="btn" onClick={handleSave} disabled={uploading}>
                                {uploading ? 'Saving...' : 'Save'}
                            </button>
                            <button className="btn" onClick={handleEditToggle}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn" onClick={handleEditToggle}>
                                Edit
                            </button>
                            <button className="btn delete-btn" onClick={handleDeleteProfile}>
                                Delete Profile
                            </button>
                        </>
                    )}
                    <button className="btn signout-btn" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
