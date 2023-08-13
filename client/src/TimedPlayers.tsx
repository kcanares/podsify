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

  const episodeIntervalLength = 900000; // 900000ms = 15min
  const replayBuffer = 5000; // 5000ms = 5sec
  const songIntervalCount = 3;

  const [episodePosition, setEpisodePosition] = useState<number>(0); // where playback has paused and should start in the next interval
  const [playlistPosition, setPlaylistPosition] = useState<number>(0);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);

  const playEpisode = () => {
    spotifyApi.play({
      uris: [episode.uri],
      position_ms: episodePosition,
    });
  };

  const playSongs = async () => {
    try {
      const res = await spotifyApi.getPlaylistTracks(playlist.id, {
        offset: playlistPosition,
        limit: songIntervalCount,
      });
      const trackUris = res.body.items
        .map((item) => item.track)
        .filter((track) => track !== undefined && track !== null)
        .map((track) => ({
          uri: track.uri,
          duration: track.duration_ms,
        }));

      setPlaylistTracks(trackUris);

      if (trackUris.length > 0) {
        addTracksToQueue(spotifyApi, trackUris);
        spotifyApi.skipToNext();
      }
    } catch (e) {
      console.error("Error fetching playlist tracks", e);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isEpisodePlaying) {
      playEpisode();
      intervalId = setTimeout(
        () => setIsEpisodePlaying(false),
        episodeIntervalLength
      );
      setEpisodePosition(
        (position) => position + episodeIntervalLength - replayBuffer
      );
    } else {
      playSongs();
      intervalId = setTimeout(
        () => setIsEpisodePlaying(true),
        getTracksDuration(playlistTracks)
      );
      setPlaylistPosition((position) => position + songIntervalCount);
    }

    return () => {
      clearTimeout(intervalId);
    };
  }, [isEpisodePlaying, episodeIntervalLength, playlistTracks]);

  return isEpisodePlaying ? (
    <p>episode is playling</p>
  ) : (
    <p>songs are playing</p>
  );
};

export default TimedPlayers;
