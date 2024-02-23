import React, { useState } from 'react';
import './styles/feedback.css';
import { useNavigate } from 'react-router-dom';

function Feedback() {
    const [selectedOption, setSelectedOption] = useState('');
    const [rating, setRating] = useState('');

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };



    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };
    // Add another state variable for feedback
        const [feedback, setFeedback] = useState('');

        // Handler function to update feedback state
        const handleFeedbackChange = (event) => {
            setFeedback(event.target.value);
        };

        // Handler function for form submission
        const handleSubmit = () => {
            // Logic to handle form submission (e.g., sending feedback to server)
            // You can use the selectedOption, rating, and feedback state variables here
            console.log('Location:', selectedOption);
            console.log('Rating:', rating);
            console.log('Feedback:', feedback);

            // Reset the form after submission if needed
            setSelectedOption('');
            setRating('');
            setFeedback('');
        };

        let navigate = useNavigate();

        const Student=() => {
            navigate("/Student");
        }
    
        const Home=()=>{
            navigate("/");
        }
        
        const Events=()=>{
            navigate("/events");
        }
    
        const Faculty=()=>{
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
                        min="0" // Set the minimum value to 0
                        max="5"
                        id='rating'
                    />
                    <br></br>
                    <input
                        type="text"
                        placeholder="Enter your feedback"
                        // You need to define a handler to set the feedback state
                    />
                    <br />
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default Feedback;

