import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EntityStore } from '../src/entitystore';
import { MockSource } from '../src/test/mocksource';
import { MockBridge } from '../src/test/mockbridge';
import { EntityFactory } from '../src/entityfactory';
import { LoadSourceAction } from '../src/loadsourceaction';
import { UpdateSourceAction } from '../src/updatesourceaction';
import { DeleteSourceAction } from '../src/deletesourceaction';


describe('Entity Store Test', () => {
    it('test load entity and update property', () => {
        const entityStore: EntityStore = new EntityStore();

        const source: MockSource = new MockSource();

        entityStore.addSource("StubEntityA", source);

        const entity: any = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });

        expect({
            "StubEntityA::load": new LoadSourceAction(entity)
        }).to.eql(entityStore.actions);

        const sourceStubEntityA = {
            "prop1": "hi",
            "prop2": {
                "prop1": ""
            }
        };
        source.loadedEntities = [sourceStubEntityA];

        entityStore.sync();

        expect(sourceStubEntityA["prop1"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["prop2"]["prop1"]).to.eql(entity.prop2.prop1);

        entity.prop1 = "hello";
        entity.prop1 = "hello!";
        entity.prop2.prop1 = "Tom";

        expect({
            "StubEntityA::update": new UpdateSourceAction(entity)
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([{
            "prop1": "hello!",
            "prop2": {
                "prop1": "Tom"
            }
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
    })

    it('test insert entity', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityA", source);

        const entity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });

        expect({
            "StubEntityA::load": new LoadSourceAction(entity)
        }).to.eql(entityStore.actions);

        entityStore.sync();

        entity.prop1 = "hello";
        entity.prop2.prop1 = "Tom";

        expect({
            "StubEntityA::update": new UpdateSourceAction(entity)
        }).to.eql(entityStore.actions);

        const sourceStubEntityA: any = {
            "prop1": "hello!",
            "prop2": {
                "prop1": "Tom"
            }
        };
        source.updatedEntity = sourceStubEntityA;

        entityStore.sync();

        expect(sourceStubEntityA["prop1"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["prop2"]["prop1"]).to.eql(entity.prop2.prop1);

        expect([{
            "prop1": "hello",
            "prop2": {
                "prop1": "Tom"
            }
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
    })

    it('test update referenced entity property', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityA", source);

        const entity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });

        expect({
            "StubEntityA::load": new LoadSourceAction(entity)
        }).to.eql(entityStore.actions);

        const sourceStubEntityA = {
            "prop1": "hi",
            "prop2": {
                "prop1": "Tom"
            }
        };
        source.loadedEntities = [sourceStubEntityA];

        entityStore.sync();

        expect(sourceStubEntityA["prop1"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["prop2"]["prop1"]).to.eql(entity.prop2.prop1);

        entity.prop2.prop1 = "Tom";

        expect({
            "StubEntityA::update": new UpdateSourceAction(entity)
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect(entityStore.actions).is.empty;
    })

    it('test update entity with new referenced entity property', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityA", source);

        const entity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });

        expect({
            "StubEntityA::load": new LoadSourceAction(entity)
        }).to.eql(entityStore.actions);

        const sourceStubEntityA = {
            "prop1": "hi",
            "prop2": {
                "prop1": "Tom"
            }
        };
        source.loadedEntities = [sourceStubEntityA];

        entityStore.sync();

        expect(sourceStubEntityA["prop1"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["prop2"]["prop1"]).to.eql(entity.prop2.prop1);

        entity.prop2 = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityB",
            "ref": true,
            "properties": {
                "prop1": {
                    "value": ""
                }
            }
        }, entity);

        expect({
            "StubEntityA::update": new UpdateSourceAction(entity)
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([{
            "prop1": "hi",
            "prop2": {
                "prop1": ""
            }
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
    })

    it('test delete entity', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityA", source);

        const entity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });

        expect({
            "StubEntityA::load": new LoadSourceAction(entity)
        }).to.eql(entityStore.actions);

        const sourceStubEntityA = {
            "prop1": "hi",
            "prop2": {
                "prop1": "Tom"
            }
        };
        source.loadedEntities = [sourceStubEntityA];

        entityStore.sync();

        expect(sourceStubEntityA["prop1"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["prop2"]["prop1"]).to.eql(entity.prop2.prop1);

        entity.prop1 = "hello";
        entity.delete();

        expect({
            "StubEntityA::update": new UpdateSourceAction(entity),
            "StubEntityA::delete": new DeleteSourceAction(entity)
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([{
            "prop1": "hello",
            "prop2": {
                "prop1": "Tom"
            }
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
    })

    it('test entity collection', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityC", source);

        const cEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityC",
            "ref": false,
            "collectionItem": {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": ""
                    }
                }
            },
            "properties": {}
        });

        expect({
            "StubEntityC::load": new LoadSourceAction(cEntity)
        }).to.eql(entityStore.actions);

        const sourceStubEntityC = [{
                "prop1": "hi1"
            },{
                "prop1": "hi2"
        }];
        source.loadedEntities = [sourceStubEntityC];

        entityStore.sync();

        expect(sourceStubEntityC[0]["prop1"]).to.eql(cEntity.get(0).prop1);
        expect(sourceStubEntityC[1]["prop1"]).to.eql(cEntity.get(1).prop1);

        cEntity.get(1).prop1 = "Tom";

        expect({
            "StubEntityC=>StubEntityB[1]::update": new UpdateSourceAction(cEntity.get(1))
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([{
            "prop1": "Tom"
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
    })

    it('test with unreferenced entities', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityA", source);
        entityStore.addSource("StubEntityD", source);

        const aEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });
        const dEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityD",
            "ref": false,
            "properties": {
                "props": {
                    "entity": "StubEntityC",
                    "ref": true,
                    "collectionItem": {
                        "entity": "StubEntityB",
                        "ref": true,
                        "properties": {
                            "prop1": {
                                "value": ""
                            }
                        }
                    },
                    "properties": {}
                }
            }
        });

        expect({
            "StubEntityA::load": new LoadSourceAction(aEntity),
            "StubEntityD::load": new LoadSourceAction(dEntity)
        }).to.eql(entityStore.actions);

        const sourceStubEntityA = {
            "prop1": "hi",
            "prop2": {
                "prop1": ""
            }
        };
        
        const sourceStubEntityD = {
            "props": [{
                "prop1": "hi1"
            },{
                "prop1": "hi2"
            }]
        };
        source.loadedEntities = [sourceStubEntityA, sourceStubEntityD];

        entityStore.sync();

        expect(sourceStubEntityA["prop1"]).to.eql(aEntity.prop1);
        expect(sourceStubEntityA["prop2"]["prop1"]).to.eql(aEntity.prop2.prop1);
        expect(sourceStubEntityD["props"][0]["prop1"]).to.eql(dEntity.props.get(0).prop1);
        expect(sourceStubEntityD["props"][1]["prop1"]).to.eql(dEntity.props.get(1).prop1);

        aEntity.prop2.prop1 = "hello";
        dEntity.props.get(1).prop1 = "Tom";

        expect({
            "StubEntityA::update": new UpdateSourceAction(aEntity),
            "StubEntityD=>StubEntityC=>StubEntityB[1]::update": new UpdateSourceAction(dEntity.props.get(1))
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([{
            "prop1": "hi",
            "prop2": {
                "prop1": "hello"
            }
        },{
            "prop1": "Tom"
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
    })

    it('test entity collection with unreferenced entity', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityB", source);
        entityStore.addSource("StubEntityE", source);

        const eEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityE",
            "ref": false,
            "collectionItem": {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": ""
                    }
                }
            },
            "properties": {}
        });
        const bEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityB",
            "ref": true,
            "properties": {
                "prop1": {
                    "value": ""
                }
            }
        });

        expect({
            "StubEntityE::load": new LoadSourceAction(eEntity),
            "StubEntityB::load": new LoadSourceAction(bEntity)
        }).to.eql(entityStore.actions);

        const sourceStubEntityE = [{
            "prop1": "hi1"
        },{
            "prop1": "hi2"
        }];
        const sourceStubEntityB = {
            "prop1": "hello"
        };
        source.loadedEntities = [sourceStubEntityE, sourceStubEntityB];

        entityStore.sync();

        expect(sourceStubEntityE[0]["prop1"]).to.eql(eEntity.get(0).prop1);
        expect(sourceStubEntityE[1]["prop1"]).to.eql(eEntity.get(1).prop1);
        expect(sourceStubEntityB["prop1"]).to.eql(bEntity.prop1);

        eEntity.get(0).prop1 = "Alice";
        eEntity.get(1).prop1 = "Tom";
        bEntity.prop1 = "Hi";

        expect({
            "StubEntityE=>StubEntityB[0]::update": new UpdateSourceAction(eEntity.get(0)),
            "StubEntityE=>StubEntityB[1]::update": new UpdateSourceAction(eEntity.get(1)),
            "StubEntityB::update": new UpdateSourceAction(bEntity)
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([{
                "prop1": "Alice"
            },{
                "prop1": "Tom"
            },{
                "prop1": "Hi"
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
    })

    it('test add entity into entity collection', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityC", source);

        const cEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityC",
            "ref": false,
            "collectionItem": {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": ""
                    }
                }
            },
            "properties": {}
        });

        expect({
            "StubEntityC::load": new LoadSourceAction(cEntity),
        }).to.eql(entityStore.actions);

        let sourceStubEntityC = [{
            "prop1": "hi1"
        },{
            "prop1": "hi2"
        }];
        source.loadedEntities = [sourceStubEntityC];

        entityStore.sync();

        expect(sourceStubEntityC[0]["prop1"]).to.eql(cEntity.get(0).prop1);
        expect(sourceStubEntityC[1]["prop1"]).to.eql(cEntity.get(1).prop1);

        expect(entityStore.actions).is.empty;

        const bEntity = cEntity.add();

        bEntity.prop1 = "hello";

        expect({
            "StubEntityC=>StubEntityB[2]::update": new UpdateSourceAction(bEntity),
            "StubEntityC::load": new LoadSourceAction(cEntity),
        }).to.eql(entityStore.actions);

        sourceStubEntityC = [{
            "prop1": "hi1"
        },{
            "prop1": "hi2"
        },{
            "prop1": "hello"
        }];
        source.loadedEntities = [sourceStubEntityC];

        entityStore.sync();

        expect([{
                "prop1": "hello"
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;

        expect(sourceStubEntityC[0]["prop1"]).to.eql(cEntity.get(0).prop1);
        expect(sourceStubEntityC[1]["prop1"]).to.eql(cEntity.get(1).prop1);
        expect(sourceStubEntityC[2]["prop1"]).to.eql(cEntity.get(2).prop1);
    })

    it('test delete entity from entity collection', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityC", source);

        const cEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityC",
            "ref": false,
            "collectionItem": {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": ""
                    }
                }
            },
            "properties": {}
        });

        expect({
            "StubEntityC::load": new LoadSourceAction(cEntity),
        }).to.eql(entityStore.actions);

        let sourceStubEntityC = [{
            "prop1": "hi1"
        },{
            "prop1": "hi2"
        },{
            "prop1": "hi3"
        }];
        source.loadedEntities = [sourceStubEntityC];

        entityStore.sync();

        expect(sourceStubEntityC[0]["prop1"]).to.eql(cEntity.get(0).prop1);
        expect(sourceStubEntityC[1]["prop1"]).to.eql(cEntity.get(1).prop1);
        expect(sourceStubEntityC[2]["prop1"]).to.eql(cEntity.get(2).prop1);

        expect(entityStore.actions).is.empty;

        cEntity.remove(1);

        expect({
            "StubEntityC=>StubEntityB[1]::delete": new DeleteSourceAction(cEntity.get(1)),
            "StubEntityC::load": new LoadSourceAction(cEntity),
        }).to.eql(entityStore.actions);

        sourceStubEntityC = [{
            "prop1": "hi1"
        },{
            "prop1": "hi3"
        }];
        source.loadedEntities = [sourceStubEntityC];

        entityStore.sync();

        expect([{
                "prop1": "hi2"
        }]).to.eql(source.deletedEntities);
        expect(entityStore.actions).is.empty;
    })

    it('test delete entity from unrefered entity collection', () => {
        const entityStore = new EntityStore();

        const source = new MockSource();

        entityStore.addSource("StubEntityE", source);
        entityStore.addSource("StubEntityB", source);

        const eEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityE",
            "ref": false,
            "collectionItem": {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": ""
                    }
                }
            },
            "properties": []
        });

        expect({
            "StubEntityE::load": new LoadSourceAction(eEntity)
        }).to.eql(entityStore.actions);

        let sourceStubEntityE = [{
            "prop1": "hi1"
        },{
            "prop1": "hi2"
        },{
            "prop1": "hi3"
        }];
        source.loadedEntities = [sourceStubEntityE];

        entityStore.sync();

        expect(sourceStubEntityE[0]["prop1"]).to.eql(eEntity.get(0).prop1);
        expect(sourceStubEntityE[1]["prop1"]).to.eql(eEntity.get(1).prop1);
        expect(sourceStubEntityE[2]["prop1"]).to.eql(eEntity.get(2).prop1);

        eEntity.remove(1);

        expect({
            "StubEntityE=>StubEntityB[1]::delete": new DeleteSourceAction(eEntity.get(1)),
            "StubEntityE::load": new LoadSourceAction(eEntity)
        }).to.eql(entityStore.actions);

        sourceStubEntityE = [{
            "prop1": "hi1"
        },{
            "prop1": "hi3"
        }];
        source.loadedEntities = [sourceStubEntityE];

        entityStore.sync();

        expect(sourceStubEntityE[0]["prop1"]).to.eql(eEntity.get(0).prop1);
        expect(sourceStubEntityE[1]["prop1"]).to.eql(eEntity.get(1).prop1);

        expect([{
            "prop1": "hi2"
        }]).to.eql(source.deletedEntities);
        expect(entityStore.actions).is.empty;
    })

    it('test entity store sync with another entity store', () => {
        const entityStore = new EntityStore();
        const remoteEntityStore = new EntityStore();

        const source = new MockSource();
        const bridge = new MockBridge();

        entityStore.addSource("StubEntityA", source);
        remoteEntityStore.addSource("StubEntityA", source);

        const entity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });
        const remoteEntity = EntityFactory.newEntity(remoteEntityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });

        expect({
            "StubEntityA::load": new LoadSourceAction(entity)
        }).to.eql(entityStore.actions);
        expect({
            "StubEntityA::load": new LoadSourceAction(remoteEntity)
        }).to.eql(remoteEntityStore.actions);

        source.loadedEntities = [{
            "prop1": "hi!",
            "prop2": {
                "prop1": ""
            }
        },{
            "prop1": "this is sync hello!",
            "prop2": {
                "prop1": "this is sync, Tom!"
            }
        },{
            "prop1": "this is sync hello!",
            "prop2": {
                "prop1": "this is sync, Tom!"
            }
        }];

        bridge.onReceived((actions: any) => {
            remoteEntityStore.syncFrom(bridge, actions, () => {
                
            });
        });

        entityStore.syncTo(bridge);

        expect("this is sync hello!").to.eql(entity.prop1);
        expect("this is sync, Tom!").to.eql(entity.prop2.prop1);
        expect(entity.prop1).to.eql(remoteEntity.prop1);
        expect(entity.prop2.prop1).to.eql(remoteEntity.prop2.prop1);

        entity.prop1 = "this is sync update";
        entity.prop1 = "this is sync update!";
        entity.prop2.prop1 = "this is sync update, Tom";

        bridge.onReceived((actions: any) => {
            remoteEntityStore.syncFrom(bridge, actions, () => {
                
            });
        });

        entityStore.syncTo(bridge);

        expect("this is sync update!").to.eql(entity.prop1);
        expect("this is sync update, Tom").to.eql(entity.prop2.prop1);
        expect(entity.prop1).to.eql(remoteEntity.prop1);
        expect(entity.prop2.prop1).to.eql(remoteEntity.prop2.prop1);

        expect([{
            "prop1": "this is sync update!",
            "prop2": {
                "prop1": "this is sync update, Tom"
            }
        },{
            "prop1": "this is sync update!",
            "prop2": {
                "prop1": "this is sync update, Tom"
            }
        },{
            "prop1": "this is sync update!",
            "prop2": {
                "prop1": "this is sync update, Tom"
            }
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
        expect(remoteEntityStore.actions).is.empty;

        //    1. $remoteEntityStore invia la sua coda di azioni
        //    2. $entityStore riceve la coda da $remoteEntityStore
        //    3. $entityStore si sincronizza
        //    4. $entityStore ritorna la lista di entity sincronizzate
        //    5. $remoteEntityStore riceve la lista di entity sincronizzate
        //    6. $remoteEntityStore si sincronizza
    })

    it('test add entity into unrefered entity collection and sync with another entity store', () => {
        const entityStore = new EntityStore();
        const remoteEntityStore = new EntityStore();

        const source = new MockSource();
        const bridge = new MockBridge();

        entityStore.addSource("StubEntityE", source);
        entityStore.addSource("StubEntityB", source);
        remoteEntityStore.addSource("StubEntityE", source);
        remoteEntityStore.addSource("StubEntityB", source);

        const eEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityE",
            "ref": false,
            "collectionItem": {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": ""
                    }
                }
            },
            "properties": []
        });
        const remoteEEntity = EntityFactory.newEntity(remoteEntityStore, {
            "entity": "StubEntityE",
            "ref": false,
            "collectionItem": {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": ""
                    }
                }
            },
            "properties": []
        });

        expect({
            "StubEntityE::load": new LoadSourceAction(eEntity)
        }).to.eql(entityStore.actions);
        expect({
            "StubEntityE::load": new LoadSourceAction(remoteEEntity)
        }).to.eql(remoteEntityStore.actions);

        source.loadedEntities = [[{
            "prop1": "hi1"
        },{
            "prop1": "hi2"
        }]];

        bridge.onReceived((actions: any) => {
            remoteEntityStore.syncFrom(bridge, actions, () => {

            });
        });

        entityStore.syncTo(bridge);

        expect("hi1").to.eql(eEntity.get(0).prop1);
        expect("hi2").to.eql(eEntity.get(1).prop1);
        expect("hi1").to.eql(remoteEEntity.get(0).prop1);
        expect("hi2").to.eql(remoteEEntity.get(1).prop1);

        const bEntity = eEntity.add();
        bEntity.prop1 = "hello";

        expect({
            "StubEntityE=>StubEntityB[2]::update": new UpdateSourceAction(bEntity),
            "StubEntityE::load": new LoadSourceAction(eEntity)
        }).to.eql(entityStore.actions);

        source.loadedEntities = [[{
            "prop1": "hi1"
        },{
            "prop1": "hi2"
        },{
            "prop1": "hello"
        }]];

        bridge.onReceived((actions: any) => {
            remoteEntityStore.syncFrom(bridge, actions, () => {
                
            });
        });

        entityStore.syncTo(bridge);

        expect("hi1").to.eql(eEntity.get(0).prop1);
        expect("hi2").to.eql(eEntity.get(1).prop1);
        expect("hello").to.eql(eEntity.get(2).prop1);
        expect("hi1").to.eql(remoteEEntity.get(0).prop1);
        expect("hi2").to.eql(remoteEEntity.get(1).prop1);
        expect("hello").to.eql(remoteEEntity.get(2).prop1);

        expect([{
            "prop1": "hello"
        },{
            "prop1": "hello"
        },{
            "prop1": "hello"
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
        expect(remoteEntityStore.actions).is.empty;
    })

    it('test delete entity from unrefered entity collection and sync with another entity store', () => {
        const entityStore = new EntityStore();
        const remoteEntityStore = new EntityStore();

        const source = new MockSource();
        const bridge = new MockBridge();

        entityStore.addSource("StubEntityE", source);
        entityStore.addSource("StubEntityB", source);
        remoteEntityStore.addSource("StubEntityE", source);
        remoteEntityStore.addSource("StubEntityB", source);

        const eEntity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityE",
            "ref": false,
            "collectionItem": {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": ""
                    }
                }
            },
            "properties": []
        });
        const remoteEEntity = EntityFactory.newEntity(remoteEntityStore, {
            "entity": "StubEntityE",
            "ref": false,
            "collectionItem": {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": ""
                    }
                }
            },
            "properties": []
        });

        expect({
            "StubEntityE::load": new LoadSourceAction(eEntity)
        }).to.eql(entityStore.actions);
        expect({
            "StubEntityE::load": new LoadSourceAction(remoteEEntity)
        }).to.eql(remoteEntityStore.actions);

        source.loadedEntities = [
            [{
                "prop1": "hi1"
            },{
                "prop1": "hi2"
            }]
        ];

        bridge.onReceived((actions: any) => {
            remoteEntityStore.syncFrom(bridge, actions, () => {

            });
        });

        entityStore.syncTo(bridge);

        expect("hi1").to.eql(eEntity.get(0).prop1);
        expect("hi2").to.eql(eEntity.get(1).prop1);
        expect("hi1").to.eql(remoteEEntity.get(0).prop1);
        expect("hi2").to.eql(remoteEEntity.get(1).prop1);

        eEntity.remove(1);

        expect({
            "StubEntityE=>StubEntityB[1]::delete": new DeleteSourceAction(eEntity.get(1)),
            "StubEntityE::load": new LoadSourceAction(eEntity)
        }).to.eql(entityStore.actions);

        source.loadedEntities = [
            [{
                "prop1": "hi1"
            }]
        ];

        bridge.onReceived((actions: any) => {
            remoteEntityStore.syncFrom(bridge, actions, () => {
                
            });
        });

        entityStore.syncTo(bridge);

        expect("hi1").to.eql(eEntity.get(0).prop1);
        expect("hi1").to.eql(remoteEEntity.get(0).prop1);

        expect([{
            "prop1": "hi2"
        },{
            "prop1": "hi2"
        },{
            "prop1": "hi2"
        }]).to.eql(source.deletedEntities);
        expect(entityStore.actions).is.empty;
        expect(remoteEntityStore.actions).is.empty;
    })

    it('test entity store sync with another entity store with null source', () => {
        const entityStore = new EntityStore();
        const remoteEntityStore = new EntityStore();

        const source = new MockSource();
        const bridge = new MockBridge();

        remoteEntityStore.addSource("StubEntityA", source);

        const entity = EntityFactory.newEntity(entityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });
        const remoteEntity = EntityFactory.newEntity(remoteEntityStore, {
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": ""
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": ""
                        }
                    }
                }
            }
        });

        expect({
            "StubEntityA::load": new LoadSourceAction(entity)
        }).to.eql(entityStore.actions);
        expect({
            "StubEntityA::load": new LoadSourceAction(remoteEntity)
        }).to.eql(remoteEntityStore.actions);

        source.loadedEntities = [{
            "prop1": "this is sync hello!",
            "prop2": {
                "prop1": "this is sync, Tom!"
            }
        }];

        bridge.onReceived((actions: any) => {
            remoteEntityStore.syncFrom(bridge, actions, () => {
                
            });
        });

        entityStore.syncTo(bridge);

        expect("this is sync hello!").to.eql(entity.prop1);
        expect("this is sync, Tom!").to.eql(entity.prop2.prop1);
        expect(entity.prop1).to.eql(remoteEntity.prop1);
        expect(entity.prop2.prop1).to.eql(remoteEntity.prop2.prop1);

        entity.prop1 = "this is sync update";
        entity.prop1 = "this is sync update!";
        entity.prop2.prop1 = "this is sync update, Tom";

        bridge.onReceived((actions: any) => {
            remoteEntityStore.syncFrom(bridge, actions, () => {
                
            });
        });

        entityStore.syncTo(bridge);

        expect("this is sync update!").to.eql(entity.prop1);
        expect("this is sync update, Tom").to.eql(entity.prop2.prop1);
        expect(entity.prop1).to.eql(remoteEntity.prop1);
        expect(entity.prop2.prop1).to.eql(remoteEntity.prop2.prop1);

        expect([{
            "prop1": "this is sync update!",
            "prop2": {
                "prop1": "this is sync update, Tom"
            }
        }]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
        expect(remoteEntityStore.actions).is.empty;
    })
});
