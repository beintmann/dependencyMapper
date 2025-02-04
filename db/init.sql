CREATE TABLE demo_table(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

INSERT INTO demo_table(name, email) VALUES('Max Mustermann', 'max.mustermann@evil-corp.com');
