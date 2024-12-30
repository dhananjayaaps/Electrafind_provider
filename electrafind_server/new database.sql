CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    UserType ENUM('VehicleUser', 'GeneralUser', 'Administrator', 'StationHost') NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(15),
    Address TEXT
);

CREATE TABLE Vehicles (
    VehicleID  SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    VehicleModel VARCHAR(100) NOT NULL,
    RegistrationNumber VARCHAR(50) UNIQUE NOT NULL,
    BatteryID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (BatteryID) REFERENCES Batteries(BatteryID)
);

CREATE TABLE Batteries (
    BatteryID  SERIAL PRIMARY KEY,
    BatteryType VARCHAR(100) NOT NULL,
    Capacity FLOAT NOT NULL, -- in kWh
    Voltage FLOAT NOT NULL -- in Volts
);

CREATE TABLE ChargingStations (
    StationID  SERIAL PRIMARY KEY,
    HostUserID INT NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(255) NOT NULL,
    FOREIGN KEY (HostUserID) REFERENCES Users(UserID)
);

CREATE TABLE TimeSlots (
    SlotID  SERIAL PRIMARY KEY,
    StationID INT NOT NULL,
    StartTime TIMESTAMP NOT NULL,
    EndTime TIMESTAMP NOT NULL,
    IsAvailable BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (StationID) REFERENCES ChargingStations(StationID)
);

CREATE TABLE Bookings (
    BookingID  SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    SlotID INT NOT NULL,
    ReferenceNumber VARCHAR(50) UNIQUE NOT NULL,
    BookingTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (SlotID) REFERENCES TimeSlots(SlotID)
);

CREATE TABLE ChargingSessions (
    SessionID SERIAL PRIMARY KEY,
    BookingID INT NOT NULL,
    StartTime TIMESTAMP NOT NULL,
    EndTime TIMESTAMP,
    PowerCharged FLOAT, -- in kWh
    Cost FLOAT, -- in currency
    Status VARCHAR(50) CHECK (Status IN ('InProgress', 'Completed', 'Cancelled')) NOT NULL,
    FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID)
);


CREATE TABLE Transactions (
    TransactionID SERIAL PRIMARY KEY,
    SessionID INT NOT NULL,
    UserID INT NOT NULL,
    AmountPaid FLOAT NOT NULL,
    PaymentMethod VARCHAR(20) CHECK (PaymentMethod IN ('CreditCard', 'DebitCard', 'UPI', 'Wallet')) NOT NULL,
    TransactionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SessionID) REFERENCES ChargingSessions(SessionID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);


CREATE TABLE Ratings (
    RatingID  SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    StationID INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    RatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (StationID) REFERENCES ChargingStations(StationID)
);

CREATE TABLE Marketplace (
    ProductID  SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price FLOAT NOT NULL,
    Stock INT NOT NULL,
    AddedByUserID INT,
    FOREIGN KEY (AddedByUserID) REFERENCES Users(UserID)
);
