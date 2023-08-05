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
  const episodeIntervalLength = 10000;
  const songsIntervalCount = 3;

  useEffect(() => {
    // first play through before the interval switching
    spotifyApi.play({ uris: [episode.uri] });
    let episodePosition = 0; // where playback has paused and should start in the next interval
    let isEpisode = true;

    const timer = setInterval(async () => {
      isEpisode = !isEpisode;
      console.log(isEpisodePlaying);
      if (isEpisode) {
        spotifyApi.play({
          uris: [episode.uri],
          position_ms: episodePosition,
        });
        // add songs to queue
        // calculate how long these episodes will take
      } else {
        episodePosition += episodeIntervalLength;
        // play next items on queue
        // set interval to queue length
        spotifyApi.play({
          context_uri: playlist.uri,
          // offset: { position: episodePosition },
        });
        setIsEpisodePlaying(isEpisode);
      }
    }, episodeIntervalLength);

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [episode, playlist]);

  return isEpisodePlaying ? <EpisodePlayer episode={episode} /> : <p>songs</p>;
};

export default TimedPlayers;
