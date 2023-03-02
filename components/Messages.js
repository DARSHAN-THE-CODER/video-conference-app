import React, {useState} from 'react'
import NameCard from './NameCard'
import {useHMSActions, useHMSStore, selectPeers, selectHMSMessages} from "@100mslive/react-sdk"

function Messages({sideMenu, setSideMenu}) {

    const hmsActions = useHMSActions();
    const [inputValues, setInputValues] = useState("");
    const peers = useHMSStore(selectPeers);
    const allMessages = useHMSStore(selectHMSMessages); // get all messages

    const handleInputChange = (e) => {
        setInputValues(e.target.value);
        // let x = new Date().toLocaleTimeString()
    };

    const sendMessage = () => {
        hmsActions.sendBroadcastMessage(inputValues);
        setInputValues("");
    };
    return (
        <div className="h-full bg-slate-700 flex flex-wrap justify-center mx-auto flex-row  ">
            <div className="text-white w-full flex justify-evenly gap-2  bg-slate-800 h-12">
                <button onClick={() => setSideMenu("chat")} className={`flex-1 text-white  py-3 ${sideMenu === "chat" ? "border-b-2" : ""}`}>
                    CHAT
                </button>
                <button onClick={() => setSideMenu("participants")} className={`flex-1 text-white  py-3 ${sideMenu === "participants" ? "border-b-2" : ""}`}>
                    PARTICIPANTS
                </button>
            </div>

            {sideMenu === "chat" && (
                <div className="flex relative w-full ">
                    <div className="w-full h-full max-h-[70vh] flex flex-col mb-2 overflow-y-auto visible ">
                        {allMessages?.length > 0 ? allMessages.map((msg) => (
                            <div
                                className="flex flex-col gap-2 bg-slate-800 m-3 pb-2 px-2 rounded-md"
                                key={msg.id}
                            >
                                <span className="text-white text-xl font-thin opacity-75 ">
                                    {msg.senderName}
                                    <span className="ml-2 italic">{new Date(msg.time).toLocaleTimeString()}</span>
                                </span>
                                <span className="text-white text-xl break-words">{msg.message}</span>
                            </div>
                        )) :
                            <div className="text-white my-auto text-center">
                                There are no messages to display here !
                            </div>
                        }
                    </div>
                    <div className="absolute w-full bottom-0 rounded-2xl bg-slate-700 py-3 gap-2 justify-evenly mx-auto flex flex-row flex-wrap">
                        <input
                            type="text"
                            placeholder="Write a Message"
                            value={inputValues}
                            onChange={handleInputChange}
                            required
                            className=" focus:outline-none flex-2 p-3 rounded-md text-white bg-slate-900"
                        />
                        <button
                            className=" text-white bg-sky-600 p-3 px-4 rounded-md"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
            {sideMenu === "participants" && (
                <div className="w-full h-full max-h-[70vh] flex flex-col mb-2 overflow-y-auto visible ">
                    {
                        peers?.length > 0 ? peers?.map((peer, index) => (
                            <NameCard peer={peer} key={index} />
                        )
                        ) : (
                            <div>
                                No participants !
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    )
}

export default Messages