create database login;
use login;

create table USER (
idUser int primary key,
username varchar(20) not null,
password varchar(8) not null
);

INSERT INTO USER values (1, 'Nicoly', '123');
SELECT * FROM USER;