import { useState, useEffect, useContext } from "react";
import { MediaItem } from "./Types";
import EpisodePlayer from "./EpisodePlayer";
import SpotifyApiContext from "./SpotifyApiContext";

export const TimedPlayers = ({
  episode,
  playlist,
}: {
  episode: MediaItem;
  playlist: MediaItem;
}) => {
  const [isEpisodePlaying, setIsEpisodePlaying] = useState<boolean>(true);
  const spotifyApi = useContext(SpotifyApiContext);

  useEffect(() => {
    // first play through before the interval switching
    spotifyApi.play({ uris: [episode.uri] });
    setIsEpisodePlaying(true);

    const timer = setInterval(async () => {
      setIsEpisodePlaying((playState) => !playState);

      if (isEpisodePlaying) {
        spotifyApi.play({ uris: [episode.uri] });
      } else {
        spotifyApi.pause();
      }
    }, 10000); // 60,000 milliseconds = 1 minute

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [episode, playlist]);

  return isEpisodePlaying ? <EpisodePlayer episode={episode} /> : <p>songs</p>;
};

export default TimedPlayers;
