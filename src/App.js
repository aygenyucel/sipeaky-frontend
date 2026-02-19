/* eslint-disable no-restricted-globals */
import './App.css';
import "/node_modules/bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SimplePeerRoom from './tests/SimplePeerRoom/SimplePeerRoom';
import PeerJSRoom from './tests/PeerJSRoom/PeerJSRoom';
import ChatRoom from './pages/ChatRoom/ChatRoom';
import SignupPage from './pages/SignupPage/SignupPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RoomsPage from './pages/RoomsPage/RoomsPage';
import CustomNavbar from './components/CustomNavbar/CustomNavbar';
import ChatRoomDesign from './tests/chatRoomDesign/ChatRoomDesign';
import Home from './pages/HomePage/Homepage';
import WelcomePage from './pages/WelcomePage/welcomePage';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/' element= {<WelcomePage/>}/>
          <Route path='/home' element= {<Home/>}/>
          <Route path='/rooms' element= {<RoomsPage/>}/>
          <Route path='/simplePeerRoom/:id' element={<SimplePeerRoom/>}/>
          <Route path='/peerJSRoom' element= {<PeerJSRoom/>}/>
          <Route path='/chatRoom/:id' element={ <ChatRoom key={location.pathname}/>}/>
          <Route path='/signup' element={<SignupPage/>} />
          <Route path='/login' element={<LoginPage/>}/>
          {/* ##### */}
          <Route path='chatRoomDesign' element= {<ChatRoomDesign/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
