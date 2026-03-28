import { Button, Container, Form } from "react-bootstrap"
import "./signupPage.css"
import { useState } from 'react';
import { joinAsGuestAction, signupAndGetTokenAction } from './../../redux/actions/index';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

const LoginPage = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoadingSignup, setIsLoadingSignup] = useState(false);
    const [isLoadingGuest, setIsLoadingGuest] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        registerUser()
    }

    const registerUser = async () => {
        if (!username || !password) {
            setError("Username and password are required!");
            return;
        }

        const newUser = { username, password };
        try {
            setIsLoadingSignup(true);
            setError(null);

            await Promise.all([
                signupAndGetTokenAction(newUser),
                delay(800)
            ]);

            navigate("/login", {
                state: { message: "Account created successfully. Please log in." }
            });

        } catch (error) {
            setError(error?.message || "Something went wrong");
        } finally {
            setIsLoadingSignup(false);
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

    return  <div className="signup-page">
                <Container className="d-flex justify-content-center align-items-center h-100">
                    <div className="signup-div">
                        <div className="signup-title">Create account</div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="signup-label">Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="signup-label">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                className="signup-btn primary"
                                disabled={isLoadingSignup || isLoadingGuest}
                                >
                                {isLoadingSignup ? "Signing up..." : "Sign up"}
                            </Button>
                            {error && (
                                <div className="signup-error mt-2">
                                    {error}
                                </div>
                            )}
                        </Form>
                        <div className="divider">
                            <span>or</span>
                        </div>
                        <Button
                            className="signup-btn secondary"
                            onClick={handleGuestJoin}
                            disabled={isLoadingGuest || isLoadingSignup}
                        >
                            {isLoadingGuest ? "Joining..." : "Join as guest"}
                        </Button>
                        <div className="signup-footer">
                            Already a user?
                            <Link to="/login" className="signup-link ms-2">
                                Login
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
} 

export default LoginPage;