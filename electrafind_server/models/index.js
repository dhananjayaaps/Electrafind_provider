const { Sequelize } = require('sequelize');



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
});

// Initialize Models
const user = UserModel(sequelize);
const vehicle = VehicleModel(sequelize);
const battery = BatteryModel(sequelize);
const chargingStation = ChargingStationModel(sequelize);
const timeSlot = TimeSlotModel(sequelize);
const booking = BookingModel(sequelize);
const chargingSession = ChargingSessionModel(sequelize);
const transaction = TransactionModel(sequelize);
const rating = RatingModel(sequelize);
const marketPlace = MarketplaceModel(sequelize);


// User ↔ Vehicle (One-to-Many)
user.hasMany(vehicle, { foreignKey: 'UserID' });
vehicle.belongsTo(user, { foreignKey: 'UserID' });

// Vehicle ↔ Battery (One-to-One)
vehicle.belongsTo(battery, { foreignKey: 'BatteryID' });
battery.hasOne(vehicle, { foreignKey: 'BatteryID' });

// User ↔ ChargingStation (One-to-Many for Station Hosts)
user.hasMany(chargingStation, { foreignKey: 'HostUserID' });
chargingStation.belongsTo(user, { foreignKey: 'HostUserID' });

// ChargingStation ↔ TimeSlot (One-to-Many)
chargingStation.hasMany(timeSlot, { foreignKey: 'StationID' });
timeSlot.belongsTo(chargingStation, { foreignKey: 'StationID' });

// User ↔ Booking (One-to-Many)
user.hasMany(booking, { foreignKey: 'UserID' });
booking.belongsTo(user, { foreignKey: 'UserID' });

// TimeSlot ↔ Booking (One-to-Many)
timeSlot.hasMany(booking, { foreignKey: 'SlotID' });
booking.belongsTo(timeSlot, { foreignKey: 'SlotID' });

// Booking ↔ ChargingSession (One-to-One)
booking.hasOne(chargingSession, { foreignKey: 'BookingID' });
chargingSession.belongsTo(booking, { foreignKey: 'BookingID' });

// ChargingSession ↔ Transaction (One-to-One)
chargingSession.hasOne(transaction, { foreignKey: 'SessionID' });
transaction.belongsTo(chargingSession, { foreignKey: 'SessionID' });

// User ↔ Transaction (One-to-Many)
user.hasMany(transaction, { foreignKey: 'UserID' });
transaction.belongsTo(user, { foreignKey: 'UserID' });

// User ↔ Rating (One-to-Many)
user.hasMany(rating, { foreignKey: 'UserID' });
rating.belongsTo(user, { foreignKey: 'UserID' });

// ChargingStation ↔ Rating (One-to-Many)
chargingStation.hasMany(rating, { foreignKey: 'StationID' });
rating.belongsTo(chargingStation, { foreignKey: 'StationID' });

// User ↔ Marketplace (One-to-Many for Product Listings)
user.hasMany(marketPlace, { foreignKey: 'AddedByUserID' });
marketPlace.belongsTo(user, { foreignKey: 'AddedByUserID' });


// const { sequelize } = require('./models'); // Adjust path as needed

(async () => {
    try {
        await sequelize.sync({ force: true }); // Use force: true only in development (drops and recreates tables)
        console.log('Database synchronized successfully!');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
})();

module.exports = {
    sequelize,
    user,
    vehicle,
    battery,
    chargingStation,
    timeSlot,
    booking,
    chargingSession,
    transaction,
    rating,
    marketPlace,
  };
  