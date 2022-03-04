import {IWallet, TransactionReceipt, Event, Log, EventLog} from "./wallet";
import {BigNumber} from "bignumber.js";
// import * as W3 from 'web3';
// const Web3 = require('web3'); // tslint:disable-line

module Contract {
    export interface EventType{
		name: string
	}
    export class Contract {
        public wallet: IWallet;
        public _abi: any;
        public _bytecode: any;
        public _address: string;
        private _events: any;
        public privateKey: string;
        
        constructor(wallet: IWallet, address?: string, abi?: any, bytecode?: any) {            
            this.wallet = wallet;                        
            if (typeof(abi) == 'string')
                this._abi = JSON.parse(abi)
            else
                this._abi = abi
            this._bytecode = bytecode
            let self = this;
            if (address)
                this._address = address;
        }    
        at(address: string): Contract {
            this._address = address;
            return this;
        }
        set address(value: string){
            this._address = value;
        }
        get address(): string{
            return this._address || '';
        }
        protected decodeEvents(receipt: TransactionReceipt): any[]{
            let events = this.getAbiEvents();
            let result = [];
            for (let name in receipt.events){
                let events = <EventLog[]>( Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]] );
                events.forEach(e=>{
                    let data = e.raw;
                    let event = events[data.topics[0]];
                    result.push(Object.assign({_name:name, _address:this.address},this.wallet.decodeLog(event.inputs, data.data, data.topics.slice(1))));
                });
            }
            return result;
        }
        protected parseEvents(receipt: TransactionReceipt, eventName: string): Event[]{
            let eventAbis = this.getAbiEvents();
            let topic0 = this.getAbiTopics([eventName])[0];

            let result = [];
            if (receipt.events) {
                for (let name in receipt.events){
                    let events = <EventLog[]>( Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]] );
                    events.forEach(event=>{
                        if (topic0 == event.raw.topics[0] && (this.address && this.address==event.address)) {
                            result.push(this.wallet.decode(eventAbis[topic0], event, event.raw));
                        }
                    });
                }
            } else if (receipt.logs) {
                for (let i = 0 ; i < receipt.logs.length ; i++) {
                    let log = receipt.logs[i];
                    if (topic0 == log.topics[0] && (this.address && this.address==log.address)) {
                        result.push(this.wallet.decode(eventAbis[topic0], log));
                    }
                }

            }
            return result;
        }
        get events(): EventType[]{
            let result = [];
            for (let i = 0; i < this._abi.length; i ++)	{
                if (this._abi[i].type == 'event')
                    result.push(this._abi[i])
            }
            return result;
        }
        protected methodsToUtf8(...args): Promise<string>{
            let self = this;            
            return new Promise<string>(async function(resolve, reject){
                let result = await self.methods.apply(self, args);
                resolve(self.wallet.utils.toUtf8(result));
            })
        }
        protected methodsToUtf8Array(...args): Promise<string[]>{
            let self = this;            
            return new Promise<string[]>(async function(resolve, reject){
                let result = await self.methods.apply(self, args);
                let arr = [];
                for (let i = 0; i < result.length; i ++){
                    arr.push(self.wallet.utils.toUtf8(result[i]))
                }
                resolve(arr);
            })
        }
        protected methodsFromWeiArray(...args): Promise<BigNumber[]>{            
            let self = this;            
            return new Promise<BigNumber[]>(async function(resolve, reject){
                let result = await self.methods.apply(self, args)
                let arr = [];
                for (let i = 0; i < result.length; i ++){
                    arr.push(new BigNumber(self.wallet.utils.fromWei(result[i])))
                }
                resolve(arr);
            })
        }
        protected methodsFromWei(...args): Promise<BigNumber>{            
            let self = this;
            return new Promise<BigNumber>(async function(resolve, reject){
                let result = await self.methods.apply(self, args);
                return resolve(new BigNumber(self.wallet.utils.fromWei(result)));
            })
        }
        // protected _methods(...args): Promise<any>{
        //     args.unshift(this._address);
        //     args.unshift(this._abi);
        //     return this.wallet._methods.apply(this.wallet, args);
        // }
        protected methods(...args): Promise<any>{
            args.unshift(this._address);
            args.unshift(this._abi);
            return this.wallet.methods.apply(this.wallet, args);
        }
        protected getAbiTopics(eventNames?: string[]){
            return this.wallet.getAbiTopics(this._abi, eventNames);
        }
        protected getAbiEvents(){
            if (!this._events)
                this._events = this.wallet.getAbiEvents(this._abi);
            return this._events;
        }
        scanEvents(fromBlock: number, toBlock: number|string, eventNames?: string[]): Promise<Event[]>{
            let topics = this.getAbiTopics(eventNames);
        	let events = this.getAbiEvents();
            return this.wallet.scanEvents(fromBlock, toBlock, topics, events, this._address);
        };
        async _deploy(...args): Promise<string>{
            if (typeof(args[args.length-1]) == 'undefined')
                args.pop();
            args.unshift(this._bytecode);
            args.unshift('deploy');
            args.unshift(null);
            args.unshift(this._abi);
            this._address = await this.wallet.methods.apply(this.wallet, args);
            return this._address;
        }
        // get web3(): W3.default{
        //     return this.wallet.web3;
        // }
    }
    export class TAuthContract extends Contract {
        rely(address: string): Promise<any>{
            return this.methods('rely', address)
        }
        deny(address: string): Promise<any>{
            return this.methods('deny', address)
        }
    }
}
export = Contract;