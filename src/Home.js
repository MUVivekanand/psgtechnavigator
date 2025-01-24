import React, { useState, useEffect } from 'react';
import './styles/homepsg.css';
import mainbuild from './images/mainbuilding.jpg';
import eblock from './images/e-block.png';
import canteen from './images/f-block_canteen.png';
import bridge from './images/techbridge.png';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function Home() {
    const [currentLocation, setCurrentLocation] = useState('Main Building');
    const [showInfo, setShowInfo] = useState(false);
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState('');
    const [navigationDirections, setNavigationDirections] = useState([]);
    const [navigationStarted, setNavigationStarted] = useState(false);

    const [chatInput, setChatInput] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(false);

    const handleChatSubmit = async () => {
        if (!chatInput.trim()) return;
    
        setIsLoading(true);
        setChatResponse(''); 
        try {
            const response = await axios.post('http://localhost:8502/chat', { query: chatInput });
            setChatResponse(response.data.response.trim()); 
        } catch (error) {
            console.error('Error fetching chatbot response:', error);
            setChatResponse('Error fetching response. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChatbot = () => {
        setIsChatVisible(!isChatVisible);
    };


    const [selectedDestination, setSelectedDestination] = useState('');
    const locations = ['Main Building', 'E-Block Building', 'Canteen', 'Bridge'];
    const images = {
        'Main Building': mainbuild,
        'E-Block Building': eblock,
        'Canteen': canteen,
        'Bridge': bridge
    };

    let navigate = useNavigate();

    const graph = {
        'Main Building': { left: null, right: 'E-Block Building' },
        'E-Block Building': { left: 'Canteen', right: 'Bridge' },
        'Canteen': { left: 'Main Building', right: null },
        'Bridge': { left: 'E-Block Building', right: null }
    };

    const descriptions = {
        'Main Building': "Main Building: PSG College of Technology is an autonomous, government aided, private engineering college in Coimbatore, India...",
        'E-Block Building': "E-Block: This 4 floored block is the main block of Computer Science and Engineering department, ECE dept...",
        'Canteen': "Canteen: This F-Block Canteen is the main canteen of the campus, with many day scholars getting benefitted...",
        'Bridge': "Tech Bridge: It was constructed for the benefit of students to reach college safely (There were few accidents which lead to life loss)...",
    };

    useEffect(() => {
        if (showInfo && currentLocation === 'Canteen') {
            fetchRating();
        }
    }, [showInfo, currentLocation]);

    const fetchRating = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/rating', { canteen: 'F-Block Canteen' });
            setRating(response.data.rating);
        } catch (error) {
            console.error('Error fetching rating:', error);
        }
    };

    const Feedback = () => {
        navigate("/feedback");
    }

    const Events = () => {
        navigate("/events");
    }

    const Student = () => {
        navigate("/Student");
    }

    const Faculty = () => {
        navigate("/Faculty");
    }

    const navigateLocation = (location) => {
        setCurrentLocation(location);
        setShowInfo(false);
    };

    useEffect(() => {
        if (currentLocation === selectedDestination) {
            setTimeout(() => {
                alert(`Successfully reached ${selectedDestination}!`);
            }, 100); // Adjust delay as needed
        }
    }, [currentLocation, selectedDestination]);

    useEffect(() => {
        if (currentLocation === selectedDestination) {
            setTimeout(() => {
                setCurrentLocation('Main Building'); // Reset to Main Building
                setNavigationStarted(false); // Reset navigation state
            }, 100); // Adjust delay as needed
        }
    }, [currentLocation, selectedDestination]);
    

    const handleStartNavigation = () => {
        let current = currentLocation;
        let directions = [];

        setNavigationStarted(true);
    
        while (current !== selectedDestination) {
            const { left, right } = graph[current];
    
            if (right === selectedDestination) {
                directions.push(`Turn right from ${current} to reach ${selectedDestination}`);
                break; // Break the loop once the destination is found
            } else if (left === selectedDestination) {
                directions.push(`Turn left from ${current} to reach ${selectedDestination}`);
                break; // Break the loop once the destination is found
            } else if (right) {
                directions.push(`Turn right from ${current} to ${right}`);
                current = right;
            } else if (left) {
                directions.push(`Turn left from ${current} to ${left}`);
                current = left;
            }
        }
    
        setNavigationDirections(directions); // Update the state with the directions
    
    };
    
    

    const navigateLeft = () => {
        const { left } = graph[currentLocation];
        if (left) {
            setCurrentLocation(left);
            setShowInfo(false);
        }
    };

    const navigateRight = () => {
        const { right } = graph[currentLocation];
        if (right) {
            setCurrentLocation(right);
            setShowInfo(false);
        }
    };

    const toggleInfo = () => {
        setShowInfo(!showInfo);
        setDescription(descriptions[currentLocation]);
    };

    return (
        <div className='bodyhome'>

            <div className="chatbot-trigger">
                <button onClick={toggleChatbot}>
                    {isChatVisible ? 'Close Chatbot' : 'Open Chatbot'}
                </button>
            </div>

            {/* Chatbot Container */}
            {isChatVisible && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h3>PSG Tech Navigator</h3>
                        <button onClick={toggleChatbot}>×</button>
                    </div>
                    
                    <div className="chatbot-messages">
                        {chatResponse && (
                            <div className="message bot-message">
                                {chatResponse}
                            </div>
                        )}
                    </div>
                    
                    <div className="chatbot-input-area">
                        <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask your campus-related query..."
                            rows={3}
                            className="chatbot-input"
                        ></textarea>
                        <button 
                            onClick={handleChatSubmit} 
                            disabled={isLoading}
                            className="chatbot-submit"
                        >
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
            <nav className="navbarpsg">
                <ul className="nav-items">
                    <li className="nav-item"><a href="#" onClick={Student}>Find a Faculty</a></li>
                    <li className="nav-item"><a href="#" onClick={Feedback}>Feedback</a></li>
                    <li className="nav-item"><a href="#" onClick={Events}>Events</a></li>
                    <li className="nav-item"><a href="#" onClick={Faculty}>Scheduling</a></li>
                </ul>
            </nav>



            <div className="card">
                <h1 className='guidefont'>Welcome to PSG Tech Campus Guide</h1>

                <div className='startnav'>
                    <h2 className='startnav'>Start Navigation</h2>
                    <select value={currentLocation} onChange={(e) => navigateLocation(e.target.value)}>
                        {locations.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                </div>

                <div className='toDestination'>
                    <h2 className='startnav'>To Destination</h2>
                    <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)}>
                        {locations.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                    <button onClick={handleStartNavigation} disabled={navigationStarted}>Start Navigation</button>
                </div>

                <br></br>

                <div className='cardnav'>
                    {navigationDirections.map((direction, index) => (
                        <p key={index}>{direction}</p>
                    ))}
                </div>

                <br></br>
                <div className='image-container'>
                    <div className="image-slider">
                        <button className="slide-button left" onClick={navigateLeft}>&lt;</button>
                        <img src={images[currentLocation]} alt={currentLocation} className="cardImage" />
                        {showInfo && currentLocation === 'Canteen' && <p>Rating: {rating}</p>}
                        <button className='image-button' onClick={toggleInfo}>Info</button>
                        <button className="slide-button right" onClick={navigateRight}>&gt;</button>
                    </div>
                    {showInfo && (
                        <div className="info-container">
                            <p>{description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;

