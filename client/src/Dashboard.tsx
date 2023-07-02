import React, { useState, useEffect } from "react";
import useAuth from "./useAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
});

interface MediaItem {
  title: string;
  artist: string;
  uri: string;
  imageUrl: string;
}

export const Dashboard = ({ code }: { code: string }) => {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }

    if (!accessToken) {
      return;
    }

    let cancel = false;
    spotifyApi.searchEpisodes(search).then((res) => {
      if (cancel || !res.body.episodes) return;
      const shows: MediaItem[] = res.body.episodes.items.map((show) => {
        const smallestShowImage = show.images.reduce((smallest, image) => {
          if (image.height && smallest.height && image.height < smallest.height)
            return image;
          return smallest;
        }, show.images[0]);
        return {
          artist: "",
          title: show.name,
          uri: show.uri,
          imageUrl: smallestShowImage.url,
        };
      });
      setSearchResults(shows);
    });
  }, [search, accessToken]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="search episode"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Container>
  );
};
