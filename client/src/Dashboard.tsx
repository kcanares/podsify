import React, { useState, useEffect } from "react";
import useAuth from "./useAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { MediaItem, MediaType } from "./Types";
import MediaSearchResult from "./TrackSearchResult";
import MediaSelector from "./MediaSelector";

const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
});

const getSmallestImage = (
  item: SpotifyApi.EpisodeObjectSimplified | SpotifyApi.PlaylistObjectSimplified
) => {
  return item.images.reduce((smallest, image) => {
    if (image.height && smallest.height && image.height < smallest.height)
      return image;
    return smallest;
  }, item.images[0]);
};

export const Dashboard = ({ code }: { code: string }) => {
  const accessToken = useAuth(code);
  const [episode, setEpisode] = useState<MediaItem>();
  const [playlist, setPlaylist] = useState<MediaItem>();

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <MediaSelector
        spotifyApi={spotifyApi}
        media={episode}
        setMedia={setEpisode}
        mediaType={MediaType.EPISODE}
      />
      <MediaSelector
        spotifyApi={spotifyApi}
        media={playlist}
        setMedia={setPlaylist}
        mediaType={MediaType.PLAYLIST}
      />
    </Container>
  );
};
