import React, { useState, useEffect } from "react";
import useAuth from "./useAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { MediaItem, MediaType } from "./Types";
import MediaSearchResult from "./TrackSearchResult";
import MediaSelector from "./MediaSelector";
import EpisodePlayer from "./EpisodePlayer";

const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
});

const PlaylistEpisodeSearchbars = ({
  setEpisode,
  setPlaylist,
}: {
  setEpisode: React.Dispatch<React.SetStateAction<MediaItem | undefined>>;
  setPlaylist: React.Dispatch<React.SetStateAction<MediaItem | undefined>>;
}) => (
  <>
    <MediaSelector
      spotifyApi={spotifyApi}
      setMedia={setEpisode}
      mediaType={MediaType.EPISODE}
    />
    <MediaSelector
      spotifyApi={spotifyApi}
      setMedia={setPlaylist}
      mediaType={MediaType.PLAYLIST}
    />
  </>
);

const PlaylistEpisodePlayers = ({
  isEpisodePlaying,
}: {
  isEpisodePlaying: boolean;
}) => (isEpisodePlaying ? <p>episode</p> : <p>songs</p>);

export const Dashboard = ({ code }: { code: string }) => {
  const accessToken = useAuth(code);
  const [episode, setEpisode] = useState<MediaItem>();
  const [playlist, setPlaylist] = useState<MediaItem>();
  const [isEpisodePlaying, setIsEpisodePlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

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

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      {!episode || !playlist ? (
        <PlaylistEpisodeSearchbars
          setEpisode={setEpisode}
          setPlaylist={setPlaylist}
        />
      ) : (
        <PlaylistEpisodePlayers isEpisodePlaying={isEpisodePlaying} />
      )}
    </Container>
  );
};
