import {ADD_NOTIFY, REMOVE_NOTIFY} from "../reducers/notify";


export function addNotify(notify) {
  return async (dispatch) => {
    setTimeout(() => {
      dispatch({type: REMOVE_NOTIFY})
    }, 2500)
    dispatch({
      type: ADD_NOTIFY,
      payload: notify
    });
  }
}
