import React from "react";

function TrackListEntry({ track }) {
  /* 
     1. the track title
     2. the artist name
     3. a link to the artist
     4. a photo associated with the track (if one exists)
     5. popularity
     6. the name of the album
     7. a link to the album
  */
  return <ul>
    <li>Track Title: {track.name}</li>
    <li>Artist Name: {track.artists[0].name}</li>
    <li>A Link to Artist: {track.artists[0].href}</li>
    <li>a photo associated with the track: {track.album.images[0].url}</li>
    <li>Popularity: {track.popularity}</li>
    <li>Album Name: {track.album.name}</li>
    <li>A Link to Album: {track.album.href}</li>
    <li>------------------------------------------------------------------</li>
  </ul>;
  
}

export default TrackListEntry;
