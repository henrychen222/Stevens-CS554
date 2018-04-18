import React, { Component } from "react";
import SearchTrackForm from "./SearchTrackForm";
import TrackListContainer from "./TrackListContainer";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: ""
    };
  }

  on123Search = (searchQuery) => {
    this.setState({
      track: searchQuery
    });
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <SearchTrackForm onSearch={this.on123Search} />
            </div>
            <div className="col-6">
              <TrackListContainer
                track={this.state.track}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       superHero: "",
//       orderById: false
//     };
//   }

//   onSearch = (searchQuery, orderById) => {
//     this.setState({
//       superHero: searchQuery,
//       orderById: orderById
//     });
//   };

//   render() {
//     return (
//       <div className="App">
//         <div className="container">
//           <div className="row">
//             <div className="col-6">
//               <SearchForm onSearch={this.onSearch} />
//             </div>
//             <div className="col-6">
//               <SuperHeroListContainer
//                 orderById={this.state.orderById}
//                 superHero={this.state.superHero}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }



export default App;
