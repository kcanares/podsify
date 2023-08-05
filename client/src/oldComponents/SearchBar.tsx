import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Media } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { MediaItem, Playlist } from "../Types";
import MediaSearchResult from "../TrackSearchResult";
import SpotifyApiContext from "../SpotifyApiContext";
import { getSmallestImage } from "../utils";

const Searchbar = ({
  mediaType,
  searchResults,
  setSearch,
}: {
  mediaType: string;
  searchResults: MediaItem[];
  setSearch: 
}) => {
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
  </Container>;
};
