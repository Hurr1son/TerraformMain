FROM node:10
COPY . /site
WORKDIR /site
RUN apt-get update  
RUN npm install
RUN chmod +x ./script.sh
EXPOSE 8080
CMD ["./script.sh"]
