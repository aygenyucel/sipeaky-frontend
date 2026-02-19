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

    const handleCreateAccount = () => {
        navigate("/signup");
    };
    
    const handleGuestJoin = async () => {
        try {
            const action = await joinAsGuestAction();
            dispatch(action);
            navigate("/home");
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        checkIfUserAlreadyLoggedIn();
    }, [])
    
    return (
        <div className="welcome-page">
            <Container  className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "100vh" }}>
                <h2 className="mb-4">Welcome to Sipeaky</h2>
                <Button variant="outline-dark"
                    className="mb-3 px-4"
                    onClick={() => {handleGuestJoin()}}
                    >
                    Join as a guest
                </Button>

                <Button variant="dark"
                    className="px-4"
                    onClick={() => {handleCreateAccount()}}
                    >
                    Create an account
                </Button>
            </Container>
        </div>)
}
export default WelcomePage
