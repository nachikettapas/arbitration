/*
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');

const fixtures = path.resolve(__dirname, '../../../../first-network');

// A wallet stores a collection of identities
var myArgs = process.argv.slice(2);
const wallet = new FileSystemWallet('../identity/user/' + myArgs[0] + '/wallet');

async function main() {

    // Main try/catch block
    try {

        // Identity to credentials to be stored in the wallet
        const credPath = path.join(fixtures, '/crypto-config/peerOrganizations/org1.example.com/users/' + myArgs[1] + '@org1.example.com');
        const cert = fs.readFileSync(path.join(credPath, '/msp/signcerts/' + myArgs[1] + '@org1.example.com-cert.pem')).toString();
        let dirCont = fs.readdirSync(path.join(credPath, '/msp/keystore/'));
        let files = dirCont.filter( function(elm) {return elm.match(/.*(_sk)/ig);});
        const key = fs.readFileSync(path.join(credPath, '/msp/keystore/', files[0])).toString();

        // Load credentials into wallet
        const identityLabel = myArgs[1] + '@org1.example.com';
        const identity = X509WalletMixin.createIdentity('Org1MSP', cert, key);

        await wallet.import(identityLabel, identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});