
CREATE TABLE demo_table(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

INSERT INTO demo_table(name, email) VALUES('Max Mustermann', 'max.mustermann@evil-corp.com');


CREATE TABLE IF NOT EXISTS Datensatz (
    DatensatzID INT PRIMARY KEY AUTO_INCREMENT,
    Bezeichnung TEXT,
    DB_Name VARCHAR(255) NOT NULL,
    DB_Schema VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Dienst(
    DienstID INT PRIMARY KEY AUTO_INCREMENT,
    Bezeichnung TEXT,
    Typ TEXT,
    URL VARCHAR(255) NOT NULL,
    Server VARCHAR(255) NOT NULL,
    Zone VARCHAR(255) NOT NULL,
    gesichert BOOLEAN

);

CREATE TABLE IF NOT EXISTS Anwendung (
    AnwendungID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Bezeichnung TEXT,
    Technologie VARCHAR(255) NOT NULL,
    Internet/Intranet TEXT
);