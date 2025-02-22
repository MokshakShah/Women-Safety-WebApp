import React, { useState } from 'react';
import axios from 'axios';

function PhotoUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage("Please select a photo first.");
            return;
        }

        const formData = new FormData();
        formData.append('photo', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/upload-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.status === 201) {
                setUploadMessage("Photo uploaded successfully!");
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            setUploadMessage("Error uploading photo. Please try again.");
        }
    };

    return (
        <div className="photo-upload-container">
            <h2>Upload Car Photo</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Photo</button>
            {uploadMessage && <p>{uploadMessage}</p>}
        </div>
    );
}

export default PhotoUpload;
