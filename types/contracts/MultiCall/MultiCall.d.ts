import { IWallet, Contract as _Contract, TransactionReceipt, BigNumber, TransactionOptions } from "@ijstech/eth-contract";
export interface IMulticallWithGasLimitationParams {
    calls: {
        to: string;
        data: string;
    }[];
    gasBuffer: number | BigNumber;
}
export declare class MultiCall extends _Contract {
    static _abi: any;
    constructor(wallet: IWallet, address?: string);
    deploy(options?: TransactionOptions): Promise<string>;
    gasLeft: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    gaslimit: {
        (options?: TransactionOptions): Promise<BigNumber>;
    };
    multicall: {
        (calls: {
            to: string;
            data: string;
        }[], options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (calls: {
            to: string;
            data: string;
        }[], options?: TransactionOptions) => Promise<string[]>;
        txData: (calls: {
            to: string;
            data: string;
        }[], options?: TransactionOptions) => Promise<string>;
    };
    multicallWithGas: {
        (calls: {
            to: string;
            data: string;
        }[], options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (calls: {
            to: string;
            data: string;
        }[], options?: TransactionOptions) => Promise<{
            results: string[];
            gasUsed: BigNumber[];
        }>;
        txData: (calls: {
            to: string;
            data: string;
        }[], options?: TransactionOptions) => Promise<string>;
    };
    multicallWithGasLimitation: {
        (params: IMulticallWithGasLimitationParams, options?: TransactionOptions): Promise<TransactionReceipt>;
        call: (params: IMulticallWithGasLimitationParams, options?: TransactionOptions) => Promise<{
            results: string[];
            lastSuccessIndex: BigNumber;
        }>;
        txData: (params: IMulticallWithGasLimitationParams, options?: TransactionOptions) => Promise<string>;
    };
    private assign;
}
