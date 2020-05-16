Install pre-installation steps on a fresh Ubuntu 16 desktop machine:
curl -O https://hyperledger.github.io/composer/v0.19/prereqs-ubuntu.sh
chmod u+x prereqs-ubuntu.sh
./prereqs-ubuntu.sh

cd fabric-samples/basic-network
./start.sh


cd ~/fabric-samples/arbitration/arbitration/arbitrators/configuration/cli/
docker-compose -f docker-compose.yml up -d arbitrators
docker ps
cd ~/fabric-samples/arbitration/arbitration/arbitrators/contract
docker exec arbitrators peer chaincode install -n arbitrationcontract -v 0 -p /opt/gopath/src/github.com/contract -l node
docker exec arbitrators peer chaincode instantiate -n arbitrationcontract -v 0 -l node -c '{"Args":["org.programnet.arbitration:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"
docker ps
cd ~/fabric-samples/arbitration/arbitration/arbitrators/application/
npm install
node addToWallet.js carol User1



cd ~/fabric-samples/arbitration/arbitration/researchers/configuration/cli/
docker-compose -f docker-compose.yml up -d researchers
docker ps
cd ~/fabric-samples/arbitration/arbitration/researchers/contract
docker exec researchers peer chaincode install -n arbitrationcontract -v 0 -p /opt/gopath/src/github.com/contract -l node
cd ~/fabric-samples/arbitration/arbitration/researchers/application/
npm install
node addToWallet.js isabella User1


1. node create.js
2. node vote.js
3. node finish.js