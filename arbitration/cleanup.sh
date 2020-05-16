cd ~/fabric-samples/basic-network
./teardown.sh
docker stop cliResearchers cliArbitrators logspout
docker rm cliResearchers cliArbitrators logspout
docker rmi -f $(docker images -a -q)