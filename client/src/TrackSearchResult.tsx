import React from "react";
import { MediaItem } from "./Types";

export default function MediaSearchResult({
  media,
  setMedia,
}: {
  media: MediaItem;
  setMedia: React.Dispatch<React.SetStateAction<MediaItem | undefined>>;
}) {
  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={() => setMedia(media)}
    >
      <img src={media.imageUrl} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
        <div>{media.title}</div>
        <div className="text-muted">{media.artist}</div>
      </div>
    </div>
  );
}
