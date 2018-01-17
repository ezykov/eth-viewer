import React, { Component } from 'react';
import SearchForm from './components/SearchForm';

class App extends Component {
  render() {
    return (
      <div className="App container-fluid">
        <header className="App-header">
          <h1 className="App-title">Super functional eth-token viewer</h1>
        </header>
        <SearchForm />
      </div>
    );
  }
}

export default App;
