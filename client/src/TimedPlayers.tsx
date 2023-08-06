import { useState, useEffect, useContext } from "react";
import { MediaItem } from "./Types";
import SpotifyApiContext from "./SpotifyApiContext";
import SpotifyWebApi from "spotify-web-api-node";

async function addTracksToQueue(spotifyApi: SpotifyWebApi, tracks: Track[]) {
  tracks.map(async (track) => {
    try {
      await spotifyApi.addToQueue(track.uri);
    } catch (e) {
      console.error(e);
    }
  });
}

function getTracksDuration(tracks: Track[]) {
  return tracks.reduce(
    (currDuration, nextTrack) => currDuration + nextTrack.duration,
    0
  );
}

type Track = {
  uri: string;
  duration: number;
};

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
  const songIntervalLength = 1;
  const [episodePosition, setEpisodePosition] = useState<number>(0); // where playback has paused and should start in the next interval
  const [playlistPosition, setPlaylistPosition] = useState<number>(0);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [intervalDuration, setIntervalDuration] = useState<number>(0);

  async function requestNextPlaylistTrackUris(
    playlistPosition: number,
    songsIntervalCount: number
  ) {
    const res = await spotifyApi.getPlaylistTracks(playlist.id, {
      offset: playlistPosition,
      limit: songsIntervalCount,
    });
    const trackUris: Track[] = res.body.items.flatMap((item) =>
      item.track === undefined || item.track === null
        ? []
        : {
            uri: item.track.uri,
            duration: item.track.duration_ms,
          }
    );

    setPlaylistTracks(trackUris);
  }

  useEffect(() => {
    if (isEpisodePlaying) {
      spotifyApi.play({
        uris: [episode.uri],
        position_ms: episodePosition,
      });
      setTimeout(() => setIsEpisodePlaying(false), episodeIntervalLength);
      setEpisodePosition((position) => position + episodeIntervalLength);
    } else {
      // add songs to queue
      requestNextPlaylistTrackUris(playlistPosition, songIntervalLength);
      if (playlistTracks !== undefined)
        addTracksToQueue(spotifyApi, playlistTracks);
      else console.error("playlistTracks are undefined");

      spotifyApi.skipToNext();
      const tracksDuration = getTracksDuration(playlistTracks);
      console.log(tracksDuration);
      setTimeout(() => {
        setIsEpisodePlaying(true);
      }, tracksDuration);
      setPlaylistPosition((position) => position + songIntervalLength);
    }

    return () => {};
  }, [isEpisodePlaying]);

  return isEpisodePlaying ? <p>episode</p> : <p>songs</p>;
};

export default TimedPlayers;
