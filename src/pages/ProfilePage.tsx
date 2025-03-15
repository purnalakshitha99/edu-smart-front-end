import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    role: string;
    profile_picture?: string | null;
    // Add any other fields from your user object
}

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate(); // Corrected useNavigate import

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userid');

        if (!token || !userId) {
            // Redirect to login if no token or user ID
            navigate('/login');
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/auth/user/${userId}`, { // Replace with your Flask API URL
                    headers: {
                        Authorization: `Bearer ${token}`, // Include JWT token in the header
                    },
                });

                if (response.status === 200) {
                    setUserProfile(response.data);
                } else {
                    console.error("Failed to fetch user profile:", response.data.message);
                    // Handle error (e.g., redirect to an error page)
                }
            } catch (error: any) {
                console.error("Error fetching user profile:", error);
                // Handle error (e.g., display an error message to the user)
            }
        };

        fetchUserProfile();
    }, [navigate]);

    if (!userProfile) {
        return <div>Loading profile...</div>; // Or a loading spinner
    }

    return (
        <>
        <Navbar/>
        <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-md min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
            {userProfile.profile_picture && (
                <img
                    src={userProfile.profile_picture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mb-4"
                />
            )}
            <p><strong>Username:</strong> {userProfile.username}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Role:</strong> {userProfile.role}</p>
            {/* Display other user information as needed */}
        </div>
        <Footer/>
        </>
     
    );
};

export default ProfilePage;