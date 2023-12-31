import React, { useState, useEffect, useContext } from "react";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { MediaItem, MediaType } from "./Types";
import MediaSearchResult from "./TrackSearchResult";
import SpotifyApiContext from "./SpotifyApiContext";

const getSmallestImage = (
  item: SpotifyApi.EpisodeObjectSimplified | SpotifyApi.PlaylistObjectSimplified
) => {
  return item.images.reduce((smallest, image) => {
    if (image.height && smallest.height && image.height < smallest.height)
      return image;
    return smallest;
  }, item.images[0]);
};

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
        // artist: "", // TODO: update the wrapper to get show publisher
        title: show.name,
        uri: show.uri,
        imageUrl: smallestShowImage.url,
        id: show.id,
      };
    });
    setSearchResults(episodes);
  });
};

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
        id: playlist.id,
        title: playlist.name,
        uri: playlist.uri,
        imageUrl: smallestShowImage.url,
      };
    });
    setSearchResults(playlists);
  });
};

export const MediaSelector = ({
  setMedia,
  mediaType,
}: {
  setMedia: React.Dispatch<React.SetStateAction<MediaItem | undefined>>;
  mediaType: MediaType;
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

    if (mediaType === MediaType.EPISODE) {
      searchSpotifyEpisodes({ spotifyApi, cancel, search, setSearchResults });
    } else if (mediaType === MediaType.PLAYLIST) {
      searchSpotifyPlaylists({ spotifyApi, cancel, search, setSearchResults });
    }
  }, [search, spotifyApi, mediaType]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <>
        <Form.Control
          type="search"
          placeholder={"search " + mediaType}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {searchResults.map((media) => (
            <MediaSearchResult
              media={media}
              key={media.uri}
              setMedia={setMedia}
            />
          ))}
        </div>
      </>
    </Container>
  );
};

export default MediaSelector;
