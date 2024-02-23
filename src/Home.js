import React, { useState } from 'react';
import './styles/homepsg.css';
import mainbuild from './images/mainbuilding.jpg';
import eblock from './images/e-block.png';
import canteen from './images/f-block_canteen.png';
import bridge from './images/techbridge.png';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [currentImage, setCurrentImage] = useState(0);
    const [showInfo, setShowInfo] = useState(false);
    const [description, setDescription] = useState('');
    const images = [mainbuild, eblock, canteen, bridge]; // Array of images
    const numImages = images.length;

    let navigate = useNavigate();

    const ui = localStorage.getItem('rating')

    const descriptions = [
        "Main Building: PSG College of Technology is an autonomous, government aided, private engineering college in Coimbatore, India.The PSG College of Technology is situated at about 8 km from Coimbatore Railway Station and 5 km from Airport. The campus is spread over 45 acres of land, economically utilized for the College, Hostels, Staff Quarters, Play Fields and Gardens.",
        "E-Block: This 4 floored block is the main block of Computer Science and Engineering department, ECE dept. With almost multiple lab facilities like programming lab,grd lab,cc lab,hardware lab,IT lab.",
        "Canteen: This F-Block Canteen is the main canteen of the campus, with many day scholars getting benefitted.",
        "Tech Bridge: It was constructed for the benefit of students to reach college safely (There were few accidents which lead to life loss). They act as Shelter during Sunny and Rainy Days. It has created many memories for many PSG Tech Students."
    ];

    const Feedback=() => {
        navigate("/feedback");
    }
    
    const Events=()=>{
        navigate("/events");
    }

    const Student=()=>{
        navigate("/Student");
    }

    const Faculty=()=>{
        navigate("/Faculty");
    }

    

    const nextImage = () => {
        let nextIndex;
        switch (currentImage) {
            case 0:
                nextIndex = 1; // Move from mainbuild to eblock
                break;
            case 1:
                nextIndex = 3; // Move from eblock to bridge
                break;
            case 2:
                nextIndex = 2; // canteen should not respond
                break;
            case 3:
                nextIndex = 3; // Move from bridge to mainbuild
                break;
            default:
                nextIndex = 0;
                break;
        }
        setCurrentImage(nextIndex);
        setShowInfo(false); // Hide info box when image changes
    };

    const prevImage = () => {
        let prevIndex;
        switch (currentImage) {
            case 0:
                prevIndex = 0; // Move from mainbuild to bridge
                break;
            case 1:
                prevIndex = 2; // Move from eblock to canteen
                break;
            case 2:
                prevIndex = 0; // Move from canteen to mainbuild
                break;
            case 3:
                prevIndex = 1; // Move from bridge to eblock
                break;
            default:
                prevIndex = 0;
                break;
        }
        setCurrentImage(prevIndex);
        setShowInfo(false); // Hide info box when image changes
    };

    const toggleInfo = () => {
        setShowInfo(!showInfo);
        setDescription(descriptions[currentImage]);
    };

    return (
    
        <div className='bodyhome'>
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
                <br />
                <div className='image-container'>

                    <div className="image-slider">
                        <button className="slide-button left" onClick={prevImage}>&lt;</button>
                        <img src={images[currentImage]} alt="Main Building" className="cardImage" />
                        <button className='image-button' onClick={toggleInfo}>Info</button>
                        <button className="slide-button right" onClick={nextImage}>&gt;</button>
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