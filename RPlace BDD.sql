CREATE DATABASE RPlace;
USE RPlace;

CREATE TABLE pixels (
  x INT,
  y INT,
  color VARCHAR(10),
  PRIMARY KEY (x, y)
);