export const SET_DATA = 'SET_DATA';
export const CLEAR_DATA = 'CLEAR_DATA';
export const SET_NOME_PAZIENTE = 'SET_NOME_PAZIENTE';
export const SET_TEMPO_UTILIZZO = 'SET_TEMPO_UTILIZZO';


export function setNomePaziente(nomePaziente){
  return {
    type: SET_NOME_PAZIENTE,
    payload: {nomePaziente}
  };
}

export function setTempoUtilizzo(tempoUtilizzo){
  return {
    type: SET_TEMPO_UTILIZZO,
    payload: {tempoUtilizzo}
  };
}
