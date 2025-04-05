"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/app/components/Card";

interface AdVideoPlayerProps {
  videoUrl: string;
  onWatchComplete?: () => void;
}

export default function AdVideoPlayer({
  videoUrl,
  onWatchComplete,
}: AdVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [watchStartTime, setWatchStartTime] = useState<number | null>(null);
  const [totalWatched, setTotalWatched] = useState(0);
  const [watchStatus, setWatchStatus] = useState<
    "none" | "incomplete" | "complete"
  >("none");

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
        setTotalWatched((prev) => prev + watched);
        setWatchStartTime(null);
      }
    };

    const handleEnded = () => {
      handlePause();

      const duration = video.duration;
      const watchedRatio = totalWatched / duration;

      if (watchedRatio >= 0.98) {
        setWatchStatus("complete");
        onWatchComplete?.();
      } else {
        setWatchStatus("incomplete");
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
  }, [maxWatchedTime, watchStartTime, totalWatched, onWatchComplete]);

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          className="w-full h-full"
        />
      </div>

      <div className="space-y-4 p-4">
        <p className="text-sm text-gray-500">
          Watch the entire video without skipping to record your interaction
        </p>

        {watchStatus === "complete" && (
          <div className="bg-green-100 text-green-800 p-4 rounded-md">
            ✓ Watch recorded successfully! You'll be reimbursed.
          </div>
        )}

        {watchStatus === "incomplete" && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
            ⚠️ You must watch the full ad without skipping to receive
            reimbursement.
          </div>
        )}
      </div>
    </Card>
  );
}
