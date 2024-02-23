import React, { useState } from 'react';
import axios from 'axios';
import './styles/Faculty.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Faculty = () => {
  const [formData, setFormData] = useState({
    facultyName: '',
    day: '',
    cabin: '',
    email: '',
    schedule: []
  });
  const [isSubmitted, setIsSubmitted] = useState(false); // State variable for submission status

    let navigate = useNavigate();

    const Feedback=() => {
        navigate("/feedback");
    }

    const Home=()=>{
        navigate("/");
    }
    

    const Student=()=>{
        navigate("/Student");
    }

  const handleChange = (e, index) => {
    const { value } = e.target;
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index] = value;
    setFormData({
      ...formData,
      schedule: updatedSchedule
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make POST request using Axios
      const response = await axios.post('http://localhost:4000/api/faculty', formData);
      console.log(response.data); // Assuming response contains faculty data
      setIsSubmitted(true); // Set submission status to true
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='facultybody'>
    
            <nav className="navbarpsg">
                <ul className="nav-items">
                    <li className="nav-item"><a href="#" onClick={Student}>Find a Faculty</a></li>
                    <li className="nav-item"><a href="#" onClick={Feedback}>Feedback</a></li>
                    <li className="nav-item"><a href="#" onClick={Home}>Home</a></li>
                </ul>
            </nav>
            <br></br>
    <div className="form-container">
      <h2>This is for faculty. Please add the information here for your availability for students to navigate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Faculty Name:</label>
          <input 
            type="text" 
            className="form-control"
            name="facultyName" 
            value={formData.facultyName} 
            onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Day:</label>
          <input 
            type="text" 
            className="form-control"
            name="day" 
            value={formData.day} 
            onChange={(e) => setFormData({ ...formData, day: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Cabin:</label>
          <input 
            type="text" 
            className="form-control"
            name="cabin" 
            value={formData.cabin} 
            onChange={(e) => setFormData({ ...formData, cabin: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            className="form-control"
            name="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Schedule:</label>
          {["8:30-9:20", "9:20-10:10", "10:10-11:20", "11:20-12:10", "1:40-2:30", "2:30-3:20", "3:20-4:10"].map((timeSlot, index) => (
            <input 
              key={index}
              type="text" 
              className="form-control"
              placeholder={timeSlot}
              value={formData.schedule[index] || ''} 
              onChange={(e) => handleChange(e, index)} 
              required 
            />
          ))}
        </div>
        <button type="submit" onClick={handleSubmit} className="submit-btn">Submit</button>
      </form>
      {/* Display success message if form is submitted */}
      {isSubmitted && <p>Submitted successfully!</p>}
    </div>
    </div>
  );
};

export default Faculty;