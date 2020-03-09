import {REMOVE_ERROR} from "../reducers/errors";


export function clearError() {
  return {
    type: REMOVE_ERROR
  };
}
