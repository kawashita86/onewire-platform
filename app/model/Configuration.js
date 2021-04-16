const EntitySchema = require('typeorm').EntitySchema

const Configuration = new EntitySchema({

  name: 'Configuration',
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: false
    },
    minTmp: {
      type: "int"
    },
    maxTmp: {
      type: "int"
    },
    demo: {
      type: "int"
    }
  }
});

module.exports = Configuration;
