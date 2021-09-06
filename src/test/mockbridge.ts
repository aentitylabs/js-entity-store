import { Bridge } from "../bridge";

export class MockBridge extends Bridge {
    private _onReceived: any;
    private _receivedActions: any = {};
    private _entitiesToReply: any = {};


    public send(actions: any, onReply: any): any {
        this._receivedActions = actions;

        this._onReceived(actions);

        onReply(this._entitiesToReply);
    }

    public reply(entities: any) {
        this._entitiesToReply = entities;
    }

    public onReceived(onReceived: any) {
        this._onReceived = onReceived;
    }

    public get receivedActions() {
        return this._receivedActions;
    }
}