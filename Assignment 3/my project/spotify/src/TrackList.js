import React, { Component } from "react";
import TrackListEntry from "./TrackListEntry";
import AudioPlaying from "./AudioPlaying";

class TrackList extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.trackList.length} results</h1>
        <ul>
          <li>
            {this.props.trackList.map(track => {
              return <AudioPlaying track={track} key={track.id} />;
            })}
            {this.props.trackList.map(track => {
              return <TrackListEntry track={track} key={track.id} />;
            })}
          </li>
        </ul>
      </div>
    );
  }
}

export default TrackList;
