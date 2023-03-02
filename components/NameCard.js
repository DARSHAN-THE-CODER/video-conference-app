import {
    useHMSStore,
    selectIsPeerAudioEnabled,
    selectIsPeerVideoEnabled
} from "@100mslive/react-sdk";

import {BiMicrophone, BiMicrophoneOff, BiVideoOff, BiVideo} from "react-icons/bi"

function NameCard({ peer }) {

    const audioEnabled = useHMSStore(selectIsPeerAudioEnabled(peer?.id))
    const videoEnabled = useHMSStore(selectIsPeerVideoEnabled(peer?.id))

    // console.log("enabled -> ",audioEnabled)
    return (
        <div className="flex flex-col gap-2 bg-slate-500 m-3 rounded-lg p-3">
            <div className="text-white flex ">
                <span className="my-auto text-xl mr-2">{audioEnabled ? <BiMicrophone/> : <span className="text-red-400"><BiMicrophoneOff/></span>}</span>  
                <span className="my-auto text-xl mr-2">{videoEnabled ? <BiVideo/> : <span className="text-red-400"><BiVideoOff/></span> } </span>
                {peer?.name}
            </div>
        </div>
    )
}

export default NameCard