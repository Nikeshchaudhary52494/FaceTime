function Controls({ callId, setCallId, startVideo, callUser }) {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={startVideo}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start Video
        </button>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Enter User ID to Call"
            value={callId}
            onChange={(e) => setCallId(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded"
          />
          <button
            onClick={callUser}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Call
          </button>
        </div>
      </div>
    );
  }
  
  export default Controls;
  