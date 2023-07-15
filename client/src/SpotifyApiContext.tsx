import { createContext } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const SpotifyApiContext = createContext(new SpotifyWebApi());

export default SpotifyApiContext;
