/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "react-bootstrap";
import "./RoomPreview.css"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState} from "react";
import {  useDispatch, useSelector } from "react-redux";
import {GiPerson} from "react-icons/gi"
import "react-component-countdown-timer/lib/styles.css";


const RoomPreview = (props) => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const roomData = props.roomData;
    const user = useSelector(state => state.profileReducer.data)
    const users = roomData.users;
    const [roomID, setRoomID] = useState(roomData._id)
    const [roomCapacity, setRoomCapacity] = useState(roomData.capacity);
    const [roomLanguage, setRoomLanguage] = useState(roomData.language);
    const [roomLevel, setRoomLevel] = useState(roomData.level);
    const [roomCreatorID, setRoomCreatorID] = useState(roomData.creatorUserID);
    const [roomCreatorUsername, setRoomCreatorUsername] = useState("");
    
    
    //todo get username for the creator
    //todo get username of the users in the rooms
    const joinTheRoom = () => {
        // console.log("join the room button triggered!")
        if(users.length < roomData.capacity){
            navigate(`/chatroom/${roomData.endpoint}`, {state: {user: user, roomID: roomData._id}})
        } else {
            window.alert("Room is full!")
        }
        
    } 

    useEffect(() => {
        if (!roomCreatorID) return;
        getUsername(roomCreatorID).then((username) =>{ setRoomCreatorUsername(username)});
    }, [roomCreatorID]);

    const deleteRoom = async(roomID) => {
        try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/rooms/${roomID}`, {method: "DELETE"})
                if(response.ok){
                    const {_id} = response.json()
                } else {
                    console.log("oppss something went wrong when fetching")
                }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteRoomHandler = () => {
        deleteRoom(roomID);
    }
    
    const getUsername = (userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/users/${userID}`, {method: "GET"})
                if(response.ok) {
                    const userData = await response.json();
                    const username = userData.username;
                    resolve(username);
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
        
    }

    
    return  (
    <>
    <div>{roomCreatorID === user._id && 
        <>
            {/* <Button onClick={deleteRoomHandler}>Delete the room</Button>
            <div>You are a creator</div> */}
        </>
        }  
        
        </div>
        <div className={`room-preview d-flex justify-content-center align-items-center ${props.className}`}>
                
                <div className="language-labels">
                    <div className="room-language">
                        {roomLanguage}
                    </div>
                    <div className="room-level">
                        {roomLevel}
                    </div>
                </div>
                <div className="room-info d-flex justify-content-center align-items-center">
                    <div className="room-info-place-holders d-flex flex-column align-items-end me-2">
                        <div className="me-2 room-info-creator">creator</div>
                        <div className="me-2 room-info-language">language</div>
                        <div className="me-2 room-info-level">level</div>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                        <div>{roomCreatorUsername}</div>
                        <div>{roomLanguage}</div>
                        <div>{roomLevel}</div>
                    </div>

                </div>

                <div className="room-capacity d-flex">
                    {Array.from({ length: users?.length }).map((_, i) => (
                    <GiPerson
                        key={`full-${i}`}
                        className="room-person room-person-full"
                    />
                    ))}

                    {Array.from({ length: roomCapacity - users?.length }).map((_, i) => (
                    <GiPerson
                        key={`empty-${i}`}
                        className="room-person room-person-empty"
                    />
                    ))}
                </div>
                <div onClick={joinTheRoom} className="room-join-div">
                    Join the room
                </div>
            </div>
    </>
    )
}

export default RoomPreview;