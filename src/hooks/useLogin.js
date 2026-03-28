import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isUserAlreadyLoggedInAction, loginAndGetTokenAction } from "../redux/actions";

export const useLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const JWTToken = localStorage.getItem("JWTToken")
    const userData = useSelector(state => state.profileReducer.data);   

    const loginUser = async (username, password) => {
        try {
            const user = { username, password };
            const { setUserProfileAction, setUserProfileIDAction } = await loginAndGetTokenAction(user);
            dispatch(setUserProfileAction);
            dispatch(setUserProfileIDAction);
        } catch (error) {
            console.log(error);
            throw error; 
        }
    }

    const checkIfUserAlreadyLoggedIn = async () => {
        const isLoggedIn = await isUserAlreadyLoggedInAction(userData, JWTToken, dispatch)
        if(isLoggedIn) navigate("/home", {replace: true})
    }

    return {
        loginUser,
        checkIfUserAlreadyLoggedIn
    }
}