DROP DATABASE IF EXISTS USERS;
CREATE DATABASE USERS;
USE USERS;
CREATE TABLE Roles(
  ID INT NOT NULL AUTO_INCREMENT,
  Role VARCHAR(255) NOT NULL, 
  PRIMARY KEY(id)
);

INSERT INTO ROLES(Role) VALUE("STUDENT");
INSERT INTO ROLES(Role) VALUE("TEACHING ASSISTANT");
INSERT INTO ROLES(Role) VALUE("INSTRUCTOR");

CREATE TABLE Users(
	ID INT NOT NULL AUTO_INCREMENT,
    RoleID INT NOT NULL,
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Salt VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(RoleID) REFERENCES ROLES(ID)
);

CREATE TABLE Courses(
	ID INT NOT NULL AUTO_INCREMENT,
    CourseCode VARCHAR(255) NOT NULL,
    Instructor varchar(255) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE UserCourses(
	UserID INT,
    CourseId INT,
	PRIMARY KEY(UserId, CourseId),
    FOREIGN KEY(UserId) REFERENCES Users(ID),
    FOREIGN KEY(UserId) REFERENCES Courses(ID)
);


