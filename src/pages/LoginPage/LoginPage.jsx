/* eslint-disable no-undef */
import "./loginPage.css"
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { joinAsGuestAction } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null);
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const { loginUser, checkIfUserAlreadyLoggedIn } = useLogin()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoadingGuest, setIsLoadingGuest] = useState(false);
    const location = useLocation();
    const successMessage = location.state?.message;

    const submitLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoadingLogin(true);

        try {
            await Promise.all([
                loginUser(username, password),
                delay(800)
            ]);

            navigate("/home");

        } catch (error) {
            setError(error.message || "Login failed");
        } finally {
            setIsLoadingLogin(false);
        }
    };

    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const handleGuestJoin = async () => {
        try {
            setIsLoadingGuest(true);
            await Promise.all([
                joinAsGuestAction().then(action => dispatch(action)),
                delay(800)
            ]);

            navigate("/home");

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingGuest(false);
        }
    };
    
    return (
        <div className="login-page">
            <Container className="d-flex justify-content-center align-items-center h-100">
                <div className="login-div">
                    <div className="login-title">Welcome back</div>
                    {successMessage && (
                        <div className="login-success">
                            {successMessage}
                        </div>
                    )}
                    <Form onSubmit={submitLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label className="login-label">Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="login-label">Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            className="login-btn primary"
                            disabled={isLoadingLogin || isLoadingGuest}
                            >
                            {isLoadingLogin ? "Logging in..." : "Login"}
                        </Button>
                        {error && (
                            <div className="login-error mt-2">
                                {error}
                            </div>
                        )}
                    </Form>

                    <div className="divider">
                        <span>or</span>
                    </div>
                    <Button
                        className="login-btn secondary"
                        onClick={handleGuestJoin}
                        disabled={isLoadingGuest || isLoadingLogin}
                    >
                        {isLoadingGuest ? "Joining..." : "Join as guest"}
                    </Button>
                    <div className="login-footer">
                        Not a member?
                        <Link to="/signup" className="ms-2 login-signup-link">
                            Sign up
                        </Link>
                    </div>
                </div>
            </Container>
        </div>)
}
export default LoginPage
