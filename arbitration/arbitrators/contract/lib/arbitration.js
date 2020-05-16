/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

// Enumerate arbitration state values
const arbState = {
    CREATED: 1,
    VOTING: 2,
    ENDED: 3
};

var extend = require('util')._extend

/**
 * Arbitration class extends State class
 * Class will be used by application and smart contract to define an arbitration
 */
class Arbitration extends State {

    constructor(obj) {
        super(Arbitration.getClass(), [obj.issuer, obj.arbitrationNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    getProposal() {
        return this.proposal;
    }

    setProposal(newProposal) {
        this.proposal = newProposal;
    }

    getOption() {
        return this.option;
    }

    setOption(newOption) {
        this.option = newOption;
    }

    getIssueDateTime() {
        return this.issueDateTime;
    }

    setIssueDateTime(newIssueDateTime) {
        this.issueDateTime = newIssueDateTime;
    }

    getMaturityDateTime() {
        return this.maturityDateTime;
    }

    setMaturityDateTime(newMaturityDateTime) {
        this.maturityDateTime = newMaturityDateTime;
    }

    getVote(id) {
        if ( !( id in this.vote ) ) {
            return 0;
        } else {
            return this.vote[id];
        }
    }

    setVote(newVote) {
        var tempobj = extend({}, this.vote);
        extend(tempobj,  newVote);
        this.vote = tempobj;
    }

    getVoter(id) {
        if ( !( id in this.voter ) ) {
            return 0;
        } else {
            return this.voter[id];
        }
    }

    setVoter(newVoter) {
        var tempobj = extend({}, this.voter);
        extend(tempobj,  newVoter);
        this.voter = tempobj;
    }

    getVoteCount() {
        var option1 = 0, option2 = 0;

        for (var key in this.vote) {
            if (data[key] === "o1") {
                option1 += 1;
            }
            else {
                option2 += 1;
            }
        }

        if ( option1 > option2) {
            return "o1";
        }
        else {
            return "o2";
        }
    }

    getVoterCount() {
        Object.keys(this.voter).length
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setCreated() {
        this.currentState = arbState.CREATED;
    }

    setVoting() {
        this.currentState = arbState.VOTING;
    }

    setEnded() {
        this.currentState = arbState.ENDED;
    }

    isCreated() {
        return this.currentState === arbState.CREATED;
    }

    isVoting() {
        return this.currentState === arbState.VOTING;
    }

    isFinished() {
        return this.currentState === arbState.ENDED;
    }

    static fromBuffer(buffer) {
        return Arbitration.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to arbitration
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Arbitration);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(issuer, arbitrationNumber, proposal, option, issueDateTime, maturityDateTime, vote, voter) {
        return new Arbitration({ issuer, arbitrationNumber, proposal, option, issueDateTime, maturityDateTime, vote, voter });
    }

    static getClass() {
        return 'org.programnet.arbitration';
    }
}

module.exports = Arbitration;
