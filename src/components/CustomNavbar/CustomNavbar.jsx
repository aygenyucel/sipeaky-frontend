import "./customNavbar.css"
import Container from 'react-bootstrap/Container';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getAllRoomsAction, logoutAction } from "../../redux/actions";
import { isUserAlreadyLoggedInAction } from './../../redux/actions/index';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GiHamburgerMenu } from "react-icons/gi";

const CustomNavbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const JWTToken = localStorage.getItem("JWTToken")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pathname, setPathname] = useState("")
  const [isActive, setIsActive] = useState(true)
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
    // dispatch(resetPeersStateAction());
    // dispatch(resetRoomsStateAction());
    getAllRoomsAction()
    .then((action) => dispatch(action))
    // console.log("user", user, "jwt: ", JWTToken)
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

  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const toggleNavbar = () => {
    if(isNavbarOpen) {
      setIsNavbarOpen(false)
    } else {
      setIsNavbarOpen(true)
    }
  }

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
                      <a href="/rooms"> <div >Study Halls</div></a>
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
                      <div className="navbar-right user-info d-flex justify-content-center align-items-center">
                        <div className="d-flex justify-content-center align-items-center">{user.username}</div>
                        <div onClick={toggleUserMenu} style={{ cursor: "pointer" }} className="user-avatar ms-3 d-flex justify-content-center align-items-center">
                          <img src="/assets/avatar-default.png" alt="avatar-default" />
                          {isUserMenuOpen && (
                            <div className="user-dropdown">
                              <div className="user-dropdown-item"  onClick={() => logoutUser()}>
                                Sign out
                              </div>
                            </div>
                          )}
                          </div>
                      </div>
                    </>)
                  : 
                  <a href="/login">
                    <div className="navbar-right d-flex justify-content-center align-items-center">
                      <div className="d-flex justify-content-center align-items-center sign-up-btn">Sign up</div>
                      
                    </div>
                  </a>
                  }
                  <div className='navbar-burger position-relative' onClick={toggleNavbar}>
                        <GiHamburgerMenu className="navbar-burger-icon"/>

                        {isNavbarOpen ? <div className="navbar-toggle justify-content-center align-items-center">
                          <div className="navbar-item d-flex justify-content-center">
                            <a href="/" ><div >Home</div></a>
                          </div>
                          <div className="navbar-item d-flex justify-content-center">
                            <a href="/rooms"> <div >Chat rooms</div></a>
                          </div>
                          <div className="navbar-item d-flex justify-content-center">
                            <a href="#"><div >Create a room</div></a>
                          </div>
                          <div className="navbar-item d-flex justify-content-center">
                            <a href="#"><div>About Sipeaky</div></a>
                          </div>
                      </div> : <></>}
                  </div>
                </div>
            </Container>
            </div>
}
export default CustomNavbar