import React, { useState, useEffect } from "react";
import { MediaItem } from "./Types";
import EpisodePlayer from "./EpisodePlayer";

export const TimedPlayers = ({
  episode,
  playlist,
}: {
  episode: MediaItem;
  playlist: MediaItem;
}) => {
  const [isEpisodePlaying, setIsEpisodePlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!episode && !playlist) return;

    // Toggle between components every minute
    const timer = setInterval(() => {
      setIsEpisodePlaying((prevState) => !prevState);
    }, 10000); // 60,000 milliseconds = 1 minute

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [episode, playlist]);

  return isEpisodePlaying ? <EpisodePlayer episode={episode} /> : <p>songs</p>;
};

export default TimedPlayers;
