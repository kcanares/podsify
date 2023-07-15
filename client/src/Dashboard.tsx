import React, { useState, useEffect, createContext, useContext } from "react";
import useAuth from "./useAuth";
import { Container, Form } from "react-bootstrap";
import { MediaItem, MediaType } from "./Types";
import MediaSelector from "./MediaSelector";
import TimedPlayers from "./TimedPlayers";
import SpotifyApiContext from "./SpotifyApiContext";

const PlaylistEpisodeSearchbars = ({
  setEpisode,
  setPlaylist,
}: {
  setEpisode: React.Dispatch<React.SetStateAction<MediaItem | undefined>>;
  setPlaylist: React.Dispatch<React.SetStateAction<MediaItem | undefined>>;
}) => (
  <>
    <MediaSelector setMedia={setEpisode} mediaType={MediaType.EPISODE} />
    <MediaSelector setMedia={setPlaylist} mediaType={MediaType.PLAYLIST} />
  </>
);

export const Dashboard = ({ code }: { code: string }) => {
  const accessToken = useAuth(code);
  const [episode, setEpisode] = useState<MediaItem>();
  const [playlist, setPlaylist] = useState<MediaItem>();

  const spotifyApi = useContext(SpotifyApiContext);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      {!episode || !playlist ? (
        <PlaylistEpisodeSearchbars
          setEpisode={setEpisode}
          setPlaylist={setPlaylist}
        />
      ) : (
        <TimedPlayers episode={episode} playlist={playlist} />
      )}
    </Container>
  );
};
