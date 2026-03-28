/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from 'react';
import { useEffect } from 'react';
import "./videoPlayer.css"
import { useState } from 'react';

export const VideoPlayer = (props) => {
    const userID = props.userID
    let videoRef = useRef(null);
    const [username, setUsername] = useState("")

    useEffect(() => {
        if (!props.stream || !videoRef.current || !props.isCameraOn) return

        videoRef.current.srcObject = props.stream

        videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => console.log("video play error", err))
        }
    }, [props.stream, props.isCameraOn])

    useEffect(() => {
        if (!userID) return;
        getUserData(userID).then((userData) => setUsername(userData.username))
    }, [userID])

    const getUserData = (userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BE_DEV_URL}/users/${userID}`, {method: "GET"})
                if(response.ok) {
                    const userData = await response.json();
                    resolve(userData);
                }
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    return  <>
        {props.isCameraOn ? (
            <video ref={videoRef} autoPlay className='video'/>
            ) : (
                <div className="video-placeholder">
                    <div className="avatar-circle">
                        {username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="placeholder-name">
                        {username}
                    </div>
                </div>
            )}
</>
}