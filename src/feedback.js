import React, { useState } from 'react';
import './styles/feedback.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function Feedback() {
    const [selectedOption, setSelectedOption] = useState('');
    const [rating, setRating] = useState('');
    const [feedback, setFeedback] = useState('');
    const [submit2, setSubmit] = useState(false);

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
    };

    const handleSubmit = async () => {
        const data = {
            location: selectedOption,
            rating: rating,
            feedback: feedback,
        };

        try {
            const response = await axios.post('http://localhost:4000/api/feedback', data);
            console.log('Response:', response.data);
            setSelectedOption('');
            setRating('');
            setFeedback('');
            setSubmit(true);
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    let navigate = useNavigate();

    const Student = () => {
        navigate("/Student");
    }

    const Home = () => {
        navigate("/");
    }

    const Events = () => {
        navigate("/events");
    }

    const Faculty = () => {
        navigate("/Faculty");
    }

    return (
        <div className='feedbackback'>
            <nav className="navbarpsg">
                <ul className="nav-items">
                    <li className="nav-item"><a href="#" onClick={Student}>Find a Faculty</a></li>
                    <li className="nav-item"><a href="#" onClick={Events}>Events</a></li>
                    <li className="nav-item"><a href="#" onClick={Home}>Home</a></li>
                    <li className="nav-item"><a href="#" onClick={Faculty}>Scheduling</a></li>
                </ul>
            </nav>

            <h1 className='feedbacktext'>Enter your feedback</h1>

            <div className='feedcard'>
                <div className='feedcardContainer'>
                    <select value={selectedOption} onChange={handleDropdownChange}>
                        <option value="">Select a location</option>
                        <option value="F-Block Canteen">F-Block Canteen</option>
                        <option value="IM Canteen">IM Canteen</option>
                        <option value="A-Block Canteen">A-Block Canteen</option>
                        <option value="E-Block Building">E-Block Building</option>
                        <option value="A-Block Building">A-Block Building</option>
                    </select>
                    <br />
                    <input
                        type="number"
                        value={rating}
                        onChange={handleRatingChange}
                        placeholder="Enter rating /5"
                        min="0"
                        max="5"
                        id='rating'
                    />
                    <br></br>
                    <input
                        type="text"
                        value={feedback}
                        onChange={handleFeedbackChange}
                        placeholder="Enter your feedback"
                    />
                    <br />
                    <button onClick={handleSubmit}>Submit</button>
                    {submit2 && <p>Submitted successfully</p>}
                </div>
            </div>
        </div>
    );
}

export default Feedback;
