/* eslint-disable react-hooks/exhaustive-deps */
import "./roomsPage.css";
import { useDispatch } from 'react-redux';
import { isUserAlreadyLoggedInAction} from "../../redux/actions/index.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import CreateCustomRoom from '../../components/CreateCustomRoom/CreateCustomRoom';
import RoomPreview from "../../components/RoomPreview/RoomPreview.jsx";
import SearchRoom from '../../components/SearchRoom/SearchRoom.jsx';
import CustomNavbar from "../../components/CustomNavbar/CustomNavbar";
import { Modal } from 'react-bootstrap';
import { Circles } from "react-loader-spinner";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BE_DEV_URL, {
        transports: ["websocket"]
    });
    
const RoomsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const JWTToken = localStorage.getItem("JWTToken")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    const user = useSelector(state => state.profileReducer.data)
    const rooms = useSelector(state => state.roomsReducer.rooms)
    
    const [skip, setSkip] = useState(0)
    const limit = 4;
    const [pageNumber, setPageNumber] = useState(0)
    const [roomsPaginated, setRoomsPaginated] = useState([])

    const [isKickedModalOpen, setIsKickedModalOpen] = useState(false)
    const [isRoomsLoading, setIsRoomsLoading] = useState(true)
    

    const closeKickedModal = () => {
        if(isKickedModalOpen){
            setIsKickedModalOpen(false);
            navigate("/rooms")
        }
    }

    useEffect(() => {
        socket.on("room-users-updated", ({ roomID, users }) => {
            setRoomsPaginated(prev =>
                prev.map(room =>
                    room._id === roomID
                        ? { ...room, users }
                        : room
                )
            );
        });

        return () => socket.off("room-users-updated");
    }, []);

    useEffect(() => {
        const loadRooms = async () => {
            setIsRoomsLoading(true);
            const skip = pageNumber * limit;
            await getRoomsWithPagination(skip, limit);
            setIsRoomsLoading(false);
        };

        loadRooms();
    }, [pageNumber, limit]);

    useEffect(() => {
        isUserAlreadyLoggedInAction(user, JWTToken, dispatch)
        .then((boolean) => {
            if(boolean === true) {
                setIsLoggedIn(true)
            } else {
                navigate("/login")
            }
        })
        .catch(err => console.log(err))

        getRoomsWithPagination(pageNumber*(skip+3),limit)

        const queryParameters = new URLSearchParams(window.location.search)
        const isKicked = queryParameters.get("isKicked")
        
        //check if user kicked and navigated to rooms page
        if(isKicked) {
            setIsKickedModalOpen(true)
        }
       
    }, [])

    function getRoomsWithPagination (skip, limit) { return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms?skip=${skip}&limit=${limit}`)
                if(response.ok) {
                    const data = await response.json();
                    setRoomsPaginated(data)
                   resolve(data)
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        
    }) }
    const [totalPages, setTotalPages] = useState(Math.ceil(rooms.length/limit))

    const changePage = (e) => {
        const newPage = Number(e.currentTarget.getAttribute("value"));
        setPageNumber(newPage);
    };

    const PAGE_WINDOW = 3;
    const totalPagesArray = (() => {
    const start = Math.max(0, pageNumber - Math.floor(PAGE_WINDOW / 2));
    const end = Math.min(totalPages, start + PAGE_WINDOW);
        return [...Array(totalPages).keys()].slice(start, end);
    })();


    return  isLoggedIn && 
            <div className="position-relative d-flex flex-column justify-content-center align-items-center">
            <CustomNavbar/> 

            <div className=" roomspage d-flex flex-column  justify-content-center align-items-center">
                {isKickedModalOpen && 
                <div
                className="modal show kicked-modal d-flex flex-column justify-content-center align-items-center"
                style={{ display: 'block', position: 'absolute' }}
                >
                <Modal.Dialog className="modal-dialog">
                    <Modal.Header closeButton onClick={closeKickedModal}>
                    </Modal.Header>

                    <Modal.Body>
                    <p>Ouch! You kicked out of the meeting</p>
                    </Modal.Body>
                </Modal.Dialog>
            </div>}
                
                <div className="create-room-div">
                    <CreateCustomRoom/>
                </div>
                <div className="roomspage-main d-flex flex-column justify-content-center align-items-center">
                        <div className="create-room-div">
                            <div className="search-room-div">
                                <SearchRoom/>
                            </div>
                        </div>
                        <div className="rooms-list d-flex flex-column justify-content-center align-items-center" >
                            {/* <SearchRoom/> */}
                            <div className="d-flex justify-content-center flex-wrap">
                        {isRoomsLoading ?
                         <div className="d-flex flex-column justify-content-center align-items-center">
                         <Circles
                             type="Spinner Type"
                             visible={isRoomsLoading}
                             color="#000000"
                             width={"50px"}
                         />
                     </div> 
                        :
                                 <> 
                                {roomsPaginated?.map((room) => 
                                    <div key={room._id} className="m-2"> 
                                        <RoomPreview roomData= {room} />
                                    </div>)
                                } 
                                </>
                        }
                        </div>
                        </div>
                        
                        <div className="rooms-pages">
                            {totalPagesArray.map((i) => (
                                <div
                                key={i}
                                onClick={changePage}
                                value={i}
                                className={`page-number ${pageNumber === i ? "page-number-active" : "page-not-active"}`}
                                >
                                {i + 1}
                                </div>
                            ))}
                        </div>
                </div>
            </div>
            </div>
}

export default RoomsPage;