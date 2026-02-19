import "./loginPage.css"
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { joinAsGuestAction } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { loginUser, checkIfUserAlreadyLoggedIn } = useLogin()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await loginUser(email, password);
        } catch (error) {
            setError(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        checkIfUserAlreadyLoggedIn();
    }, [])

    const handleGuestJoin = async () => {
        try {
            const action = await joinAsGuestAction();
            dispatch(action);
            navigate("/home");
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="login-page">
            <Container>
                <div className="d-flex justify-content-center">
                <div className="d-flex flex-column login-div mt-5">
                    <div className="mb-3 login-page-header">LOGIN</div>
                    <Form onSubmit={submitLogin}>
                        <div className="d-flex flex-column ">
                        <Form.Group className="mb-3 d-flex flex-column align-items-start " controlId="formBasicEmail">
                            <Form.Label className="login-label" >Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex flex-column align-items-start" controlId="formBasicPassword">
                            <Form.Label className="login-label">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                        {error && (
                            <div className="login-error mt-3">
                                {error}
                            </div>
                        )}
                        <div className="d-flex justify-content-end mt-3 login-label">Not a member?<a href="/signup" className="ms-2 login-label-signup"> SIGNUP</a></div>
                        </div>
                    </Form>
                    <div className="text-center mt-4">
                        <div className="d-flex align-items-center mb-3">
                            <hr className="flex-grow-1" />
                            <span className="mx-2 text-muted">or</span>
                            <hr className="flex-grow-1" />
                        </div>

                        <button
                            className="btn btn-outline-dark w-100"
                            onClick={() => handleGuestJoin()}
                        >
                            Join as guest
                        </button>
                    </div>
                </div>
                </div>
            </Container>
            
        </div>)
}
export default LoginPage
