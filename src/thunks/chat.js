import { chatApi } from '../__fake-api__/chat-api';
import { slice } from '../slices/chat';

export const getContacts = () => async (dispatch) => {
  const response = await chatApi.getContacts({});

  dispatch(slice.actions.getContacts(response));
};

export const getThreads = () => async (dispatch) => {
  const response = await chatApi.getThreads();

  dispatch(slice.actions.getThreads(response));
};

export const getThread = (params) => async (dispatch) => {
  const response = await chatApi.getThread(params);

  dispatch(slice.actions.getThread(response));

  return response?.id;
};

export const markThreadAsSeen = (params) => async (dispatch) => {
  await chatApi.markThreadAsSeen(params);

  dispatch(slice.actions.markThreadAsSeen(params.threadId));
};

export const setActiveThread = (params) => (dispatch) => {
  dispatch(slice.actions.setActiveThread(params.threadId));
};

export const addMessage = (params) => async (dispatch) => {
  const response = await chatApi.addMessage(params);

  dispatch(slice.actions.addMessage(response));

  return response.threadId;
};
