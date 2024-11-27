import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import UserInfo from './components/UserInfo';
import Video from './components/Video';
import Controls from './components/Controls';
import { initializePeerConnection, handleSocketMessage } from '../utils/webrtc';
import { SERVER_URL } from '../config';

function App() {
  const [userId, setUserId] = useState('');
  const [callId, setCallId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const connectionRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    setUserId(uuidv4());
  }, []);

  const connectSocket = () => {
    connectionRef.current = new WebSocket(SERVER_URL);

    connectionRef.current.onopen = () => {
      setIsConnected(true);
      connectionRef.current.send(JSON.stringify({ type: 'join', userId }));
    };

    connectionRef.current.onmessage = (message) =>
      handleSocketMessage(
        message,
        peerConnectionRef,
        connectionRef,
        remoteVideoRef
      );
  };

  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localVideoRef.current.srcObject = stream;

    peerConnectionRef.current = initializePeerConnection(
      stream,
      callId,
      connectionRef
    );

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  const callUser = async () => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    connectionRef.current.send(
      JSON.stringify({
        type: 'offer',
        to: callId,
        from: userId,
        offer,
      })
    );
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Video Call App</h1>

      {!isConnected && (
        <button
          onClick={connectSocket}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect to Signaling Server
        </button>
      )}

      {isConnected && <UserInfo userId={userId} />}

      <div className="flex gap-4 mb-4">
        <Video ref={localVideoRef} isLocal />
        <Video ref={remoteVideoRef} />
      </div>

      <Controls
        callId={callId}
        setCallId={setCallId}
        startVideo={startVideo}
        callUser={callUser}
      />
    </div>
  );
}

export default App;
