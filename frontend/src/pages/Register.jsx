import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    // State for form fields
    const [formData, setFormData] = useState({
        FName: '',
        LName: '',
        DOB: '',
        gender: '',
        phone_no: '',
        email: '',
        address: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    // State for form validation errors
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        const newErrors = {};
        if (!formData.FName) newErrors.FName = 'First name is required';
        if (!formData.LName) newErrors.LName = 'Last name is required';
        if (!formData.DOB) newErrors.DOB = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.phone_no) newErrors.phone_no = 'Phone number is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        // Validate password strength
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setApiError(null); // Reset API error if validation fails
        } else {
            setErrors({});
            setApiError(null); // Reset API error before submitting

            // Proceed with form submission logic (e.g., API call)
            try {
                const response = await fetch('http://localhost:3000/api/patient/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Registration failed');
                }

                const data = await response.json();
                console.log(data.message);
                navigate('/'); // Navigate to login on successful registration
            } catch (error) {
                setApiError(error.message);
            }
        }
    };

    return (
        <div className="register-container max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold mb-6 text-center">Register New Patient</h1>

            {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

            <form onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="FName"
                        value={formData.FName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {errors.FName && <p className="text-red-500 text-sm">{errors.FName}</p>}
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="LName"
                        value={formData.LName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {errors.LName && <p className="text-red-500 text-sm">{errors.LName}</p>}
                </div>

                {/* DOB */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        type="date"
                        name="DOB"
                        value={formData.DOB}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {errors.DOB && <p className="text-red-500 text-sm">{errors.DOB}</p>}
                </div>

                {/* Gender */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        name="phone_no"
                        value={formData.phone_no}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {errors.phone_no && <p className="text-red-500 text-sm">{errors.phone_no}</p>}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* Address */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    ></textarea>
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>

                {/* Username */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>

                {/* New Password */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit" class="register-button">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
