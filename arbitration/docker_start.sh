cd ~/fabric-samples/basic-network
./start.sh
cd ~/fabric-samples/arbitration/arbitration/researchers/configuration/cli/
docker-compose -f docker-compose.yml up -d cliResearchers
cd ~/fabric-samples/arbitration/arbitration/arbitrators/configuration/cli/
docker-compose -f docker-compose.yml up -d cliArbitrators
cd ~/fabric-samples/arbitration/arbitration/researchers/configuration/cli/
./monitordocker.sh net_basic