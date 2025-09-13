CREATE TABLE Projects (
    id VARCHAR(255) PRIMARY KEY,
    projectNo VARCHAR(255) NOT NULL,
    projectName VARCHAR(255),
    customerName VARCHAR(255),
    owner VARCHAR(255),
    projectDate VARCHAR(255),
    targetDate VARCHAR(255),
    dispatchMonth VARCHAR(255),
    productionStage VARCHAR(255),
    remarks TEXT
);

CREATE TABLE Stages (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    remarks TEXT
);