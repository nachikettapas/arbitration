cd ~/fabric-samples/arbitration/arbitration/researchers/contract
docker exec cliResearchers peer chaincode install -n arbitrationcontract -v 0 -p /opt/gopath/src/github.com/contract -l node
docker exec cliResearchers peer chaincode instantiate -n arbitrationcontract -v 0 -l node -c '{"Args":["org.programnet.arbitration:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"