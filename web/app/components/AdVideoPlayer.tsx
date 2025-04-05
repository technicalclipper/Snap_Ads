"use client";

import { useEffect, useRef, useState } from "react";

interface AdVideoPlayerProps {
  videoUrl: string;
}

export default function AdVideoPlayer({ videoUrl }: AdVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [watchStartTime, setWatchStartTime] = useState<number | null>(null);
  const [totalWatched, setTotalWatched] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime > maxWatchedTime) {
        setMaxWatchedTime(video.currentTime);
      }
    };

    const handleSeeking = () => {
      if (video.currentTime > maxWatchedTime + 0.5) {
        video.currentTime = maxWatchedTime;
      }
    };

    const handlePlay = () => {
      setWatchStartTime(Date.now());
    };

    const handlePause = () => {
      if (watchStartTime) {
        const watched = (Date.now() - watchStartTime) / 1000;
        setTotalWatched(prev => prev + watched);
        setWatchStartTime(null);
      }
    };

    const handleEnded = () => {
      handlePause();

      const duration = video.duration;
      const watchedRatio = totalWatched / duration;

      if (watchedRatio >= 0.98) {
        alert("✅ Full ad watched! You'll be reimbursed.");
        // TODO: Notify backend
      } else {
        alert("⚠️ You must watch the full ad without skipping.");
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [maxWatchedTime, watchStartTime, totalWatched]);

  return (
    <div className="max-w-xl mx-auto">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        className="w-full rounded shadow"
      />
    </div>
  );
}
