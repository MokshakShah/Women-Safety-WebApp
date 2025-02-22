import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './SOSButton.css';

function SOSButton() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);
    const [isToggled, setIsToggled] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        return () => {
            stopRecording();
        };
    }, []);

    const startRecording = async () => {
        try {
            setErrorMessage('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = event => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                stream.getTracks().forEach(track => track.stop());
                sendAudioToBackend(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            setErrorMessage('Error accessing microphone. Please check your microphone permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioToBackend = async (audioBlob) => {
        if (!audioBlob) {
            setErrorMessage("No audio to send!");
            return;
        }

        try {
            setErrorMessage('');
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            const axiosResponse = await axios.post('http://localhost:5000/api/audio-sos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (axiosResponse.status === 201) {
                alert("Audio SOS recorded and sent!");
            } else {
                setErrorMessage(`Failed to send audio SOS. Server responded with status: ${axiosResponse.status}`);
            }
        } catch (error) {
            console.error('Error sending audio:', error);
            setErrorMessage('Failed to send audio SOS. Please check your network connection and try again.');
        }
    };

    const handleSendTextMessage = async () => {
        try {
            setErrorMessage('');

            // Send the SOS message to the backend
            const axiosResponse = await axios.post('http://localhost:5000/api/sos', { text: messageText });

            if (axiosResponse.status === 201) {
                alert("Text SOS sent!");
            } else {
                setErrorMessage(`Failed to send text SOS. Server responded with status: ${axiosResponse.status}`);
            }

        } catch (error) {
            console.error('Failed to send text SOS', error);
            setErrorMessage('Failed to send text SOS. Please check your network connection and try again.');
        }
        setIsTextBoxVisible(false);
    };

    const toggleButton = () => {
        setIsToggled(!isToggled);

        if (!isToggled) {
            // Moving to the right -> Open text box
            stopRecording();
            setIsTextBoxVisible(true);
            setIsRecording(false);
            setAudioUrl(null);
        } else {
            // Moving to the left -> Start recording
            setIsTextBoxVisible(false);
            setMessageText('');
        }
    };

    return (
        <div className="sos-container">
            <div
                className={`toggle-container ${isToggled ? 'toggled' : ''}`}
                onClick={toggleButton}
            >
                <div className="toggle-button"></div>
            </div>

            {!isToggled && !isRecording && (
                <button onClick={startRecording}>Start Recording</button>
            )}

            {isRecording && (
                <button onClick={stopRecording}>Stop Recording</button>
            )}

            {audioUrl && (
                <>
                    <audio src={audioUrl} controls />
                </>
            )}

            {isTextBoxVisible && (
                <div className="text-input-container">
                    <textarea
                        placeholder="Enter your SOS message"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button onClick={handleSendTextMessage}>Send Text SOS</button>
                </div>
            )}

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export default SOSButton;
