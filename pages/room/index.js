import React, { useEffect, useState } from "react";
import Controls from "@/components/Controls";
import {
    useHMSActions,
    selectHMSMessages,
    useHMSStore,
    selectLocalPeer,
    selectPeers,
    selectIsSomeoneScreenSharing,
    selectDominantSpeaker,
    useHMSNotifications,
    HMSNotificationTypes,
    selectIsPeerAudioEnabled
} from "@100mslive/react-sdk";
import { useRouter } from "next/router";

import Messages from "@/components/Messages";
import VideoTile from "@/components/VideoTiles";
import VideoSpaces from "@/components/VideoSpaces";
import ScreenShare from "@/components/ScreenShare";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs"
import { MdPushPin } from "react-icons/md"
import { HiUserRemove, HiOutlineArrowSmLeft, HiOutlineArrowSmRight } from "react-icons/hi"

import NameCard from "@/components/NameCard";
import AudioCard from "@/components/AudioCard";
// To create room via api https://www.100ms.live/docs/server-side/v2/Rooms/create-via-api
//[POST] https://api.100ms.live/v2/rooms
import SidebarWrapper from "@/components/SidebarWrapper";
import Modal from "@/components/Modal";

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as jose from 'jose'

function Test() {
    const localPeer = useHMSStore(selectLocalPeer);
    const stage = localPeer?.roleName === "stage";
    const viewer = localPeer?.roleName === "viewer";
    const peers = useHMSStore(selectPeers);
    const hmsActions = useHMSActions();
    const notification = useHMSNotifications();
    const allMessages = useHMSStore(selectHMSMessages); // get all messages
    // hmsActions.sendBroadcastMessage("hello"); // send a message
    const [inputValues, setInputValues] = useState("");
    const [visible, isVisible] = useState(true);
    const [isAudio, setIsAudio] = useState(false)
    const [currentPage, setCurrentPage] = useState(0);
    // const [videoCards, setVideoCards] = useState(props.videoCards);

    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [sideMenu, setSideMenu] = useState("chat")

    const [roomId, setRoomId] = useState({
        audio: "63de708fda7e7ca812840b9f",
        av: "63d0fc1fda7e7ca812840a99"
    })
    const [type, setType] = useState("")
    const [role, setRole] = useState("")

    const router = useRouter();
    const [modal, setModal] = useState(false)
    const [user, setUser] = useState({
        userName: "",
        roomName: ""
    })

    useEffect(() => {
        // console.log(router.query)
        // const createRoom = async () => {
        // axios.post("https://api.100ms.live/v2/rooms", {
        //     name: "This is test room",
        //     description: "This is a sample description for the room",
        //     recording_info: {
        //         enabled: true
        //     }
        // })
        //     .then((res) => {
        //         console.log("new room resp is ", res)
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
        // }
        // createRoom()

        if (!router.query?.roomId) {
            setModal(true)
        } else {
            // let token;
            // axios.post(`https://prod-in2.100ms.live/hmsapi/testsubspace.app.100ms.live/api/token`, {
            //     user_id: "1234",
            //     role: router.query["role"],
            //     room_id: roomId[router.query["type"]],

            // })
            //     .then((res) => {
            //         console.log(res);
            //         // const { token } = {...res};
            //         // console.log(token)
            //         token = res?.data?.token
            //         hmsActions.join({
            //             userName: router.query["name"] || "Darshan V",
            //             // authToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2Nlc3Nfa2V5IjoiNjNkMGZiZGU5OTU3YmU4YTViOGMyMDIxIiwicm9vbV9pZCI6IjYzZDBmYzFmZGE3ZTdjYTgxMjg0MGE5OSIsInVzZXJfaWQiOiIxMjM0Iiwicm9sZSI6Imhvc3QiLCJqdGkiOiJkNDk3YjdhNS04NTFlLTQwZjktYjRmOC0zNzA4MTJmYzUwMWIiLCJ0eXBlIjoiYXBwIiwidmVyc2lvbiI6MiwiZXhwIjoxNjc0NzM1MzA0fQ.EWSPwSaJzMXYXe826u_0ODKD_8e2aHsEj7kEQHMC_8s",
            //             authToken: token,
            //             settings: {
            //                 isAudioMuted: true,
            //             },
            //         });
            //     })

        }

        // curl --location --request POST 'https://prod-in2.100ms.live/hmsapi/testsubspace.app.100ms.live/api/token' \
        // --header 'Content-Type: application/json' \
        // --data-raw '{
        //     "room_id":"63d0fc1fda7e7ca812840a99",
        //     "role":"host",
        //     "user_id":"1234"
        // }'

        setModal(true)
    }, []);

    useEffect(() => {
        if (visible === true) {
            setItemsPerPage(4)
        } else {
            // console.log("inside else ",pages, " ",currentPage)
            if (pages > 1) {
                setCurrentPage(0)
                setItemsPerPage(6)
            } else {
                setCurrentPage(0)
                // setItemsPerPage(6)
            }
        }
    }, [visible])

    const pages = Math.ceil(peers?.length / itemsPerPage);

    const handlePrevClick = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < pages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const getCurrentVideoCards = () => {
        const startIndex = currentPage * itemsPerPage;
        return peers.slice(startIndex, startIndex + itemsPerPage);
    };


    // console.log("pages ", pages)
    const [screenShared, setScreenShared] = useState(false)
    const [pinned, setPinned] = useState({
        status: false,
        peer: {}
    })
    // useHMSStore(selectIsSomeoneScreenSharing)
    // console.log(useHMSStore(selectIsSomeoneScreenSharing))
    // const screenshareOn = hmsStore.getState(selectIsSomeoneScreenSharing);
    const hmsStore = useHMSStore(selectIsSomeoneScreenSharing)
    // console.log(viewer)

    // console.log(pinned)

    useEffect(() => {
        setScreenShared(hmsStore)
    }, [hmsStore])

    useEffect(() => {
        if (!notification) return;
        console.log('notification type', notification.type);
        console.log(notification.data)

        switch (notification.type) {
            case HMSNotificationTypes.PEER_JOINED:
                console.log(`${notification.data.name} joined`);
                break;
            case HMSNotificationTypes.PEER_LEFT:
                console.log(`${notification.data.name} left`);
                break;
            case HMSNotificationTypes.NEW_MESSAGE:
                console.log(
                    `${notification.data.message} received from ${notification.data.senderName}`
                );
                break;
            case HMSNotificationTypes.ERROR:
                console.log('[Error]', notification.data);
                console.log('[Error Code]', notification.data.code);
                break;
            case HMSNotificationTypes.RECONNECTING:
                console.log('[Reconnecting]', notification.data);
                break;
            case HMSNotificationTypes.RECONNECTED:
                console.log('[Reconnected]');
                break;
            case HMSNotificationTypes.NAME_UPDATED:
            case HMSNotificationTypes.METADATA_UPDATED:
            case HMSNotificationTypes.ROLE_UPDATED:
                console.log(`peer updated(${notification.type}), new peer=`, notification.data);
                break;
            case HMSNotificationTypes.TRACK_DEGRADED:
                console.log(`track - ${notification.data} degraded due to poor network`);
                break;
            case HMSNotificationTypes.TRACK_RESTORED:
                console.log(`track - ${notification.data} recovered`);
                break;
            case HMSNotificationTypes.ROOM_ENDED:
                console.log(`room ended, reason - ${notification.data.reason}`);
                break;
            case HMSNotificationTypes.REMOVED_FROM_ROOM:
                console.log(`removed from room, reason - ${notification.data.reason}`);
                break;
            case HMSNotificationTypes.DEVICE_CHANGE_UPDATE:
                console.log(`device changed - ${notification.data}`);
                break;
            default:
                break;
        }
    }, [notification])

    const updateGridTemplate = () => {
        let template = '';
        let participants = peers?.length
        if (participants === 1) {
            template = '1fr';
        } else if (participants === 2) {
            template = '1fr 1fr';
        } else {
            template = 'repeat(auto-fit, minmax(300px, 1fr))';
        }

        return template;
    };

    // console.log("number of pears is ", peers?.length)

    const handleInputChange = (e) => {
        setInputValues(e.target.value);
        // let x = new Date().toLocaleTimeString()
    };

    const sendMessage = () => {
        hmsActions.sendBroadcastMessage(inputValues);
        setInputValues("");
    };

    const setVisibility = (dat) => {
        isVisible(dat)
    }

    // console.log(peers)
    // console.log(stage)

    const createRoom = async () => {
        console.log(user)
        // axios.post("https://dvconf.app.100ms.live/v2/rooms", {
        //     name: user.roomName,
        //     description: "This is a sample description for the room",
        //     recording_info: {
        //         enabled: true
        //     }
        // })
        //     .then((res) => {
        //         console.log("new room resp is ", res)
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })

        const app_access_key = '63d0fbde9957be8a5b8c2021';
        const app_secret = '3HWPQKsBSNyZ9ICTlYCqbaOV_-xgSNhRI7B1jHW5kdronpBi4J--L-18oSAlfU-IrljWHs0WHWMXLTb1hdIHTreCA_gtT7fEwKcvmqQ9pLmGCcV6O3tQoBuZ_UegBjTK_FhercYND1z4NkWa358p9kzCjMmxMTPJaS7Df4WMsO0=';
        const payload = {
            access_key: app_access_key,
            type: 'management',
            version: 2,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000)
        };

        const secret = new TextEncoder().encode(
            app_secret
        )
        const alg = 'HS256'

        const jwt = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secret)

        console.log(jwt)

        const config = {
            headers: { Authorization: `Bearer ${jwt}`,'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        };

        await axios.post("https://dvconf.app.100ms.live/v2/rooms", {
            name: user.roomName,
            description: "This is a sample description for the room",
            recording_info: {
                enabled: true
            }
        }, config)
            .then((res) => {
                console.log("new room resp is ", res)
            })
            .catch((err) => {
                console.log(err)
            })

}
return (
    <div className="max-h-screen justify-center ">
        <main className={`grid md:grid-cols-9 w-full h-full ${modal && "blur-sm"}`}>
            <SidebarWrapper className="block md:hidden" open={visible} setOpen={isVisible} show={false}>
                <Messages
                    sideMenu={sideMenu}
                    setSideMenu={setSideMenu}
                    allMessages={allMessages}
                />
            </SidebarWrapper>
            <div className={`relative h-[90vh] ${visible ? "md:col-span-7" : "md:col-span-full"}`}>
                <div className="h-full overflow-auto bg-slate-600">
                    {screenShared ? (
                        <div className="flex flex-wrap gap-x-10 p-5  justify-center  mx-auto overflow-auto w-[70vw] my-auto rounded-2xl">
                            {/* Share screen */}
                            {stage
                                ? null
                                : peers &&
                                peers
                                    // .filter((peer) => !peer.isLocal)
                                    .map((peer, index) => {
                                        return (
                                            // <div className=" overflow-hidden ">
                                            <ScreenShare key={index} isLocal={false} peer={peer} />
                                            // </div>
                                        );
                                    })}
                        </div>) :
                        (
                            !pinned?.status ? (
                                <div className="w-full relative">
                                    <div className={`flex flex-wrap gap-x-10 p-5  justify-center  mx-auto overflow-auto`} style={{ gridTemplateColumns: updateGridTemplate() }}>
                                        {/* {localPeer && <VideoSpaces peer={localPeer} isLocal={true} />} */}
                                        {peers &&
                                            getCurrentVideoCards()
                                                // .filter((peer) => !peer.isLocal)
                                                .map((peer) => {
                                                    return (
                                                        <>
                                                            <div className="relative">
                                                                {type === "av" && <VideoSpaces isLocal={false} peer={peer} setPinned={setPinned} pinned={pinned} />}
                                                                {type === "audio" && <AudioCard className="" peer={peer} />}
                                                            </div>

                                                        </>
                                                        // {
                                                        //     type === "av" ? (
                                                        //         <div className="relative">
                                                        //         <VideoSpaces isLocal={false} peer={peer} setPinned={setPinned} pinned={pinned} />
                                                        //     </div>
                                                        //     ) : (
                                                        //         <div className="relative">
                                                        //             <AudioCard peer={peer}/>
                                                        //         </div>
                                                        //     )
                                                        // }
                                                    );
                                                })}
                                    </div>
                                </div>
                            ) :
                                (
                                    <div className="gap-x-10  justify-center  mx-auto w-[70%] my-auto  overflow-hidden">
                                        <div className="relative">
                                            <VideoSpaces isLocal={false} peer={pinned?.peer} pinned={pinned} setPinned={setPinned} />
                                        </div>
                                    </div>
                                )
                        )}
                </div>

                <div className="absolute flex flex-col w-full mx-auto justify-center bottom-0 ">

                    {!pinned?.status && (screenShared === false) && (pages > 1) && (<div className="flex justify-around w-full mb-2 ">
                        <div
                            className={`bg-gray-300 rounded-full my-auto  text-gray-800 font-bold  text-3xl ${currentPage > 0 ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={handlePrevClick}
                            disabled={currentPage > 0 ? false : true}
                        >
                            <HiOutlineArrowSmLeft />
                        </div>
                        <div className="flex mt-4 my-auto">
                            {Array.from({ length: pages }).map((_, index) => (
                                <div
                                    onClick={() => setCurrentPage(index)}
                                    key={index}
                                    className={`w-3 h-3 mr-2 cursor-pointer rounded-full ${index === currentPage ? "bg-white" : "bg-gray-500"
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            className={`bg-gray-300  text-gray-800 font-bold rounded-full text-3xl ${(currentPage + 1 === pages) ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={handleNextClick}
                            disabled={(currentPage + 1 === pages) ? true : false}
                        >
                            <HiOutlineArrowSmRight />
                        </button>
                    </div>)}

                    <div className="bg-slate-900 w-full md:rounded-full min-h-2/5 p-2">
                        <Controls type={type} switches={setVisibility} visible={visible} setVisible={isVisible} isAudio={isAudio} />
                    </div>
                </div>
            </div>

            <div className={`md:col-span-2 max-h-screen bg-slate-700 duration-300 transition-all ease-in-out
                    ${visible ? "hidden md:block" : "hidden"}
                `}>
                <Messages
                    sideMenu={sideMenu}
                    setSideMenu={setSideMenu}
                    allMessages={allMessages}
                />
            </div>

        </main>
        {modal && (
            <Modal
                showModal={setModal}
                setShowModal={setModal}
                showClose={false}
            >
                <div className="w-[400px] p-4">
                    <div class="mb-6">
                        <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 ">Your name</label>
                        <input type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user?.userName}
                            onChange={(e) => setUser((prev) => ({ ...prev, userName: e.target.value }))}
                        />
                    </div>
                    <div class="mb-6">
                        <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 ">Room name</label>
                        <input type="text" id="default-input" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={user?.roomName}
                            onChange={(e) => setUser((prev) => ({ ...prev, roomName: e.target.value }))}
                        />
                    </div>
                    <button onClick={() => createRoom()} type="submit" class="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create room</button>
                </div>
            </Modal>
        )}
    </div>
)
}

export default Test