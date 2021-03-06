1. Install pre-installation steps on a fresh Ubuntu 16 desktop machine:
```
curl -O https://hyperledger.github.io/composer/v0.19/prereqs-ubuntu.sh
chmod u+x prereqs-ubuntu.sh
./prereqs-ubuntu.sh
```

2. Install fabric version 1.4.7 on the machine
```
curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s -- 1.4.7
```

3. Run the first network to check the fabric setup. It should complete without any error.
```
cd fabric-samples/first-network
./byfn.sh generate
./byfn.sh up
```
It should complete with the following message.
```
========= All GOOD, BYFN execution completed ===========
```

4. Clone the arbitration repo
```
git clone https://github.com/nachikettapas/arbitration.git
```

5. Experiment setup
```
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
```
```
cd ~/fabric-samples/arbitration/arbitration/researchers/configuration/cli/
docker-compose -f docker-compose.yml up -d researchers
docker ps
cd ~/fabric-samples/arbitration/arbitration/researchers/contract
docker exec researchers peer chaincode install -n arbitrationcontract -v 0 -p /opt/gopath/src/github.com/contract -l node
cd ~/fabric-samples/arbitration/arbitration/researchers/application/
npm install
node addToWallet.js isabella User1
```

6. Run the setup
```
1. node create.js
2. node vote.js
3. node finish.js
```
