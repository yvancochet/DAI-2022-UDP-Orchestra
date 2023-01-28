FROM node:19

COPY src/ /opt/app/
WORKDIR /opt/app/

EXPOSE 2205

RUN npm install

ENTRYPOINT ["node", "/opt/app/auditor.js"]