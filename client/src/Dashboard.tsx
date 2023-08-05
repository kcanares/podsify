import { useState, useEffect, useContext } from "react";
import useAuth from "./useAuth";
import { Container } from "react-bootstrap";
import { MediaItem, MediaType } from "./Types";
import MediaSelector from "./MediaSelector";
import TimedPlayers from "./TimedPlayers";
import SpotifyApiContext from "./SpotifyApiContext";

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
      {episode ? null : (
        <MediaSelector setMedia={setEpisode} mediaType={MediaType.EPISODE} />
      )}
      {playlist ? null : (
        <MediaSelector setMedia={setPlaylist} mediaType={MediaType.PLAYLIST} />
      )}
      {episode != undefined && playlist != undefined ? (
        <TimedPlayers episode={episode} playlist={playlist} />
      ) : null}
    </Container>
  );
};
