import "./RoomPreview.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GiPerson } from "react-icons/gi";

const RoomPreview = (props) => {
    const navigate = useNavigate();

    const roomData = props.roomData;
    const user = useSelector(state => state.profileReducer.data);

    const users = roomData.users || [];
    const roomCapacity = roomData.capacity;

    const [roomCreatorUsername, setRoomCreatorUsername] = useState("");

    // JOIN ROOM
    const joinTheRoom = () => {
        if (users.length < roomCapacity) {
            navigate(`/chatroom/${roomData.endpoint}`, {
                state: { user: user, roomID: roomData._id }
            });
        } else {
            window.alert("Room is full!");
        }
    };

    // GET CREATOR USERNAME
    const getUsername = async (userID) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BE_DEV_URL}/users/${userID}`,
                { method: "GET" }
            );

            if (response.ok) {
                const userData = await response.json();
                return userData.username;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!roomData.creatorUserID) return;

        getUsername(roomData.creatorUserID).then((username) => {
            setRoomCreatorUsername(username);
        });
    }, [roomData.creatorUserID]);

    // DELETE ROOM (optional)
    const deleteRoom = async (roomID) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BE_DEV_URL}/rooms/${roomID}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                console.log("Delete failed");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteRoomHandler = () => {
        deleteRoom(roomData._id);
    };

    return (
        <>
            <div className={`room-preview d-flex justify-content-center align-items-center ${props.className}`}>
                <div className="language-labels">
                    <div className="room-language">{roomData.language}</div>
                    <div className="room-level">{roomData.level}</div>
                </div>
                <div className="room-info d-flex justify-content-center align-items-center">
                    <div className="room-info-place-holders d-flex flex-column align-items-end me-2">
                        <div className="me-2 room-info-creator">creator</div>
                        <div className="me-2 room-info-language">language</div>
                        <div className="me-2 room-info-level">level</div>
                    </div>

                    <div className="d-flex flex-column align-items-start">
                        <div>{roomCreatorUsername}</div>
                        <div>{roomData.language}</div>
                        <div>{roomData.level}</div>
                    </div>
                </div>
                <div className="room-capacity d-flex">
                    {Array.from({ length: users.length }).map((_, i) => (
                        <GiPerson
                            key={`full-${i}`}
                            className="room-person room-person-full"
                        />
                    ))}
                    {Array.from({
                        length: Math.max(0, roomCapacity - users.length)
                    }).map((_, i) => (
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
    );
};

export default RoomPreview;