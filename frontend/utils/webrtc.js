export const initializePeerConnection = (stream, callId, connectionRef) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      connectionRef.current.send(
        JSON.stringify({
          type: 'candidate',
          to: callId,
          candidate: event.candidate,
        })
      );
    }
  };

  return peerConnection;
};

export const handleSocketMessage = async (
  message,
  peerConnectionRef,
  connectionRef,
  remoteVideoRef
) => {
  const data = JSON.parse(message.data);

  if (data.type === 'offer') {
    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(data.offer)
    );
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    connectionRef.current.send(
      JSON.stringify({
        type: 'answer',
        to: data.from,
        answer,
      })
    );
  } else if (data.type === 'answer') {
    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
  } else if (data.type === 'candidate') {
    await peerConnectionRef.current.addIceCandidate(
      new RTCIceCandidate(data.candidate)
    );
  }
};
