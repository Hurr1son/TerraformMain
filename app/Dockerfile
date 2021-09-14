FROM node:10
COPY . /site
WORKDIR /site
RUN apt-get update  
RUN apt install -y python3
#RUN apt-get install -y nodejs
#RUN apt-get install -y npm
RUN npm install
RUN npm install cookie-parser 
RUN npm install bcrypt-nodejs
RUN npm install ejs
RUN chmod +x ./script.sh
#--force express express-session morgan passport passport-local connect-flash mysql bcrypt 
EXPOSE 8080
#CMD [echo $DB_NAME]
#RUN node ./scripts/create_database.js
#ENTRYPOINT node ./scripts/create_database.js
#CMD ["/bin/bash" "sleep 10"]#
#


#CMD exec node ./scripts/create_database.js; sleep 5

#CMD ["node" "./scripts/create_database.js" ;"node", "server.js" ]
CMD ["./script.sh"]
