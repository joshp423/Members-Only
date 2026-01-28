require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    firstName VARCHAR(15),
    lastName VARCHAR(25),
    username VARCHAR,
    password VARCHAR,
    membershipStatus BOOL,
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(100),
    timeAdded TIMESTAMP,
    text VARCHAR(250),
    userid INT
);

INSERT INTO categories (category)
  VALUES
  ('Electric Guitars'),
  ('Acoustic Guitars'),
  ('Bass Guitars'),
  ('Drums')
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
