import React, { Component } from "react";


class SearchTrackForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      SearchTrackQuery: ""
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.SearchTrackQuery) {
      this.props.onSearch(this.state.SearchTrackQuery);
    }
  };

  onSearchTrackQueryChange = (event) => {
    this.setState({
      SearchTrackQuery: event.target.value
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="trackName">
            What Track do you want to search for?
          </label>
          <input
            type="text"
            value={this.state.SearchTrackQuery}
            onChange={this.onSearchTrackQueryChange}
            className="form-control"
            id="trackName"
            aria-describedby="trackHelper"
            placeholder="Search for track..."
          />
          <small id="trackHelper" className="form-text text-muted">
            Everyone has a favorite track; which do you want to search for?
          </small>
        </div>
        <button type="submit" className="btn btn-primary">
          Search for Tracks
        </button>
      </form>
    );
  }
}

export default SearchTrackForm;
