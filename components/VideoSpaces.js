import { React, useEffect, useRef, useState } from "react";
import {
  useHMSActions,
  useHMSStore,
  selectLocalPeer,
  selectCameraStreamByPeerID,
  selectPeerMetadata,
  selectDominantSpeaker,
  selectPeerAudioByID,
  selectIsPeerAudioEnabled,
  selectIsPeerVideoEnabled,
  selectPermissions
} from "@100mslive/react-sdk";

import { HMSVideoTrack } from "@100mslive/hms-video";
import { BsThreeDots } from "react-icons/bs"
import { MdPushPin, MdOutlinePersonOutline } from "react-icons/md"
import { HiOutlineHand } from "react-icons/hi"
import { HiUserRemove } from "react-icons/hi"
import { BiMicrophone, BiMicrophoneOff, BiVideoOff, BiVideo } from "react-icons/bi"

function VideoSpaces({ peer, islocal, pinned, setPinned }) {
  const hmsActions = useHMSActions();
  const videoRef = useRef(null);
  const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));
  const [dominantSpeaker, setDominantSpeaker] = useState()

  const hmsStore = useHMSStore(selectDominantSpeaker)
  const peerAudioLevel = useHMSStore(selectPeerAudioByID(hmsStore?.id))
  const metaData = useHMSStore(selectPeerMetadata(peer?.id));
  const level = useHMSStore(selectPeerAudioByID(peer.id)) || 0;

  const [menuOpen, setMenuOpen] = useState(false)
  // console.log(metaData?.isHandRaised)
  useEffect(() => {
    // console.log("audio level is ",peerAudioLevel)
    setDominantSpeaker(hmsStore)
  }, [hmsStore])

  useEffect(() => {
    (async () => {
      if (videoRef.current && videoTrack) {
        if (videoTrack.enabled) {
          await hmsActions.attachVideo(videoTrack.id, videoRef.current);
        } else {
          await hmsActions.detachVideo(videoTrack.id, videoRef.current);
        }
      }
    })();
  }, [videoTrack]);
  const localPeer = useHMSStore(selectLocalPeer);
  const stage = localPeer?.roleName === "stage";

  // console.log("peer is ",peer)
  // console.log(stage)
  // console.log(videoTrack)
  const audioEnabled = useHMSStore(selectIsPeerAudioEnabled(peer?.id))
  const videoEnabled = useHMSStore(selectIsPeerVideoEnabled(peer?.id))

  // const permissions = useHMSStore(selectPermissions(peer?.id))
  // console.log(permissions)

  return (
    <div className={`m-2 h-full my-auto`}>
      <div className={`grid relative`}>
        {videoEnabled ? (<video
          onClick={() => setMenuOpen(false)}
          ref={videoRef}
          autoPlay={true}
          playsInline
          muted={true}
          style={{
            boxShadow: `0px 0px ${level || 0 / 6}px #3d5afe`,
          }}
          className={`object-cover rounded-lg mt-2  shadow-lg 
           ${pinned?.status ? "h-full w-full" : "h-[250px]"}
           ${islocal ? "mirror" : ""}
          `}
          // ${peer?.id === dominantSpeaker?.id ? "drop-shadow-xl border-4 border-sky-300 transition-all ease-in-out" : ""}

        ></video>) : (

          <MdOutlinePersonOutline
            className={`object-cover rounded-lg mt-2  shadow-lg my-auto w-full ${pinned?.status ? "w-full h-[400px]" : "h-[250px]"}`}
          />
        )}

        <div className=" text-white font-medium justify-center text-lg flex uppercase text-center mt-2">
          {(localPeer?.id !== peer?.id) ? <h3>You</h3> : <h3>{peer.name}</h3>}
          <span className="m-2 my-auto text-yellow-400">{metaData?.isHandRaised && <HiOutlineHand />}</span>
        </div>

        {audioEnabled === false && (
          <div className="absolute right-0 top-0 mr-4 mt-5 rounded-full text-white p-1 text-xl bg-red-500">
            <span className=""><BiMicrophoneOff /></span>
          </div>)}

        {(localPeer?.id !== peer?.id) && (
          <div className="main__video absolute right-0 bottom-0 mb-10 mr-4 rounded-full text-white p-1">
            {menuOpen && (<div className="menu__video flex flex-col bg-white rounded-lg mb-6 p-2">
              <div className="text-black w-full flex cursor-pointer" onClick={() => setPinned({ status: !pinned?.status, peer: peer })}>
                <span className="my-auto mr-2"><MdPushPin /></span> {pinned?.status ? "Remove pin" : "Pin tile"}
              </div>
              <div className="text-black w-ful flex cursor-pointer">
                <span className="my-auto mr-2"> <HiUserRemove /></span>  Remove participant
              </div>
            </div>)}
            <div onClick={() => setMenuOpen(!menuOpen)} className="dots__video bg-slate-500 opacity-40 hover:opacity-100 hover:duration-200 hover:ease-in-out text-xl cursor-pointer  absolute right-0 bottom-0 rounded-full p-1">
              <BsThreeDots />
            </div>
          </div>)}
      </div>
    </div>
  );
}
export default VideoSpaces;
