import React, { Component } from "react";
import { searchForSuperheroes } from "./utility/marvelApi";

import SuperHeroList from "./SuperHeroList";

class SuperHeroListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listOfMatchingHeroes: []
    };
  }

  componentDidMount = async props => {
    if (this.props.superHero) {
      const matches = await searchForSuperheroes(this.props.superHero);
      this.setState({
        listOfMatchingHeroes: matches
      });
    }
  };

  componentWillReceiveProps = async newProps => {
    if (newProps.superHero && newProps.superHero !== this.props.superHero) {
      const matches = await searchForSuperheroes(newProps.superHero);

      this.setState({
        listOfMatchingHeroes: matches
      });
    }
  };

  render() {
    if (!this.props.superHero) {
      return <h1>Search for someone</h1>;
    }

    const heroes = [...this.state.listOfMatchingHeroes];

    return <SuperHeroList heroList={heroes} />;
  }
}

export default SuperHeroListContainer;
