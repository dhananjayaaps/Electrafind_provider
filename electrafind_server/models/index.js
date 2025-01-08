const { Sequelize } = require('sequelize');

// Import model definitions
const UserModel = require('./user');
const VehicleModel = require('./vehicle');
const BatteryModel = require('./battery');
const ChargingStationModel = require('./chargingStation');
const TimeSlotModel = require('./timeSlot');
const BookingModel = require('./booking');
const ChargingSessionModel = require('./chargingSession');
const TransactionModel = require('./transaction');
const RatingModel = require('./rating');
const MarketplaceModel = require('./marketPlace');

// Initialize Sequelize
const sequelize = new Sequelize('electrafind', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

// Initialize Models
const models = {
  user: UserModel(sequelize),
  vehicle: VehicleModel(sequelize),
  battery: BatteryModel(sequelize),
  chargingStation: ChargingStationModel(sequelize),
  timeSlot: TimeSlotModel(sequelize),
  booking: BookingModel(sequelize),
  chargingSession: ChargingSessionModel(sequelize),
  transaction: TransactionModel(sequelize),
  rating: RatingModel(sequelize),
  marketPlace: MarketplaceModel(sequelize),
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Define associations explicitly
models.user.hasMany(models.vehicle, { foreignKey: 'UserID' });
models.vehicle.belongsTo(models.user, { foreignKey: 'UserID' });

models.vehicle.belongsTo(models.battery, { foreignKey: 'BatteryID' });
models.battery.hasOne(models.vehicle, { foreignKey: 'BatteryID' });

models.user.hasMany(models.chargingStation, { foreignKey: 'HostUserID' });
models.chargingStation.belongsTo(models.user, { foreignKey: 'HostUserID' });

models.chargingStation.hasMany(models.timeSlot, { foreignKey: 'StationID' });
models.timeSlot.belongsTo(models.chargingStation, { foreignKey: 'StationID' });

models.user.hasMany(models.booking, { foreignKey: 'UserID' });
models.booking.belongsTo(models.user, { foreignKey: 'UserID' });

models.timeSlot.hasMany(models.booking, { foreignKey: 'SlotID' });
models.booking.belongsTo(models.timeSlot, { foreignKey: 'SlotID' });

models.booking.hasOne(models.chargingSession, { foreignKey: 'BookingID' });
models.chargingSession.belongsTo(models.booking, { foreignKey: 'BookingID' });

models.chargingSession.hasOne(models.transaction, { foreignKey: 'SessionID' });
models.transaction.belongsTo(models.chargingSession, { foreignKey: 'SessionID' });

models.user.hasMany(models.transaction, { foreignKey: 'UserID' });
models.transaction.belongsTo(models.user, { foreignKey: 'UserID' });

models.user.hasMany(models.rating, { foreignKey: 'UserID' });
models.rating.belongsTo(models.user, { foreignKey: 'UserID' });

models.chargingStation.hasMany(models.rating, { foreignKey: 'StationID' });
models.rating.belongsTo(models.chargingStation, { foreignKey: 'StationID' });

models.user.hasMany(models.marketPlace, { foreignKey: 'AddedByUserID' });
models.marketPlace.belongsTo(models.user, { foreignKey: 'AddedByUserID' });

// Synchronize database
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully!');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();

module.exports = {
  sequelize,
  ...models,
};
