import { Bridge } from "../bridge";
export declare class MockBridge extends Bridge {
    private _onReceived;
    private _receivedActions;
    private _entitiesToReply;
    send(actions: any): any;
    reply(entities: any): void;
    onReceived(onReceived: any): void;
    get receivedActions(): any;
}
