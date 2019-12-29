

export const User = (data) =>{
  return {
    id: data.id ? data.id : null,
    deviceId: data.deviceId,
    nomePaziente: data.nomePaziente,
    startDate:  typeof data.startDate !== 'undefined' ?data.startDate : null,
    endDate: typeof data.endDate !== 'undefined' ?data.endDate : null,
    tempoUtilizzo: typeof data.tempoUtilizzo !== undefined ? data.tempoUtilizzo : 0
  }
}
