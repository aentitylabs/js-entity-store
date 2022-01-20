import { Bridge } from "../bridge";

export class MockBridge extends Bridge {
    private _onReceived: any;
    private _receivedActions: any = {};
    private _entitiesToReply: any = {};
    private _actionsToReply: any = {};


    public send(actions: any, onSend: any): void {
        this._receivedActions = actions;

        this._onReceived(actions);

        onSend(this._entitiesToReply, this._actionsToReply);
    }

    public reply(entities: any, actions: any, onReply: any): void {
        this._entitiesToReply = entities;
        this._actionsToReply = actions;

        onReply();
    }

    public onReceived(onReceived: any) {
        this._onReceived = onReceived;
    }

    public get receivedActions() {
        return this._receivedActions;
    }
}