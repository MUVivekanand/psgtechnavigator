import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Student.css'; // Import the CSS file

import { useNavigate } from 'react-router-dom';

const Student = () => {

    let navigate = useNavigate();

    const Feedback=() => {
        navigate("/feedback");
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

  const [formData, setFormData] = useState({
    facultyName: '',
    day: '',
    schedule: ''
  });
  const [cabin, setCabin] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // State variable for submission status
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request using Axios
      const response = await axios.post('http://localhost:4000/api/student', formData);
      console.log(response.data); // Assuming response contains faculty data
      setIsSubmitted(true); // Set submission status to true
      setCabin(response.data.cabin); // Set cabin from response data
      setError('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Error submitting form. Please try again.');
    }
  };

  return (
    <div className='studentbody'>

            <nav className="navbarpsg">
                <ul className="nav-items">
                    <li className="nav-item"><a href="#" onClick={Faculty}>Scheduling</a></li>
                    <li className="nav-item"><a href="#" onClick={Feedback}>Feedback</a></li>
                    <li className="nav-item"><a href="#" onClick={Events}>Events</a></li>
                    
                    <li className="nav-item"><a href="#" onClick={Home}>Home</a></li>
                </ul>
            </nav>
      <br></br>
    <div className="student-form-container">
      <h2>Find Faculty and Navigate:</h2>
      <form onSubmit={handleSubmit}>
        <div className="student-form-group">
          <label>Faculty Name:</label>
          <input 
            type="text" 
            className="student-form-control"
            name="facultyName" 
            value={formData.facultyName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="student-form-group">
          <label>Day:</label>
          <select 
            className="student-form-control"
            name="day" 
            value={formData.day} 
            onChange={handleChange} 
            required 
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
        <div className="student-form-group">
          <label>Schedule:</label>
          <select 
            className="student-form-control"
            name="schedule" 
            value={formData.schedule} 
            onChange={handleChange} 
            required 
          >
            <option value="">Select Schedule</option>
            <option value="8:30-9:20">8:30-9:20</option>
            <option value="9:20-10:10">9:20-10:10</option>
            <option value="10:10-11:20">10:10-11:20</option>
            <option value="11:20-12:10">11:20-12:10</option>
            <option value="1:40-2:30">1:40-2:30</option>
            <option value="2:30-3:20">2:30-3:20</option>
            <option value="3:20-4:10">3:20-4:10</option>
          </select>
        </div>
        <button type="submit" onSubmit={handleSubmit} className="student-submit-btn">Submit</button>
      </form>
      {/* Display success or error message */}
      {isSubmitted && <p className="student-success-message">Form submitted successfully!</p>}
      {error && <p className="student-error-message">{error}</p>}
      {/* Display cabin */}
      {cabin !== 'NIL' ? (
        <p className="student-cabin">Now {formData.facultyName} is at: {cabin}</p>
      ) : (
        <p className="student-cabin">Not scheduled. He/She must be in the cabin.</p>
      )}
    </div>
    </div>
  );
};

export default Student;