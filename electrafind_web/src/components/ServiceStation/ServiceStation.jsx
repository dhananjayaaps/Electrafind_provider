import React, { useState } from 'react';
import './ServiceStation.css';

const ServiceStation = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phoneNumber: '',
        userType: 'garage', // Default value for UserType
        imageUrl: '', // Image URL received from the API
    });

    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null); // Image file to upload
    const [uploading, setUploading] = useState(false); // Uploading state

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits and start with 0';
        }
        if (!imageFile) {
            newErrors.imageFile = 'Image is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            try {
                setUploading(true);

                // Upload image to the API
                const formDataObj = new FormData();
                formDataObj.append('file', imageFile);

                const response = await fetch('http://localhost:3000/api/upload/image', {
                    method: 'POST',
                    body: formDataObj,
                });

                console.log('Response Status:', response.status);
                if (!response.ok) {
                    throw new Error('Image upload failed');
                }

                console.log('Image upload response:', response);

                if (!response.ok) {
                    throw new Error('Image upload failed');
                }
              
                const imageUploadData = await response.json();
                const uploadedImageUrl = imageUploadData.url;

                // Prepare final form data
                const finalFormData = {
                    UserType: formData.userType,
                    Name: formData.name,
                    Email: formData.email,
                    Password: formData.password,
                    PhoneNumber: formData.phoneNumber,
                    Address: formData.address,
                    ImageUrl: uploadedImageUrl,
                };

                console.log('Final Form Data:', finalFormData);

                // Example registration API call
                const user = await fetch('http://localhost:3000/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalFormData),
                });

                alert('Service Station Registered Successfully', user);
            } catch (error) {
                console.error('Error during registration:', error);
                alert('Error during registration');
            } finally {
                setUploading(false);
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

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    return (
        <div className="service-container">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>Service Station Registration Form</h2>
                    <div className="input-box">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                    </div>

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

                    <div className="input-box">
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Re-enter Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                    </div>

                    <div className="input-box">
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        {errors.address && <p className="error-message">{errors.address}</p>}
                    </div>

                    <div className="input-box">
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                        {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
                    </div>

                    <div className="input-box">
                        <label htmlFor="userType">Service Type:</label>
                        <select
                            id="userType"
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            required
                        >
                            <option value="Garage">Garage</option>
                            <option value="Mechanics">Mechanics</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <input
                            type="file"
                            id="imageFile"
                            name="imageFile"
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                        />
                        {errors.imageFile && <p className="error-message">{errors.imageFile}</p>}
                    </div>

                    {/* make a link for the login page if is a already user */}
                    <a href="/servicestations/login">Already a user? Login here<br/><br/></a>

                    <button type="submit" className="btn" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Submit'}
                    </button>
                </form>
            </div>
            <div className="service-benefit">
                <h1>Provide Your EV Services with ElectraFind</h1>
                <p>Join ElectraFind and offer your EV services to a growing community of electric vehicle drivers. As a service station owner, you can increase your visibility and customer base by being featured on our app, while helping to expand the EV charging network across Sri Lanka. By partnering with us, you contribute to a greener future and attract more customers to your location.</p>
                <p1>View currently available service stations below.</p1>
            </div>
        </div>
    );
};

export default ServiceStation;
