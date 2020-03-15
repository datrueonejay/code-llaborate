DROP DATABASE IF EXISTS JayJayRay;
CREATE DATABASE JayJayRay;
USE JayJayRay;
CREATE TABLE Roles(
  ID INT NOT NULL AUTO_INCREMENT,
  Role VARCHAR(255) NOT NULL, 
  PRIMARY KEY(id)
);

INSERT INTO Roles(Role) VALUE("STUDENT");
INSERT INTO Roles(Role) VALUE("TEACHING ASSISTANT");
INSERT INTO Roles(Role) VALUE("INSTRUCTOR");

CREATE TABLE Users(
	ID INT NOT NULL AUTO_INCREMENT,
    RoleID INT NOT NULL,
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Salt VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    PRIMARY KEY(ID),
    FOREIGN KEY(RoleID) REFERENCES Roles(ID)
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
    FOREIGN KEY(CourseId) REFERENCES Courses(ID)
);

Insert into Courses(CourseCode, Instructor) VALUES("C09", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("D27", "Thierry")