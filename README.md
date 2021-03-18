# Project Title : Code-llaborate

## Links
- Our Demo Video
    - https://youtu.be/clVe42xD5Hc


## Team Members

- Jacqueline Chan 
- Jayden Arquelada 
- Ricky Chen 

## A description of the web application

Code-llaborate is going to be a web application that will allow programmers to collectively edit and run Python2 code online, particularly in a classroom environment. There would be different user tiers such as instructors/TAs and students with different permissions. Students can suggest possible solutions (by providing the code snippet and code line number) and it would appear at the side for the class to see, but only the TA would be editing the document in real-time. Those TA’s can click to copy the code snippet.  TAs/Instructors can initially upload files or download the finished files after a session. During sessions there is also a streaming chat app (at the side, in the drawer). Sessions are restrictive such that students will only have access to join the sections that are assigned to them/they sign up for. TA’s have the power to start/join/destroy a session. Instructors/Admin can add students into courses via their ID number. They can also filter for a specific student on their page.
Instructors have the ability to add users to other courses. Upon signing in as an instructor, you will see 2 lists, one for the users and one for the courses. Each has their associated ids and clicking the list item will automatically populate the form to add a user to a course. Instructors can also search for students using the (global) search bar or filter them by name (try “s1” for Users and “c0” for Course filters). If an instructor does not want to manually add every student to the course, they can create a course code for the course and email it to their students which will let them join the course themselves. For the filter feature, we recognize that the UI is a bit iffy on prod (please zoom out if it goes out if components go out of range). Also for emailing the course sign up codes, on PROD, gmail is tight on their security and prevents us from sending an email from Columbia, OH, USA (where our servers are), and therefore it prevents that emailing feature from working. In our video/local it works because we are there to temp. disable the captcha. Once you have the code, just input it to join the course.


## A description of the key features that was completed by the Beta version

- Use of WebSockets for code sharing
- Compilation and running of python code
- Deployment of our App
- File upload/download
- User profiles (Create an account, Create sessions, different permissions) 

## A description of additional features that will be completed by the Final version
- Emailing(Confirmation emails, emailing codes)
- Chat (either text or audio)
- Invite


## A Description of the technology that you will use

- AWS (for hosting)
- Websockets 
- Docker
- React
- Node.js
    - Express, Sessions
- MySQL

## A Description of the top 5 Technical challenges

- Learning/implementing WebSockets for communication between the server and client (code edits, suggestions, chat real time) 
- Running python code on the server and piping the output back to the frontend.
    - PyPy’s Sandbox
- Learning how to deploy an application on AWS
- Learning how to use React was an initial hurdle as most of us are not very familiar with web frameworks at all.
- Learning how to set up our images + environments (deploy/prod) using Docker

## To Run App Locally
- Please note that docker-compose up will take a while because of our PyPy Sandbox

- npm install in directory client
- in client/src/http/socketController.js
    - uncomment line 12
    - comment line 13
- run ./build.sh in root directory
- run docker-compose up --build in root directory
- visit localhost:8080

