import { createStore } from 'redux';

const initialState = () => JSON.parse(localStorage.getItem('stateBackup')) || {
  signedin: false,
  authorized: false,
  username: '',
};

const reducer = (state = initialState(), action) => {
  let newState;
  if (action.type === 'SIGNIN') {
    newState = { ...state, signedin: true, username: action.payload.username };
  }
  else if (action.type === 'SIGNOUT') {
    newState = { ...state, signedin: false, authorized: false };
  }
  else if (action.type === 'AUTHORIZE') {
    newState = { ...state, authorized: true };
  }
  else if (action.type === 'DEAUTHORIZE') {
    newState = { ...state, authorized: false };
  } else {
    newState = state;
  }
  localStorage.setItem('stateBackup', JSON.stringify(newState));
  return newState;
}

const store = createStore(reducer);

export default store;