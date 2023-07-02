// import React, { useState, useEffect } from "react"
// import useAuth from "./useAuth"
// import Player from "./Player"
// import TrackSearchResult from "./TrackSearchResult"
// import { Container, Form } from "react-bootstrap"
// import SpotifyWebApi from "spotify-web-api-node"
// import axios from "axios"

// const spotifyApi = new SpotifyWebApi({
//   clientId: "8b945ef10ea24755b83ac50cede405a0",
// })

// interface Track {
//   title: string;
//   artist: string;
// }

// interface Show extends Track {
//   uri: string;
//   showUrl: string;
// }

// interface DashboardProps {
//   code: string;
// }

// export const Dashboard =  ({code}: {code: string}) => {
//   const accessToken = useAuth(code)
//   const [search, setSearch] = useState("")
//   const [searchResults, setSearchResults] = useState<Show[]>([])
//   const [playingTrack, setPlayingTrack] = useState<Track>()
//   const [lyrics, setLyrics] = useState("")

//   function chooseTrack(track: Track) {
//     setPlayingTrack(track)
//     setSearch("")
//     setLyrics("")
//   }

//   useEffect(() => {
//     if (!playingTrack) return

//     axios
//       .get("http://localhost:3001/lyrics", {
//         params: {
//           track: playingTrack.title,
//           artist: playingTrack.artist,
//         },
//       })
//       .then(res => {
//         setLyrics(res.data.lyrics)
//       })
//   }, [playingTrack])

//   useEffect(() => {
//     if (!accessToken) return
//     spotifyApi.setAccessToken(accessToken)
//   }, [accessToken])

//   useEffect(() => {
//     if (!search) return setSearchResults([])
//     if (!accessToken) return

//     let cancel = false
//     spotifyApi.searchShows(search).then(res => {
//       if (cancel || !res.body.shows) return;

//       const shows: Show[] =  res.body.shows.items.map(show => {
//           const smallestShowImage = show.images.reduce(
//             (smallest, image) => {
//               if (image.height && smallest.height
//                 && image.height < smallest.height) return image
//               return smallest
//             },
//             show.images[0]
//           )

//           return {
//             artist: show.publisher,
//             title: show.name,
//             uri: show.uri,
//             showUrl: smallestShowImage.url,
//           }
//         })
//       setSearchResults(shows);
//       }
//     )
//     return () => {
//       cancel = true;
//       return undefined;
//     }
//   }, [search, accessToken])

//   return (
//     <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
//       <Form.Control
//         type="search"
//         placeholder="Search Songs/Artists"
//         value={search}
//         onChange={e => setSearch(e.target.value)}
//       />
//       <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
//         {/* {searchResults.map(track => (
//           <TrackSearchResult
//             track={track}
//             key={track.uri}
//             chooseTrack={chooseTrack}
//           />
//         ))} */}
//         {searchResults.length === 0 && (
//           <div className="text-center" style={{ whiteSpace: "pre" }}>
//             {lyrics}
//           </div>
//         )}
//       </div>
//       {/* <div>
//         <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
//       </div> */}
//     </Container>
//   )
// }
