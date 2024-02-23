import React, { useState } from 'react';
import './styles/events.css';
import mainbuild from './images/mainbuilding.jpg';
import eblock from './images/e-block.png';
import canteen from './images/f-block_canteen.png';
import bridge from './images/techbridge.png';
import { useNavigate } from 'react-router-dom';
import kriya2 from './images/kriya.jpg';

function Events(){
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

    const Faculty=()=>{
        navigate("/Faculty");
    }

    const handleVisitHereClick = ()=>{
        return "https://kriya.psgtech.ac.in/"
    }
    return (
        <div className='eventbody'>
             <nav className="navbarpsg">
                <ul className="nav-items">
                    <li className="nav-item"><a href="#" onClick={Student}>Find a Faculty</a></li>
                    <li className="nav-item"><a href="#" onClick={Feedback}>Feedback</a></li>
                    <li className="nav-item"><a href="#" onClick={Home}>Home</a></li>
                    <li className="nav-item"><a href="#" onClick={Faculty}>Scheduling</a></li>
                </ul>
            </nav>

            <h1 className='eventstext'>Current Events</h1>

            <div className='eventscard'>
                <div className='card-container3'>
                <img src={kriya2} alt="Main Building" className="cardImage" />
                  <br></br>
                    <h3 className='kriyadesc'>Let your imagination run wild with Kriyative! Whether you're an experienced artist, a hobbyist or a curious beginner, our events will inspire you to think outside the box, experiment with new techniques and express your unique vision.</h3>
                    
                    <a href="https://kriya.psgtech.ac.in/">Visit Link</a>

                </div>
            </div>
        </div>


    );
}

export default Events;