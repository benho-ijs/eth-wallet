"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3 = void 0;
let eth;
let utils;
if (typeof (module) == 'object' && module['exports']) {
    eth = require('web3-eth');
    utils = require('web3-utils');
}
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
class Web3 {
    constructor(provider) {
        this.utils = utils;
        this.eth = new eth(provider);
    }
    ;
    get currentProvider() {
        return this.eth.currentProvider;
    }
    ;
    setProvider(provider) {
        return this.eth.setProvider(provider);
    }
    ;
}
Web3.utils = utils;
exports.Web3 = Web3;
;
