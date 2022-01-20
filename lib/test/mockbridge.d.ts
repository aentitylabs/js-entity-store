import { Bridge } from "../bridge";
export declare class MockBridge extends Bridge {
    private _onReceived;
    private _receivedActions;
    private _entitiesToReply;
    private _actionsToReply;
    send(actions: any, onSend: any): void;
    reply(entities: any, actions: any, onReply: any): void;
    onReceived(onReceived: any): void;
    get receivedActions(): any;
}
