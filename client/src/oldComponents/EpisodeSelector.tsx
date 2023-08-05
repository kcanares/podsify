import React, { useState, useEffect, useContext } from "react";
import useAuth from "../useAuth";
import { Container, Form, Media } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { MediaItem, MediaType } from "../Types";
import MediaSearchResult from "../TrackSearchResult";
import SpotifyApiContext from "../SpotifyApiContext";
import { getSmallestImage } from "../utils";

const searchSpotifyEpisodes = ({
  spotifyApi,
  cancel,
  search,
  setSearchResults,
}: {
  spotifyApi: SpotifyWebApi;
  cancel: boolean;
  search: string;
  setSearchResults: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}) => {
  spotifyApi.searchEpisodes(search).then((res) => {
    if (cancel || !res.body.episodes) return;
    const episodes: MediaItem[] = res.body.episodes.items.map((show) => {
      const smallestShowImage = getSmallestImage(show);
      return {
        // artist: "", // TODO: update spotify API wrapper to a better one (or DIY) to get publisher
        title: show.name,
        uri: show.uri,
        imageUrl: smallestShowImage.url,
        id: show.id,
      };
    });
    setSearchResults(episodes);
  });
};

export const EpisodeSelector = ({
  setEpisode,
}: {
  setEpisode: React.Dispatch<React.SetStateAction<MediaItem | undefined>>;
}) => {
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);

  const spotifyApi = useContext(SpotifyApiContext);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }

    let cancel = false;
    searchSpotifyEpisodes({ spotifyApi, cancel, search, setSearchResults });
  }, [search]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <>
        <Form.Control
          type="search"
          placeholder={"search episodes"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {searchResults.map((media) => (
            <MediaSearchResult
              media={media}
              key={media.uri}
              setMedia={setEpisode}
            />
          ))}
        </div>
      </>
    </Container>
  );
};

export default EpisodeSelector;
