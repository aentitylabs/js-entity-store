import { Bridge } from "../bridge";

export class MockBridge extends Bridge {
    private _onReceived: any;
    private _receivedActions: any = {};
    private _entitiesToReply: any = {};


    public send(actions: any, onSend: any): void {
        this._receivedActions = actions;

        this._onReceived(actions);

        onSend(this._entitiesToReply);
    }

    public reply(entities: any, onReply: any): void {
        this._entitiesToReply = entities;

        onReply();
    }

    public onReceived(onReceived: any) {
        this._onReceived = onReceived;
    }

    public get receivedActions() {
        return this._receivedActions;
    }
}