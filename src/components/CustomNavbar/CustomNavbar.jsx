import "./customNavbar.css"
import Container from 'react-bootstrap/Container';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getAllRoomsAction, logoutAction } from "../../redux/actions";
import { isUserAlreadyLoggedInAction } from './../../redux/actions/index';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoChevronDown } from "react-icons/io5";

const CustomNavbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const JWTToken = localStorage.getItem("JWTToken")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pathname, setPathname] = useState("")
  const user = useSelector(state => state.profileReducer.data)


  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev)
  }

  const logoutUser = () => {
    localStorage.removeItem("JWTToken");
    dispatch(logoutAction());
    navigate("/", { replace: true });
  }

  useEffect(()=> {
    setPathname(location.pathname)
  }, [location])

  useEffect(() => {
    getAllRoomsAction()
    .then((action) => dispatch(action))
    isUserAlreadyLoggedInAction(user, JWTToken, dispatch)
    .then((boolean) => {
        if(boolean === true) {
            setIsLoggedIn(true)
        } else {
            // navigate("/login")
        }
    })
    .catch(err => console.log(err))
  }, [])

   return  <div className="navbar-div position-relative">
              <Container className="d-flex justify-content-between">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="navbar-left d-flex justify-content-center align-items-center">
                    <a href="/">
                    <div className="navbar-logo d-flex justify-content-center align-items-center">
                      sipeaky
                    </div>
                    </a>
                  </div>

                  
                  </div>
                  <div className="navbar-middle justify-content-center align-items-center">
                    <div className="navbar-item d-flex justify-content-center">
                      <div className={location.pathname=== "/" && "active"}></div>
                      <a href="/" ><div >Home</div></a>
                    </div>
                    <div className="navbar-item d-flex justify-content-center">
                      <div className={location.pathname=== "/rooms" && "active"}></div>
                      <a href="/rooms"> <div >Study Rooms</div></a>
                    </div>
                    <div className="navbar-item d-flex justify-content-center">
                      <div className={location.pathname=== "#" && "active"}></div>
                      <a href="#"><div >Create a room</div></a>
                    </div>
                    <div className="navbar-item d-flex justify-content-center">
                      <div className={location.pathname=== "#" && "active"}></div>
                      <a href="#"><div>About Sipeaky</div></a>
                    </div>
                  
                  </div>
                <div className="d-flex">
                {isLoggedIn ? (
                    <>
                      <div className="navbar-right user-info d-flex justify-content-center align-items-center user-menu-trigger" onClick={toggleUserMenu}>
                        <div className="d-flex justify-content-center align-items-center">{user.username}</div>
                        <div className="user-avatar ms-2 d-flex align-items-center">
                          <img src="/assets/avatar-default.png" alt="avatar" />
                          <IoChevronDown className={`avatar-arrow ${isUserMenuOpen ? "open" : ""}`} />
                        </div>
                        {isUserMenuOpen && (
                          <div className="user-dropdown">
                            <a href="/" className="dropdown-item-mobile" ><div >Home</div></a>
                            <a href="/rooms" className="dropdown-item-mobile"> <div >Chat rooms</div></a>
                            <a href="#" className="dropdown-item-mobile"><div >Create a room</div></a>
                            <a href="#" className="dropdown-item-mobile"><div>About Sipeaky</div></a>
                            <div className="dropdown-divider"></div>
                            <div className="user-dropdown-item" onClick={logoutUser}>
                              Sign out
                            </div>
                          </div>
                        )}
                      </div>
                    </>)
                  : 
                  <a href="/login">
                    <div className="navbar-right d-flex justify-content-center align-items-center">
                      <div className="d-flex justify-content-center align-items-center sign-up-btn">Sign up</div>
                      
                    </div>
                  </a>
                  }
                </div>
            </Container>
            </div>
}
export default CustomNavbar