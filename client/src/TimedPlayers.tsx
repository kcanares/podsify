import { useState, useEffect, useContext } from "react";
import { MediaItem } from "./Types";
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
  const [episodePosition, setEpisodePosition] = useState<number>(0); // where playback has paused and should start in the next interval
  const [playlistPosition, setPlaylistPosition] = useState<number>(0);
  const [playlistTracks, setPlaylistTracks] = useState<string[]>();

  async function requestNextPlaylistTrackUris(
    playlistPosition: number,
    songsIntervalCount: number
  ) {
    const res = await spotifyApi.getPlaylistTracks(playlist.id, {
      offset: playlistPosition,
      limit: songsIntervalCount,
    });
    const trackUris: string[] = res.body.items.flatMap(
      (item) => item.track?.uri || []
    );

    setPlaylistTracks(trackUris);
  }

  useEffect(() => {
    const timer = setInterval(
      () => setIsEpisodePlaying((prevState) => !prevState),
      episodeIntervalLength
    );

    if (isEpisodePlaying) {
      spotifyApi.play({
        uris: [episode.uri],
        position_ms: episodePosition,
      });
      // add songs to queue
      requestNextPlaylistTrackUris(playlistPosition, songsIntervalCount);
      // calculate how long these episodes will take
    } else {
      setEpisodePosition(episodePosition + episodeIntervalLength);
      // play next items on queue
      // set interval to queue length
      spotifyApi.play({
        context_uri: playlist.uri,
        // offset: { position: episodePosition },
      });
    }

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [isEpisodePlaying, playlistTracks]);

  return isEpisodePlaying ? <p>episode</p> : <p>songs</p>;
};

export default TimedPlayers;
