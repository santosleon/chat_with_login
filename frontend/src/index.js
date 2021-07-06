import 'bootstrap/dist/css/bootstrap.min.css';
import './style/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Signin from './components/signin';
import Recover from './components/recover';
import Signup from './components/signup';
import Token from './components/token';
import Home from './components/home';
import { Provider } from 'react-redux';
import store from './store/store';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route path="/signin" exact component={Signin} />
          <Route path="/recover" exact component={Recover} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/token" exact component={Token} />
          <Route path="/home" exact component={Home} />
          <Redirect to='/home' />
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
