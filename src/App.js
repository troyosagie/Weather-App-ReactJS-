import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import InputComponent from './components/InputComponent'
import Temperature from './components/Temperature'

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={InputComponent} />
            <Route path="/temperature" component={Temperature} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
