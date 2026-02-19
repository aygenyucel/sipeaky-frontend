import { Button, Container, Form } from "react-bootstrap"
import "./signupPage.css"
import { useState } from 'react';
import { joinAsGuestAction, signupAndGetTokenAction } from './../../redux/actions/index';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

const LoginPage = (props) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        registerUser()
    }

    const registerUser = () => {
        const newUser = {
            email: email,
            username: username,
            password: password
        }

        signupAndGetTokenAction(newUser)
        .then(() => 
             navigate("/login")
            )
        .catch((error) =>
            console.log(error))
    } 

    const handleGuestJoin = async () => {
        try {
            const action = await joinAsGuestAction();
            dispatch(action);
            navigate("/home");
        } catch (error) {
            console.error(error);
        }
    };

    return <div className="signup-page">
                <Container>
                    <div className="d-flex justify-content-center">

                    <div className="d-flex flex-column signup-div mt-5">
                        <div className="mb-3 signup-page-header">SIGN UP</div>
                        <Form onSubmit={handleSubmit} >
                            <div className="d-flex flex-column ">
                            <Form.Group className="mb-3 d-flex flex-column align-items-start " controlId="formBasicEmail">
                                <Form.Label >Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3 d-flex flex-column align-items-start" controlId="formBasicEmail">
                                <Form.Label>User name</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)}/>
                            </Form.Group>  
                            <Form.Group className="mb-3 d-flex flex-column align-items-start" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="signup-btn">
                                Sign up
                            </Button>
                            <div className="d-flex justify-content-end mt-3">Already a user?<a href="/login" className="ms-2 signup-label-login"> LOGIN</a></div>
                            </div>

                            <div className="text-center mt-4">
                                <div className="d-flex align-items-center mb-3">
                                    <hr className="flex-grow-1" />
                                    <span className="mx-2 text-muted">or</span>
                                    <hr className="flex-grow-1" />
                                </div>
                                <button className="btn btn-outline-dark w-100" onClick={() => handleGuestJoin()}>
                                    Join as guest
                                </button>
                            </div>
                        </Form>
                    </div>
                    </div>
                    
                </Container>
            </div>

} 

export default LoginPage;