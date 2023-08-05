import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Media } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { MediaItem } from "../Types";
import MediaSearchResult from "../TrackSearchResult";
import SpotifyApiContext from "../SpotifyApiContext";
import { getSmallestImage } from "../utils";

const searchSpotifyPlaylists = ({
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
  spotifyApi.searchPlaylists(search).then((res) => {
    if (cancel || !res.body.playlists) return;
    const playlists: MediaItem[] = res.body.playlists.items.map((playlist) => {
      const smallestShowImage = getSmallestImage(playlist);
      return {
        creator: playlist.owner.display_name,
        title: playlist.name,
        uri: playlist.uri,
        imageUrl: smallestShowImage.url,
        id: playlist.id,
      };
    });
    setSearchResults(playlists);
  });
};

export const PlaylistSelector = ({
  setPlaylist,
}: {
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | undefined>>;
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
    searchSpotifyPlaylists({ spotifyApi, cancel, search, setSearchResults });
  }, [search]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <>
        <Form.Control
          type="search"
          placeholder={"search playlists"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {searchResults.map((media) => (
            <MediaSearchResult
              media={media}
              key={media.uri}
              setMedia={setPlaylist}
            />
          ))}
        </div>
      </>
    </Container>
  );
};

export default PlaylistSelector;
