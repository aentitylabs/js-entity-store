"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockBridge = void 0;
const bridge_1 = require("../bridge");
class MockBridge extends bridge_1.Bridge {
    constructor() {
        super(...arguments);
        this._receivedActions = {};
        this._entitiesToReply = {};
    }
    send(actions) {
        this._receivedActions = actions;
        this._onReceived(actions);
        return this._entitiesToReply;
    }
    reply(entities) {
        this._entitiesToReply = entities;
    }
    onReceived(onReceived) {
        this._onReceived = onReceived;
    }
    get receivedActions() {
        return this._receivedActions;
    }
}
exports.MockBridge = MockBridge;
//# sourceMappingURL=mockbridge.js.map