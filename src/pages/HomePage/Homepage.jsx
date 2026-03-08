import { Button, Container } from "react-bootstrap";
import "./HomePage.css";
import { useEffect, useState } from "react";
import Typical from 'react-typical'
import CustomNavbar from './../../components/CustomNavbar/CustomNavbar';

const Home = () => {

    const [languages, setLanguages] = useState([
        "English",4000,
        "Spanish",4000,
        "French",4000,
        "German",4000,
        "Italian",4000,
        "Portuguese",4000,
        "Turkish",4000
    ]);
    
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
        const timer = () => {
            const randomIndex = Math.floor(Math.random() * languages.length);
            setIndex(randomIndex)
          };
          setInterval(timer, 8000);
          
          //cleanup function in order clear the interval timer
          //when the component unmounts
          return () => { clearInterval(timer); }
          
    }, [])
    
    return   <>
        <CustomNavbar/>
        <div className="homepage d-flex flex-column"> 
                <div className="homepage-div">
                    <Container>
                        <div className="main-container d-flex ">
                            
                            <div className="top-area col-6 d-flex flex-column justify-content-center main-left">
                                <div className="d-flex flex-column align-items-center">
                                    <div className="d-flex flex-column align-items-center">
                                        <div className="main-header">Find Your</div>
                                        <Typical
                                            steps={languages}
                                            loop={Infinity}
                                            wrapper="span"
                                            className="main-header-language"
                                        />
                                        <div className="main-header">Study Space.</div>
                                    </div>
                                    <div className="subtitle">
                                        Speak when you're ready.
                                    </div>
                                </div>
                                
                            </div>
                            <div className="col-6  main-right d-flex justify-content-start aling-items-end">
                                <img className="home-img img-group-calling" src="/assets/group_video.svg" alt="group-calling" />
                            </div>
                        </div>
                    </Container>
                </div>
                <div>
                    <Container>
                        <div className="d-flex justify-content-center btn-div">
                            <div className="btn-div-left ">
                                <img className="arrow-svg" src="/assets/undraw_fun-arrow.svg" alt="arrow-svg" />
                                <Button className="main-btn get-started-btn" href="/rooms">
                                    Get started
                                </Button>
                            </div>
                            <div>
                                <Button className="main-btn learn-more-btn">
                                    Learn more
                                </Button>
                            </div>
                        </div>
                    </Container>
                </div>
                <div className="homepage-div homepage-div-bottom">
                    <Container>
                        <div className="d-flex">
                            <div className="col-6 bottom-img-div d-flex justify-content-center">
                                <img className="home-img bottom-img" src="/assets/world.svg" alt="around-the-world" />
                            </div>
                            <div className="bottom-area col-6 d-flex flex-column justify-content-center  bottom-header">
                                <div className="d-flex  bottom-header-2">
                                    A simple place to study languages.
                                </div>

                                <div className="d-flex bottom-header-4 justify-content-end mb-3">
                                    Anytime, anywhere.
                                </div>
                            <div className="d-flex  bottom-header-2">
                                <a href="/rooms">
                                <Button className="discover-btn">DISCOVER</Button>
                                </a>
                            
                            </div>
                            </div>

                        </div>
                    </Container>
                </div>
            </div>
        </>
}

export default Home;