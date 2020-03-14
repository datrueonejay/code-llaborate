# Project Title : Code-llaborate

## Team Members

- Jacqueline Chan 
    - 1003150190 
    - chanja51

- Jayden Arquelada 
    - 1003195106 
    - arquela1

- Ricky Chen 
    - 1003193876 
    - chenric6

## A description of the web application

Code-llaborate is going to be a web application that will allow programmers to collectively edit and run python code online, particularly in a classroom environment. There would be different user tiers such as instructors/TAs and students with different permissions. Additionally, there would be two main different editing modes, Suggestion Mode and Slow Edit Mode. For Suggestion Mode, students can only suggest possible solutions and it would appear at the side for the class to see, but only the TA would be editing the document in real-time. The students may choose to be anonymous when they suggest possible solutions but they would still be visible for TA’s. For Slow Edit Mode, TAs and students can directly edit the document every given time interval. TAs/Instructors can initially upload files or download the finished files after a session. During sessions, we plan to include features like a streaming chat app, including user profiles so that students can give ratings or feedback about their instructors and making sessions restrictive such that students will only have access to the sections assigned to them.

## A description of the key features that will be completed by the Beta version

- User profiles (Create an account, Create classrooms, invite people, different permissions)
- File upload/download
- Use of WebSockets for code sharing
- Chat (either text or audio)

## A description of additional features that will be completed by the Final version
- Oauth (quick login using Gmail)
- Emailing(Confirmation emails, emailing codes)
- Compilation and running of python code


## A Description of the technology that you will use

- Websockets 
- Web RTC
- React
- Node.js
    - Express, Sessions
- Postgres
- Heroku (for hosting)

## A Description of the top 5 Technical challenges

- Learning/implementing WebSockets for communication between the server and client/ web RTC
- Creating the chat mechanism with real-time updates
- Learning how to use React would be an initial hurdle as most of us are not very familiar with web frameworks at all.
- Learning how to deploy an application on Heroku / Postgres
- Running python code on the server and piping the output back to the frontend.
