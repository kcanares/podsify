export interface MediaItem {
  title: string;
  uri: string;
  imageUrl: string;
  creator?: string;
  id?: string;
}

export interface MediaState {
  media: undefined | MediaItem;
  setMedia: React.Dispatch<React.SetStateAction<MediaItem | undefined>>;
}

export enum MediaType {
  EPISODE = "episode",
  PLAYLIST = "playlist",
}
