import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'typeface-roboto';
import Icon from '@material-ui/core/Icon';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>

    );
  }
}

export default App;
