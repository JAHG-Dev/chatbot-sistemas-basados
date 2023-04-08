import { combineReducers } from '@reduxjs/toolkit';
import { reducer as chatReducer } from '../slices/chat';

export const rootReducer = combineReducers({
  chat: chatReducer
});
