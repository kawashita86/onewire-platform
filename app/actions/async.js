import {IDLE, LOADED, LOADING} from "../reducers/async";

export function asyncLoading(type){
  return {
    type: LOADING,
    payload: type
  }
}
export function asyncLoaded(type){
  return {
    type: LOADED,
    payload: type
  }
}
export function asyncIdle(type){
  return {
    type: IDLE,
    payload: type
  }
}