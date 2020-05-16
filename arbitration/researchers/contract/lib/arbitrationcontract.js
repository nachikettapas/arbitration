/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

// ProgramNet specifc classes
const Arbitration = require('./arbitration.js');
const ArbitrationList = require('./arbitrationlist.js');


/**
 * A custom context provides easy access to list of all commercial papers
 */
class ArbitrationContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.arbitrationList = new ArbitrationList(this);
    }

}

/**
 * Define arbitrator smart contract by extending Fabric Contract class
 *
 */
class ArbitrationContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.programnet.arbitration');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new ArbitrationContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Initiate arbitration
     *
    */
    async createArbitration(ctx, issuer, arbitrationNumber, proposal, option, issueDateTime, maturityDateTime) {

        //Initiate vote and voter structure
        var vote = {}
        var voter = {}

        // create an instance of the arbitration
        let arbitration = Arbitration.createInstance(issuer, arbitrationNumber, proposal, option, issueDateTime, maturityDateTime, vote, voter);

        // Smart contract moves arbitration into CREATED state
        arbitration.setCreated();

        // Add the arbitration to the list of all similar arbitrations in the ledger world state
        await ctx.arbitrationList.addArbitration(arbitration);

        // Must return a serialized paper to caller of smart contract
        return arbitration.toBuffer();
    }

    /**
     * Vote for an arbitration
     *
    */
    async vote(ctx, issuer, arbitrationNumber, choice) {

        // Logic to ensure that the voting entity from Arbitration organization
        let clid = new ClientIdentity(ctx.stub).getID().split('/')[4].split('=')[1].split('@')[0];
        let mspid = new ClientIdentity(ctx.stub).getMSPID();
        if ( mspid === "Org1MSP" ) {
            // Retrieve the current arbitration using key fields provided
            let arbitrationKey = Arbitration.makeKey([issuer, arbitrationNumber]);
            let arbitration = await ctx.arbitrationList.getArbitration(arbitrationKey);

            // First vote moves state from CREATED to VOTING
            if (arbitration.isCreated()) {
                arbitration.setVoting();
            } else {
                return arbitration.toBuffer();
            }

            if ( !arbitration.getVoter(clid) ) {

                var tempVoter = {}
                tempVoter[clid] = 1;
                arbitration.setVoter(tempVoter);


                var tempVote = {}
                tempVote[clid] = choice;
                arbitration.setVote(tempVote);

                // Update the paper
                await ctx.arbitrationList.updateArbitration(arbitration);
                return arbitration.toBuffer();
            }
        } else {
            return Buffer.from(JSON.stringify({'message': 'User not part of arbitrator.'}));
        }
    }

    /**
     * Publish the result
     *
    */
    async publish(ctx, issuer, arbitrationNumber) {

        // Retrieve the current arbitration using key fields provided
        let arbitrationKey = Arbitration.makeKey([issuer, arbitrationNumber]);
        let arbitration = await ctx.arbitrationList.getArbitration(arbitrationKey);

        // First vote moves state from VOTING to ENDED
        if (arbitration.isVoting()) {
            arbitration.setEnded();
        }

        // Update the paper
        await ctx.arbitrationList.updateArbitration(arbitration);
        return arbitration.toBuffer();
    }

}

module.exports = ArbitrationContract;
