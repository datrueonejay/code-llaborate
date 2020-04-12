FROM python:2 as pythonBuild

WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y mercurial 
RUN pip install pycparser
RUN hg clone https://bitbucket.org/pypy/pypy 

WORKDIR /usr/src/app/pypy

RUN hg update -r 202f386

WORKDIR /usr/src/app/pypy/pypy/goal

RUN sed -i '313,317d' targetpypystandalone.py
# RUN python ../../rpython/bin/rpython -O2 --sandbox targetpypystandalone.py
RUN python ../../rpython/bin/rpython -O2 --sandbox targetpypystandalone --withoutmod-time

# RUN cd pypy/goal && "../../rpython/bin/rpython -O2 --sandbox targetpypystandalone.py"
# CMD [ "python", "../../rpython/bin/rpython -O2 --sandbox targetpypystandalone.py" ]

FROM node:latest

WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y python

COPY --from=pythonBuild /usr/src/app/pypy/ pypy/


COPY . ./


RUN npm install

EXPOSE 8080

CMD ["node", "app.js"]