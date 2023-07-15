import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import SpotifyWebApi from "spotify-web-api-node";
import { MediaItem } from "./Types";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const EpisodePlayer = ({ episode }: { episode: MediaItem }) => {
  const [play, setPlay] = useState(false);

  // spotifyApi.play({i})
  // play 15 minutes of podcast
  // play 2 songs
  // play 15 minutes

  // if both chosen
  // if (!episodeFinished && !episodeHitThreshold) playEpisode(true)
  // <PlayEpisode isEpisodePlaying setIs>
  // <PlaylistPlayer isEpisodePlaying>

  // PlayEpisode:
  // if playepisode
  // play
  // if success
  // wait 15
  // if get playback > playbacktimeoffset + 15
  // pause. set playEpisode false. set playbacktime offset
  //
  // await setTimeout(900000);   // wait 15 minutes
  return <>mediaItem[0].name</>;
};

export default EpisodePlayer;
