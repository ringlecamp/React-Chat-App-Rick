import { combineReducers } from 'redux';
import user from './user';
import loading from './loading';
import chat from './chat';

export const USER_LOGOUT = "USER_LOGOUT"
export const userLogOut = () => ({
  type: USER_LOGOUT,
});

const appReducer = combineReducers({
  user,
  loading,
  chat
})

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer