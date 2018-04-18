import React, { Component } from "react";
import { searchForTracks } from "./utility/SpotifyApi";

import TrackList from "./TrackList";

class TrackListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listOfMatchingTracks: []
    };
  }

  componentDidMount = async function(props) {
    if (this.props.track) {
      const matches = await searchForTracks(this.props.track);
      this.setState({
        listOfMatchingTracks: matches
      });
    }
  };

  componentWillReceiveProps = async function (newProps) {
    if (newProps.track && newProps.track !== this.props.track) {
      const matches = await searchForTracks(newProps.track);

      this.setState({
        listOfMatchingTracks: matches
      });
    }
  };

  render() {
    if (!this.props.track) {
      return <h1>Search for someone</h1>;
    }

    const tracks = [...this.state.listOfMatchingTracks];

    return <TrackList trackList={tracks} />;
  }
}

export default TrackListContainer;
