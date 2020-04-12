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

INSERT INTO Users VALUES(0, 1, 's2', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's2');
INSERT INTO Users VALUES(0, 2, 't2', '3rpxnwwa4ZIb+sRqW8C3zW/sE2U5SFcc/Z3SUQ8XbS4V37OUEQHKgtpjQktFW3NJeiLk1JLT/k0ygtFuglGAxw==', 'FK38LFxiODd+pkmLELONOw==', 't2');
INSERT INTO Users VALUES(0, 1, 's4', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's4');
INSERT INTO Users VALUES(0, 1, 's5', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's5');
INSERT INTO Users VALUES(0, 1, 's6', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's6');
INSERT INTO Users VALUES(0, 1, 's7', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's7');
INSERT INTO Users VALUES(0, 1, 's8', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's8');
INSERT INTO Users VALUES(0, 1, 's9', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's9');
INSERT INTO Users VALUES(0, 1, 's10', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's10');
INSERT INTO Users VALUES(0, 1, 's11', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's11');
INSERT INTO Users VALUES(0, 1, 's12', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's12');
INSERT INTO Users VALUES(0, 1, 's13', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's13');
INSERT INTO Users VALUES(0, 1, 's14', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's14');
INSERT INTO Users VALUES(0, 1, 's15', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's15');
INSERT INTO Users VALUES(0, 1, 's16', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's16');
INSERT INTO Users VALUES(0, 1, 's17', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's17');
INSERT INTO Users VALUES(0, 1, 's18', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's18');
INSERT INTO Users VALUES(0, 1, 's19', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's19');
INSERT INTO Users VALUES(0, 1, 's20', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's20');
INSERT INTO Users VALUES(0, 1, 's21', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's21');
INSERT INTO Users VALUES(0, 1, 's22', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's22');
INSERT INTO Users VALUES(0, 1, 's23', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's23');
INSERT INTO Users VALUES(0, 1, 's24', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's24');
INSERT INTO Users VALUES(0, 1, 's25', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's25');
INSERT INTO Users VALUES(0, 1, 's26', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's26');
INSERT INTO Users VALUES(0, 1, 's27', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's27');
INSERT INTO Users VALUES(0, 1, 's28', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's28');
INSERT INTO Users VALUES(0, 1, 's29', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's29');
INSERT INTO Users VALUES(0, 1, 's30', 'jUUORG667DEEVqN9yz/i68+apttG4XSy121RHpnYEVJt6chYZnnf6YY1Zu9wGZ+FlW3t/6an8CHMcSNb+73auQ==', 'cw6ABGA4i53fb+ijN0D8QQ==', 's30');



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

Insert into Courses(CourseCode, Instructor) VALUES("D01", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("D02", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("D03", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("D04", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("D05", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("S29", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("S69", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("S72", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("S75", "Thierry");
Insert into Courses(CourseCode, Instructor) VALUES("S78", "Thierry");


Insert into UserCourses VALUES(1,1);
-- Insert into UserCourses VALUES(1,2);
Insert into UserCourses VALUES(2,1);
Insert into UserCourses VALUES(2,2);