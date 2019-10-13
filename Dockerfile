FROM node:carbon
# tells Docker to use node image (parent image)
WORKDIR /usr/src/smart-brain-api
# directory in the container that we want to work out of
COPY ./ ./
# which files from current directory to working dir
RUN npm install
# which command to run
CMD ["/bin/bash"]
# CMD tells what to run in container (access to bash shell)
