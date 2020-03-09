const EntitySchema = require('typeorm').EntitySchema

const User = new EntitySchema({

  name: 'User',
  columns: {
  id: {
      type: String,
      primary: true,
      generated: false
  },
  nomePaziente: {
    type: String
  },
  startDate: {
    type: String
  },
    endDate: {
    type: String
  },
    tempoUtilizzo: {
    type: String
  }
}
});

module.exports = User;
