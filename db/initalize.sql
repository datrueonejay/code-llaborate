-- DROP DATABASE IF EXISTS JayJayRay;
-- CREATE DATABASE JayJayRay;
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

INSERT INTO Users VALUES(0, 1, 's1', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's1');
INSERT INTO Users VALUES(0, 2, 't1', '3rpxnwwa4ZIb+sRqW8C3zW/sE2U5SFcc/Z3SUQ8XbS4V37OUEQHKgtpjQktFW3NJeiLk1JLT/k0ygtFuglGAxw==', 'FK38LFxiODd+pkmLELONOw==', 't1');
INSERT INTO Users VALUES(0, 3, 'i1', 'CSxouMbeIU5tgVR2Nnn5AORJBAQnT6HeFBvd3oJrEOMiKHswBNZeZUUB5XULoHctazX494vO6bq8XVwlcfXe9w==', 'Brkr2L+VmYYxxZeI0HLPvg==', 'i1');

CREATE TABLE Courses(
	ID INT NOT NULL AUTO_INCREMENT,
    CourseCode VARCHAR(255) NOT NULL,
    Instructor varchar(255) NOT NULL,
    PRIMARY KEY(ID)
);

CREATE TABLE UserCourses(
	UserID INT,
    CourseID INT,
	PRIMARY KEY(UserId, CourseId),
    FOREIGN KEY(UserId) REFERENCES Users(ID),
    FOREIGN KEY(CourseId) REFERENCES Courses(ID)
);

Insert into Courses(CourseCode, Instructor) VALUES("C09", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("D27", "Thierry");
Insert into UserCourses VALUES(1,1);
-- Insert into UserCourses VALUES(1,2);
Insert into UserCourses VALUES(2,1);
Insert into UserCourses VALUES(2,2);
