/* eslint-disable react-hooks/exhaustive-deps */
import './chatRoom.css';
import {  Container, Row, Col } from "react-bootstrap"
import { useReducer, useRef, useState } from 'react';
import { useEffect } from 'react';
import Peer from "peerjs";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer.jsx';
import peersReducer from '../../redux/reducers/peersReducer';
import { addPeerAction, getIsKickedAction, updateCameraState, updateRoomUsersAction } from '../../redux/actions';
import { removePeerAction } from '../../redux/actions';
import { useLocation } from 'react-router-dom';
import {AiOutlineAudio, AiOutlineAudioMuted, AiFillCopy} from 'react-icons/ai'
import {MdOutlineCallEnd} from 'react-icons/md'
import {BsCameraVideoOff, BsCameraVideo, BsFillChatLeftDotsFill} from 'react-icons/bs'
import {FiSettings} from 'react-icons/fi'
import {RxPinLeft} from 'react-icons/rx'
import {BiLeftArrow, BiRightArrow} from 'react-icons/bi'

import {GiHamburgerMenu} from 'react-icons/gi'

import {VscMute, VscUnmute} from 'react-icons/vsc'
import { useSelector } from 'react-redux';
import { isUserAlreadyLoggedInAction } from './../../redux/actions/index';
import { useNavigate } from 'react-router-dom';
import {HiHome, HiVideoCamera, HiPlus} from 'react-icons/hi'
import {FaUserFriends} from 'react-icons/fa'
import {MdSettings} from 'react-icons/md'
import { Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io(process.env.REACT_APP_BE_DEV_URL, {transports:["websocket"]})

const ChatRoom = (props) => {
    const params = useParams()
    // const userData = useSelector(state => state.profileReducer.data)
    // const userID = useSelector(state => state.profileReducer.data._id)
    const roomEndpoint = params.id;
    const [myPeerId, setMyPeerId] = useState(null)
    const myVideoRef = useRef({});

    const [roomData, setRoomData] = useState({});
    const roomCapacity = roomData.capacity
    const [roomCreatorUsername, setRoomCreatorUsername] = useState("")
    const navigate = useNavigate();


    // const userData = state.user;
    const userData = useSelector(state => state.profileReducer.data)


    const onlineChatUsers = useSelector(state => state.onlineChatUsersReducer.data)

    // const roomID = state.roomID;
    const [roomID, setRoomID] = useState("")


    const userID = userData?._id;
    const userName = userData?.username
    const JWTToken = localStorage.getItem("JWTToken")
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    //accessing the peersReducer
    const [currentPeersReducer, dispatch] = useReducer(peersReducer, {})
    const peers = currentPeersReducer?.peers?.filter(peer => peer.roomEndpoint === roomEndpoint)
    const usersFiltered = currentPeersReducer?.users?.filter(user => user.roomEndpoint === roomEndpoint)
    const users = usersFiltered?.map(user => user.userID)
    const chat = currentPeersReducer.chat


    const remotePeerRef = useRef({})
    const [usersArray, setUsersArray] = useState([])

    const [myStream, setMyStream] = useState(null)
    const [isMyCamOpen, setIsMyCamOpen] = useState(false)
    const [isMyMicOpen, setIsMyMicOpen] = useState(false)

    const peerRef = useRef({})

    //chat variables
    const [chatHistory, setChatHistory] = useState([]);
    const [text, setText] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [roomExists, setRoomExists] = useState(false);
    const [roomChecked, setRoomChecked] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true)

    const resetFormValue = () => setText("");

    const onSubmitHandler = (event) => {
        event.preventDefault();
        resetFormValue();
    };
    const onChangeHandler = (event) => {
        setText(event.target.value);
    };
    const onKeyDownHandler = (event) => {
        if (event.code === "Enter") {
                if(/\S/.test(text)) {
                    sendMessage();
                }
        }
    };

    const sendMessage = () => {
        const newMessage = {
            sender: userData.username,
            msg: text,
            time: `${new Date().getHours()}:${new Date().getMinutes()}`
        }
        socket.emit("chatMessage", newMessage)
    };

    useEffect(() => {
        socket.on("message", newMessage => {
            setChatHistory(prev => [...prev, newMessage])
        })

        return () => socket.off("message")
    }, [])

    const getMediaDevices = (mediaConstraints) => {
        return navigator.mediaDevices.getUserMedia(mediaConstraints)
    }
    const mediaConstraints = {video: true, audio: true}


    const getUserInfo = (userID) => {
        return new Promise (async(resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/users/${userID}`, {method: "GET" })
                if(response.ok) {
                    const userData = await response.json();
                    resolve(userData)
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    const getRoomData = (roomEndpoint) => {
        return new Promise (async(resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms/endpoint/${roomEndpoint}`, {method: "GET" })
                if(response.ok) {
                    const roomData = await response.json();

                    setRoomID(roomData[0]._id)
                    resolve(roomData)
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }


    useEffect(() => {
        //checking if user logged in
        isUserAlreadyLoggedInAction(userData, JWTToken, dispatch)
        .then((boolean) => {
            if(boolean === true) {
                setIsLoggedIn(true)

                getRoomData(roomEndpoint).then(data => {
                    setRoomData(data[0])
                    //check if room is already full, if it is navigate user to /rooms page
                    if( data[0].users.length  >=  data[0].capacity.toString()) {
                        alert("sorry the room is full :(")
                        const updatedUsers = data[0].users?.filter((user) => user !== userID)
                        dispatch(removePeerAction(myPeerId, userID))
                        updateRoomUsersAction(data[0].users, data[0]._id, userID).then((action) => dispatch(action))
                        window.location.replace('/rooms');
                    }

                    //getting the username of room creator
                    const creatorID = data[0].creator || data[0].creatorUserID;
                    if (creatorID) {
                        getUserInfo(creatorID).then(userData => {
                            setRoomCreatorUsername(userData.username)
                        })
                    }

                    if(onlineChatUsers.findIndex(user => user === userID) !== -1){
                        alert("you are already in another room! please try again after leave current room")
                        window.location.replace('/rooms')
                    }
                })

            } else {
                myStream.getTracks()
                .forEach((track) => track.stop());
                navigate("/login")
            }
        })
        .catch(err => console.log(err))
    },[])

    useEffect(() => {
        getRoomData(roomEndpoint).then(data => {setRoomData(data[0])})
    }, [chat])

    useEffect(() => {
        if (myStream && myVideoRef.current) {
            myVideoRef.current.srcObject = myStream;
        }
    }, [myStream, isMyCamOpen]);

    useEffect(()  => {
        const peer = new Peer({
            config: {'iceServers': [
                { url: 'stun:stun.l.google.com:19302' },
              ]}
        });
        peerRef.current = peer
        let peerID;
        peer.on('open', (id) => {
            setMyPeerId(id)
            peerID = id;
            socket.emit('join-room', { peerID: id, userID: userID, roomID, roomCapacity, roomEndpoint})
        })

        getMediaDevices(mediaConstraints)
        .then(stream => {
            setMyStream(stream)

            stream.getVideoTracks()[0].enabled = false
            stream.getAudioTracks()[0].enabled = false
            // adding our peer
            dispatch(addPeerAction(peerID, stream, userID, roomEndpoint))

            peer.on('call', call => {
                // console.log("INCOMING CALL:", call.peer)
                call.answer(stream)
                call.on("stream", remoteStream => {
                    // console.log("ANSWER STREAM RECEIVED:", call.peer)
                    dispatch(addPeerAction(
                        call.peer,
                        remoteStream,
                        call.metadata.userID,
                        call.metadata.roomEndpoint
                    ))
                })
            })

            socket.on('user-connected', payload => {
                // console.log("USER CONNECTED:", payload.peerID)
                // console.log("peerID:", peerID, "userID:", userID,"roomEndpoint:", roomEndpoint)
                const call = peer.call(payload.peerID, stream, {
                    metadata: {
                        userID,
                        roomEndpoint
                    }
                })
                // console.log("CALLING:", payload.peerID)
                call.on('stream', remoteStream => {
                    console.log("REMOTE STREAM RECEIVED:", payload.peerID)

                    dispatch(addPeerAction(
                        payload.peerID,
                        remoteStream,
                        payload.userID,
                        payload.roomEndpoint
                    ))
                })

            })
            remotePeerRef.current = peer
                socket.on('user-disconnected', payload => {
                    dispatch(removePeerAction(payload.peerID, payload.userID))
                })

                socket.on("user-left", (payload) => {
                    setUsersArray(payload.users)
                    dispatch(removePeerAction(payload.peerID, payload.userID))
                    updateRoomUsersAction(payload.users, roomID ,payload.userID).then((action) => dispatch(action))
                })

                socket.on("you-kicked", payload => {
                    if(payload.userID === userID){
                        dispatch(getIsKickedAction(true))
                        window.location.replace("/rooms?isKicked=true")
                    }
                })

                socket.on("camera-toggled", ({ userID, isCameraOn }) => {
                    dispatch(updateCameraState(userID, isCameraOn))
                })
        })
        
        .catch(err => {
            const stream = createSilentStream()
            setMyStream(stream)
            dispatch(addPeerAction(peerID, stream, userID, roomEndpoint))
            peer.on('call', call => {
                call.answer(stream)
                call.on("stream", remoteStream => {
                    dispatch(addPeerAction(
                        call.peer,
                        remoteStream,
                        call.metadata.userID,
                        call.metadata.roomEndpoint
                    ))
                })
            })

            socket.on('user-connected', payload => {
                const call = peer.call(payload.peerID, stream, {
                    metadata: { userID, roomEndpoint }
                })

                call.on('stream', remoteStream => {
                    dispatch(addPeerAction(
                        payload.peerID,
                        remoteStream,
                        payload.userID,
                        payload.roomEndpoint
                    ))
                })
            })
            socket.on('user-disconnected', payload => {
                dispatch(removePeerAction(payload.peerID, payload.userID))
            })

            socket.on("user-left", payload => {
                dispatch(removePeerAction(payload.peerID, payload.userID))
            })

            socket.on("camera-toggled", ({ userID, isCameraOn }) => {
                dispatch(updateCameraState(userID, isCameraOn))
            })
        });
         return () => {
            socket.off('user-connected')
            socket.off('user-disconnected')
            socket.off('user-left')
            socket.off('you-kicked')
            peer.destroy()
        }
    }, [])

    useEffect(() => {
        if(users) {
            updateRoomUsersAction(users, roomID, userID).then((action) => dispatch(action))
        }
    }, [users])

    useEffect(() => {
        if (isMyCamOpen && myStream && myVideoRef.current) {
            myVideoRef.current.srcObject = myStream;
        }
    }, [isMyCamOpen, myStream]);


    window.onpopstate = () => {
        //for make sure the user disconnect from the chat room
        window.location.reload();
    }

    const leaveTheRoomHandler = () => {
        const updatedUsers = users?.filter((user) => user !== userID)
        dispatch(removePeerAction(myPeerId, userID))
        updateRoomUsersAction(updatedUsers, roomID, userID).then((action) => dispatch(action))
        //disable the webcam and mic before leave
        myStream.getTracks().forEach((track) => track.stop());

    }

    const toggleCamHandler = () => {
        const videoTrack = myStream.getTracks().find(t => t.kind === 'video')
        if (!videoTrack) return
        videoTrack.enabled = !videoTrack.enabled
        setIsMyCamOpen(videoTrack.enabled);
        socket.emit("camera-toggled", {
            userID,
            roomEndpoint,
            isCameraOn: videoTrack.enabled
        })
    }

    const toggleMicHandler = async () => {
        try {
            if (!myStream) {

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: true
                });

                setMyStream(stream);

                const audioTrack = stream.getAudioTracks()[0];
                audioTrack.enabled = true;

                setIsMyMicOpen(true);
                return;
            }

            const audioTrack = myStream?.getAudioTracks?.()[0];
            if (!audioTrack) return;

            audioTrack.enabled = !audioTrack.enabled;
            setIsMyMicOpen(audioTrack.enabled);

        } catch (err) {
            if (err.name === "NotAllowedError") {
                toast.error("Microphone is blocked. Allow access in your browser.");
            } else {
                toast.error("Unable to access microphone.");
            }
        }
    }

    const copyTheChatLink = () => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_BE_DEV_URL}/chatroom/${roomEndpoint}`)
        toast('The link of the room copied!', {
            toastId: "copyLinkToast",
            position: "top-center",
            autoClose: 2200,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        })
    }

    const kickTheUser = (e) => {
        socket.emit("kick-user", {userID: e.target.value, roomEndpoint});
    }

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [chatHistory]);

    const toggleChatArea = () => {
        if (isChatOpen) {
            setIsChatOpen(false)

        } else {
            setIsChatOpen(true)
        }
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        if(isSidebarOpen) {
            setIsSidebarOpen(false)
        } else {
            setIsSidebarOpen(true)
        }
    }

    const closeSidebar = () => {
        if (isSidebarOpen) {
            setIsSidebarOpen(false)

        }
    }

     const toggleSound = () => {
        const videos = document.querySelectorAll("video");

        videos.forEach(video => {
            if (!video.classList.contains("current-user-video")) {
            video.muted = isSoundOn;
            }

        });

        setIsSoundOn(!isSoundOn);
    };

    const createSilentStream = () => {
        const ctx = new AudioContext()
        const oscillator = ctx.createOscillator()
        const dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        return dst.stream
    }

    return (
        <div className='d-flex flex-row chatRoom-div'>

                            <div className='left-sidebar  flex-column justify-content-between align-items-center'>
                                <div className="navbar-logo d-flex justify-content-center">
                                    <a href='/rooms'>
                                    sipeaky

                                    </a>
                                </div>
                                <div className='sidebar-btns d-flex flex-column justify-content-center align-items-center'>
                                    <div className='d-flex justify-content-center'>
                                    <a href='/rooms'>
                                        <HiHome/>
                                        </a>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <HiVideoCamera/>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <FaUserFriends/>
                                    </div>
                                    <div>
                                        <HiPlus/>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <MdSettings/>
                                    </div>
                                </div>
                                <div className='left-btn d-flex justify-content-center flex-column'>
                                    <div className="sidebar-user-avatar d-flex justify-content-center mb-3">
                                        <img src="/assets/avatar-default.png" alt="avatar-default" />
                                    </div>

                                    <div>
                                    <a href='/rooms'>
                                        <RxPinLeft onClick={leaveTheRoomHandler}/>
                                    </a>
                                    </div>

                                </div>

                            </div>

                            <div className=' main-area position-relative' onClick={closeSidebar}>
                                <div className='main-top d-flex align-items-center justify-content-between position-relative'>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <div className='main-top-language me-3'>{roomData.language} - {roomData.level}</div>
                                        <div className='main-top-host'>
                                            <div>host:</div>
                                            <div className='ms-1 main-top-creator'>{roomCreatorUsername}</div>
                                        </div>

                                        <div className='main-top-host-mobile'>
                                            <div>host:</div>
                                            <div className='ms-1 main-top-creator'>{roomCreatorUsername}</div>
                                        </div>

                                    </div>
                                    <div className='d-flex justify-content-center align-items-center'>

                                        <div className='copy-link-div d-flex'>
                                            <div  onClick={copyTheChatLink} className='copy-link-text'>copy the chat link</div>
                                            <div onClick={copyTheChatLink} className="copy-link-btn-div">

                                                <AiFillCopy  className="copy-link-btn"/>
                                            </div>
                                            <ToastContainer

                                                id= "copyLinkToast"/>
                                        </div>

                                        <div className='main-top-username'>{userData?.username}</div>


                                        {/* sidebar for the tablet and phones */}
                                        <div className='sidebar-burger' onClick={toggleSidebar}>
                                                <GiHamburgerMenu/>
                                        </div>
                                    </div>
                                </div>
                                <div className={`left-sidebar-mobile flex-column justify-content-between align-items-center ${isSidebarOpen? "left-sidebar-mobile-open": "left-sidebar-mobile-close"}`}>
                                    <div className="navbar-logo d-flex justify-content-center">
                                        sipeaky
                                    </div>
                                    <div className='sidebar-btns d-flex flex-column justify-content-center align-items-center'>
                                        <div className='d-flex justify-content-center'>
                                            <HiHome/>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <HiVideoCamera/>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <FaUserFriends/>
                                        </div>
                                        <div>
                                            <HiPlus/>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <MdSettings/>
                                        </div>
                                    </div>
                                    <div className='left-btn d-flex justify-content-center flex-column'>
                                        <div className="sidebar-user-avatar d-flex justify-content-center mb-3">
                                            <img src="/assets/avatar-default.png" alt="avatar-default" />
                                        </div>

                                        <div>
                                            <RxPinLeft/>
                                        </div>

                                    </div>

                                </div>
                                <div className='main-bottom d-flex'>
                                    <div className='video-area d-flex flex-column justify-content-between'>
                                        {/* <div className='video-area-header '>

                                        </div> */}
                                        <div className='video-area-player'>
                                            <div className='video-area-player-frame d-flex flex-column align-items-center justify-content-center'>
                                                <Container className='d-flex flex-column justify-content-center'>
                                                    <Row>
                                                        <Col sm={6} className="video-player-col position-relative">
                                                            <div className='position-relative'>
                                                                {isMyCamOpen ? (
                                                                    <div className='video-player'>
                                                                        <video
                                                                            className="video current-user-video"
                                                                            ref={myVideoRef}
                                                                            autoPlay
                                                                        />
                                                                        <div className='video-username your-username'>
                                                                            you
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="video-player video-placeholder">
                                                                        <div className="avatar-circle">
                                                                            {userName?.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div className="placeholder-name">
                                                                            {userName}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className='video-username your-username d-flex flex-column'>
                                                                    <div>you</div>
                                                                    </div>
                                                            </div>
                                                            {userName === roomCreatorUsername && <div className='creator-label'>host</div>}

                                                        </Col>
                                                        {peers?.map(peer => peer.userID !== userID &&
                                                            <Col sm={6} key={peer.userID} className="video-player-col">
                                                                <div className='position-relative'>
                                                                    <div className='video-player' key={peer.userID}>
                                                                            {/* <div>{peer.peerID}</div> */}
                                                                            {/* <div>userrrrID: {peer.userID}</div> */}
                                                                        <VideoPlayer stream = {peer.stream} userID = {peer.userID} creatorUserName = {roomCreatorUsername}  isCameraOn={peer.isCameraOn}/>
                                                                    </div>
                                                                    <div>
                                                                        {userName === roomCreatorUsername &&
                                                                        <button className='kick-btn d-flex justify-content-center align-items-center' value={peer.userID} onClick={kickTheUser}>
                                                                            kick
                                                                            {/* <img src="/assets/kick-icon.jpg" alt="kick"  />  */}
                                                                        {/* <button className='kick-btn' value={peer.userID} onClick={kickTheUser}>Kick</button> */}
                                                                        </button>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        )}
                                                    </Row>

                                                </Container>

                                            </div>
                                        </div>
                                        <div className='video-area-footer d-flex justify-content-center align-items-center position-relative'>
                                            <div className="chat-btns mute-btn d-flex justify-content-center align-items-center"
                                                title={isSoundOn ? "Mute sound" : "Unmute sound"}
                                                onClick={toggleSound}
                                            >
                                                {isSoundOn ? <VscUnmute/> : <VscMute/>}
                                            </div>
                                            <div className='chat-btns audio-btn d-flex justify-content-center align-items-center'>
                                                {isMyMicOpen
                                                    ? <AiOutlineAudio onClick={toggleMicHandler} title="Mute microphone"/>
                                                    : <AiOutlineAudioMuted onClick={toggleMicHandler} title="Unmute microphone"/>}
                                            </div>
                                            <div className=' end-call-btn d-flex justify-content-center align-items-center'>
                                                <a href='/rooms'>
                                                    <MdOutlineCallEnd onClick={leaveTheRoomHandler}/>
                                                </a>
                                            </div>
                                            <div className='chat-btns chat-btns camera-btn d-flex justify-content-center align-items-center'>

                                                {isMyCamOpen
                                                    ? <BsCameraVideo onClick={toggleCamHandler} title="Turn off camera"/>
                                                    : <BsCameraVideoOff onClick={toggleCamHandler} title="Turn on camera"/>}
                                            </div>
                                            <div className='chat-btns settings-btn d-flex justify-content-center align-items-center'>
                                                <FiSettings className='settings-icon' title='Settings'/>
                                                <BsFillChatLeftDotsFill className='chat-icon-footer' onClick={toggleChatArea}/>
                                            </div>

                                        </div>



                                    </div>
                                    <div className='chat-area '>
                                        <div className='chat-messages-div d-flex flex-column '>
                                            {chatHistory?.map(message =>
                                            <div className={`chat-message-display d-flex flex-column ${(message.sender === userData.username)? 'align-items-end': 'align-items-start'}`}>
                                                {message.sender !== userData.username ?  <div className='chat-message-sender d-flex justify-content-end'> {message?.sender}</div>: <></>}

                                                <div className={`chat-message d-flex flex-column  position-relative ${(message.sender === userData.username)? 'my-message ': 'user-message'}`}>
                                                    <div className='chat-message-text d-flex justify-content-start'>{message?.msg}</div>
                                                    <div className='chat-message-time position-absolute'>
                                                        {message.time}
                                                    </div>
                                                </div>
                                             </div>
                                            )}
                                             <div ref={messagesEndRef} />
                                        </div>

                                        <div className='chat-input-div d-flex justify-content-center align-items-center'>
                                            <Form className="form d-flex justify-content-center align-items-center" onSubmit={onSubmitHandler}>
                                                <Form.Group
                                                    className="form-group d-flex justify-content-center align-items-center"
                                                    controlId="formBasicEmail"
                                                >
                                                    <Form.Control
                                                        className="form-control chat-input"
                                                        type="text"
                                                        placeholder="Type a message"
                                                        onChange={onChangeHandler}
                                                        value={text}
                                                        onKeyDown={onKeyDownHandler}
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </div>

                                </div>
                                <div className='chat-mobile-btn  position-absolute' onClick={toggleChatArea}>
                                    {/* <div>chat</div> */}
                                    <BiLeftArrow className='left-arrow-icon'/>
                                    <BsFillChatLeftDotsFill className='chat-icon'/>
                                </div>
                                <div className={`chat-area-mobile position-absolute ${isChatOpen ? `chat-area-mobile-open`: `chat-area-mobile-close`}`}>

                                    <div className='chat-area-mobile-toggle position-absolute ' onClick={toggleChatArea}>
                                        <BiRightArrow/>
                                    </div>
                                        <div className='chat-messages-div d-flex flex-column '>
                                            {chatHistory?.map(message =>
                                            <div className={`chat-message-display d-flex flex-column ${(message.sender === userData.username)? 'align-items-end': 'align-items-start'}`}>
                                                {message.sender !== userData.username ?  <div className='chat-message-sender d-flex justify-content-end'> {message?.sender}</div>: <></>}

                                                <div className={`chat-message d-flex flex-column position-relative ${(message.sender === userData.username)? 'my-message ': 'user-message'}`}>
                                                    <div className='chat-message-text d-flex justify-content-start align-items-start'>{message?.msg}</div>
                                                    <div className='chat-message-time position-absolute'>
                                                        {message.time}
                                                    </div>
                                                </div>

                                             </div>
                                            )}
                                             <div ref={messagesEndRef} />
                                        </div>

                                        <div className='chat-input-div d-flex justify-content-center align-items-center'>
                                            <Form className="form d-flex justify-content-center align-items-center" onSubmit={onSubmitHandler}>
                                                <Form.Group
                                                    className="form-group d-flex justify-content-center align-items-center"
                                                    controlId="formBasicEmail"
                                                >
                                                    <Form.Control
                                                        className="form-control chat-input"
                                                        type="text"
                                                        placeholder="Type a message"
                                                        onChange={onChangeHandler}
                                                        value={text}
                                                        onKeyDown={onKeyDownHandler}
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </div>
                            </div>
                    </div>
    )
}

export default ChatRoom;