import React, { forwardRef } from 'react';

const Video = forwardRef(({ isLocal }, ref) => {
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={isLocal}
      className="w-72 h-48 bg-black"
    ></video>
  );
});

export default Video;
