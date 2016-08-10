var Sequelize = require('sequelize');

require('sequelize-definer')(Sequelize);

var sequelize = new Sequelize(process.env.SQL, {
    dialectOptions: {
        ssl: true
    },
    logging: false
});

module.exports = sequelize;