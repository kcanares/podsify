import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import { Dashboard } from "./Dashboard";
import SpotifyApiContext from "./SpotifyApiContext";
import SpotifyWebApi from "spotify-web-api-node";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const spotifyApi = new SpotifyWebApi({
    clientId: "8b945ef10ea24755b83ac50cede405a0",
  });

  return code ? (
    <SpotifyApiContext.Provider value={spotifyApi}>
      <Dashboard code={code} />
    </SpotifyApiContext.Provider>
  ) : (
    <Login />
  );
}

export default App;
