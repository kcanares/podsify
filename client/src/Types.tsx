export interface MediaItem {
  title: string;
  artist: string;
  uri: string;
  imageUrl: string;
}

export interface MediaState {
  media: undefined | MediaItem;
  setMedia: React.Dispatch<React.SetStateAction<MediaItem | undefined>>;
}

export enum MediaType {
  EPISODE = "episode",
  PLAYLIST = "playlist",
}
