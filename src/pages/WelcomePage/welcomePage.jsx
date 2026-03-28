import "./welcomePage.css"
import { Button, Container } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinAsGuestAction } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useLogin } from "../../hooks/useLogin";

const WelcomePage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {checkIfUserAlreadyLoggedIn} = useLogin();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateAccount = () => {
        navigate("/signup");
    };
    
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const handleGuestJoin = async () => {
        try {
            setIsLoading(true);
            await Promise.all([
                joinAsGuestAction().then(action => dispatch(action)),
                delay(800)
            ]);
            navigate("/home");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        checkIfUserAlreadyLoggedIn();
    }, [])
    
    return (
        <div className="welcome-page d-flex flex-column justify-content-center align-items-center text-center">
                <img
                    src="/assets/welcome-page-card.png"
                    alt="language speaking"
                    className="welcome-image mb-4"
                />

                <Button
                    className="mb-3 px-4 welcome-btn primary"
                    onClick={handleGuestJoin}
                    disabled={isLoading}
                >
                    {isLoading ? "Joining..." : "Join as guest"}
                </Button>

                <Button
                    className="px-4 welcome-btn secondary"
                    onClick={handleCreateAccount}
                >
                    Create an account
                </Button>   
        </div>)
}
export default WelcomePage
