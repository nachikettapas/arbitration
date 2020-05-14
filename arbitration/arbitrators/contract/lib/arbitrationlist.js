/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js.js');

const Arbitration = require('./arbitration.js.js');

class ArbitrationList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.arbitrationlist');
        this.use(Arbitration);
    }

    async addArbitration(arbitration) {
        return this.addState(arbitration);
    }

    async getArbitration(arbitrationKey) {
        return this.getState(arbitrationKey);
    }

    async updateArbitration(arbitration) {
        return this.updateState(arbitration);
    }
}


module.exports = ArbitrationList;