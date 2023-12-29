import "./BandPage.css";
import React, { useEffect, useState } from "react";
import {
    checkIfBandMemberCall,
    createMultitrackCall,
    createTrackCall,
    getAllBandMessages,
    getBandByParams,
    getBandMembers,
    joinBandCall,
    leaveBandCall,
    postMessage
} from "../../services/apiCalls";
import { useNavigate, useParams } from "react-router-dom";
import { Multitrack } from "../../common/Multitrack/Multitrack";
import { BandChat } from "../../common/BandChat/BandChat";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../userTokenSlice";
import { addMessage, setMessages } from "../bandMessagesSlice";
import { FieldInput2 } from "../../common/FieldInput2/FieldInput2";
import { jwtDecode } from "jwt-decode";

export const BandPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const userCredentialsRedux = useSelector(userData);
    const token = userCredentialsRedux.credentials;
    let currentId;
    if ((typeof token) !== "object") {
        const decToken = token ? jwtDecode(token) : null;
        currentId = decToken?.id;
    }

    // const bandMessages = useSelector((state) => state.bandMessages);
    const [isBandMember, setIsBandMember] = useState(false);

    const [bandPage, setBandPage] = useState(null);
    const [multitrack, setMultitrack] = useState({});
    const [tracks, setTracks] = useState(null);
    const [messages, setMessages] = useState(null);
    const { id } = useParams();

    const [messageButton, setMessageButton] = useState(false);

    const sendNewMessage = async (message) => {
        try {
            const body = { message };
            console.log('mensaje ---> ' + body.message);
            setMessageButton(true)
            const response = await postMessage(id, body, token);
            dispatch(addMessage(response.data.message));
        } catch (error) {
            console.error('Error send message --> ', error);
        }
    };

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await getAllBandMessages(id);
                setMessages(response.data.bandMessages);
            } catch (error) {
                console.error('Error get message --> ', error);
            }
        };
        getMessages();
        // }, [dispatch, sendNewMessage, id]);
    }, [dispatch, id, messageButton]);

    if (messageButton) {
        setMessageButton(false);
    }
    // console.log(messageButton);

    // refactorizar join/leave en un boton con useEffect
    const [joinButton, setJoinButton] = useState();

    const joinBandButton = async () => {
        try {
            const body = { "band_id": id };
            console.log(id, token);
            const response = await joinBandCall(body, token);
            console.log(response.data);
            setJoinButton(false);
        } catch (error) {
            console.log("User can't join the band");
        }
    }
    // console.log(joinButton);
    const leaveBandButton = async () => {
        try {
            const body = { "band_id": id };
            console.log(id, token);
            const response = await leaveBandCall(body, token);
            console.log(response.data);
            setJoinButton(true);
        } catch (error) {
            console.log("User can't join the band");
        }
    }

    useEffect(() => {
        const checkIsMember = async () => {
            try {
                const response = await checkIfBandMemberCall(id, token);
                const bandMember = response.data.bandMember;
                setIsBandMember(bandMember);
            } catch (error) {
                console.log(error);
            }
        }
        checkIsMember();
    }, [isBandMember, joinButton])

    const [multitrackBody, setMultitrackBody] = useState({
        project_title: '',
        img_url: '',
    });

    const multitrackBodyHandler = (e) => {
        setMultitrackBody((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const [multiExist, setMultiExist] = useState();
    const createMultitracK = async () => {
        try {
            const body = multitrackBody;
            // "project_title": "El cassette desde React III",
            // "img_url": "https://media.istockphoto.com/id/1328430843/vector/girls-band.jpg?s=612x612&w=0&k=20&c=Od2--mSNnlvFsE4meO-fxNUMjvIzy4b5s4tb6ZDL_Rk="
            const response = await createMultitrackCall(id, body, token);
            setMultitrack(response.data.data);
            setMultiExist(true);
        } catch (error) {
            console.error('Error creating new multitrack', error);
        }
    };

    console.log(multitrack.id);

    const [trackBody, setTrackBody] = useState({
        id: multitrack.id,
        track_name: '',
        img_url: '',
        track_url: '',
    });

    const trackBodyHandler = (e) => {
        setTrackBody((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const createTrack = async () => {
        try {
            // const body = trackBody;
            const body = {
                "id":multitrack.id,
                "track_name": "Una canción que hice",
                "img_url": "https://img.freepik.com/premium-vector/vinyl-record-disc-hand-drawn-engraving-style-sketch-vector-illustration_666729-557.jpg",
                "track_url": "https://actions.google.com/sounds/v1/science_fiction/alien_beam.ogg?hl=es-419"
            }
            const response = await createTrackCall(id, body, token);
            setTracks(response.data.data);
        } catch (error) {
            console.error('Error creating new multitrack', error);
        }
    };

    useEffect(() => {
        const getBandPage = async () => {
            try {
                const response = await getBandByParams(id);
                const bandPageData = response.data.data.band;
                // sólo un multitrack or banda en esta version
                const multitrackData = response.data.data.multitracks?.[0]?.multitrack;
                const tracksData = response.data.data.multitracks?.[0]?.tracks;
                setBandPage(bandPageData);
                setMultitrack(multitrackData);
                setTracks(tracksData);
                if (multitrackData) {
                    setMultiExist(true);
                }
            } catch (error) {
                console.error('Error get bandpage---> ', error);
            }
        };
        getBandPage();
        // }, [id, createMultitracK]);
    }, []);



    const loginPage = () => {
        navigate('/login');
    }

    console.log('mi current id: ', currentId);
    console.log('id del band leader: ', bandPage?.band_leader);
    console.log('band member: ', isBandMember);
    console.log('multitrack: ', multitrack);
    // if (multitrack) {
    //     setMultiExist(true);
    // }
    console.log('Hay multitrack: ', multiExist);
    return (
        <div className="bandPageDesign">
            <div className="bandPageContainer">
                {bandPage && (
                    <>
                        <div className="bandPageCompCont">
                            <div className="bandInfoContainer">
                                <div><img src={bandPage.img_url} alt="Band Image" /></div>
                                <div className="textBox">
                                    <div>{bandPage.band_name}</div>
                                    <div>About: </div>
                                    <div>{bandPage.about}</div>
                                    {(bandPage.band_leader === currentId) ? (<div>Soc el lider</div>):(<div>No soc el LEADER</div>)}
                                </div>
                            </div>
                            <div>
                                {(typeof multiExist === 'undefined') && (
                                    <div>
                                        {(bandPage.band_leader !== currentId) ? (
                                            <div>You must be logued as band leader to create a multitrack
                                            </div>
                                        ) : (
                                            <div className="fieldComp">
                                                <FieldInput2
                                                    design={'inputReg'}
                                                    type={"project_title"}
                                                    name={"project_title"}
                                                    placeholder={"Your project title..."}
                                                    functionProp={multitrackBodyHandler}
                                                // functionBlur={errorCheck}
                                                />
                                                <FieldInput2
                                                    design={'inputReg'}
                                                    type={"img_url"}
                                                    name={"img_url"}
                                                    placeholder={"Image link"}
                                                    functionProp={multitrackBodyHandler}
                                                // functionBlur={errorCheck}
                                                />
                                                <div onClick={createMultitracK} className="joinButton">Create Multitrack</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {(multiExist === true) && (
                                    <div>
                                        <Multitrack
                                            title={multitrack.project_title}
                                            img={multitrack.img_url}
                                            tracks={tracks}
                                        />
                                        <div>{isBandMember ?
                                            (<div>Soy member
                                                <div onClick={createTrack} className="joinButton">Load Track</div>
                                            </div>
                                            ) : (
                                                <div>no soy member</div>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {(!token) ? (
                            <div>
                                <div className="joinButton" onClick={loginPage}>Login</div>
                            </div>
                        ) : (<div>
                            {!isBandMember ? (
                                <div className="joinButton" onClick={joinBandButton}>Join</div>
                            ) : (
                                <div className="joinButton" onClick={leaveBandButton}>Leave</div>
                            )}
                        </div>)}
                        {(isBandMember) ?
                            (<div className="chatCont">
                                {messages && (
                                    <BandChat
                                        placeholder={'Escribe a la banda...'}
                                        messages={messages}
                                        onSendMessage={sendNewMessage}
                                    />
                                )}
                            </div>) : (
                                <div>
                                    Join band to chat with the band
                                </div>
                            )}

                    </>
                )}
            </div>
        </div>
    );
};
