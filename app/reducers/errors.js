
export const ADD_ERROR = 'ADD_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';

export default function  errors(state = "", action) {
  switch (action.type) {

    case ADD_ERROR:
      return action.payload;

    case REMOVE_ERROR:
      return "";

    default:
      return state;
  }
}
