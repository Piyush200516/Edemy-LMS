import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false,
});

// Test Invoice model
const Invoice = sequelize.define('Invoice', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Creates tables (use alter: true in prod)
    console.log('PostgreSQL connected successfully');
    console.log('Invoice table synced');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export default connectPostgres;
export { sequelize, Invoice };

