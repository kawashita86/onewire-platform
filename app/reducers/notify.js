
export const ADD_NOTIFY = 'ADD_NOTIFY';
export const REMOVE_NOTIFY = 'REMOVE_NOTIFY';

export default function  notify(state = "", action) {
  switch (action.type) {

    case ADD_NOTIFY:
      return action.payload;

    case REMOVE_NOTIFY:
      return "";

    default:
      return state;
  }
}
