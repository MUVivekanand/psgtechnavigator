import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Home from './Home.js';
import Feedback from './feedback.js';
import Events from './events.js';
import Student from './Student.js';
import Faculty from './Faculty.js';

function App(){
    return (

        <BrowserRouter>
        <Routes>
            <Route path ='/' element={<Home/>}/>
            <Route path='/Feedback' element={<Feedback/>}/>
            <Route path='/events' element={<Events/>}/>
            <Route path='/Student' element={<Student/>}/>
            <Route path='/Faculty' element={<Faculty/>}/>

            
        </Routes>
        </BrowserRouter>
    );
}

export default App;
