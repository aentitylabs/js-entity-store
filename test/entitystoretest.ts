import { describe, it } from 'mocha'
import { expect } from 'chai'
import { EntityStore } from '../src/entitystore';
import { MockSource } from '../src/test/mocksource';
import { Entity } from '../src/entity';
import { EntityFactory } from '../src/entityfactory';
import { LoadSourceAction } from '../src/loadsourceaction';
import { UpdateSourceAction } from '../src/updatesourceaction';
import { DeleteSourceAction } from '../src/deletesourceaction';


describe('Broker', () => {
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
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": "hi"
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
        };
        source.loadedEntities = [sourceStubEntityA];

        entityStore.sync();

        expect(sourceStubEntityA["properties"]["prop1"]["value"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["properties"]["prop2"]["properties"]["prop1"]["value"]).to.eql(entity.prop2.prop1);

        entity.prop1 = "hello";
        entity.prop1 = "hello!";
        entity.prop2.prop1 = "Tom";

        expect({
            "StubEntityA::update": new UpdateSourceAction(entity)
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([
            {
                "entity": "StubEntityA",
                "ref": false,
                "properties": {
                    "prop1": {
                        "value": "hello!"
                    },
                    "prop2": {
                        "entity": "StubEntityB",
                        "ref": true,
                        "properties": {
                            "prop1": {
                                "value": "Tom"
                            }
                        }
                    }
                }
            }
        ]).to.eql(source.updateEntities);
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
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": "hello!"
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": "Tom"
                        }
                    }
                }
            }
        };
        source.updatedEntity = sourceStubEntityA;

        entityStore.sync();

        expect(sourceStubEntityA["properties"]["prop1"]["value"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["properties"]["prop2"]["properties"]["prop1"]["value"]).to.eql(entity.prop2.prop1);

        expect([
            {
                "entity": "StubEntityA",
                "ref": false,
                "properties": {
                    "prop1": {
                        "value": "hello"
                    },
                    "prop2": {
                        "entity": "StubEntityB",
                        "ref": true,
                        "properties": {
                            "prop1": {
                                "value": "Tom"
                            }
                        }
                    }
                }
            }
        ]).to.eql(source.updateEntities);
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
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": "hi"
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": "Tom"
                        }
                    }
                }
            }
        };
        source.loadedEntities = [sourceStubEntityA];

        entityStore.sync();

        expect(sourceStubEntityA["properties"]["prop1"]["value"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["properties"]["prop2"]["properties"]["prop1"]["value"]).to.eql(entity.prop2.prop1);

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
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": "hi"
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": "Tom"
                        }
                    }
                }
            }
        };
        source.loadedEntities = [sourceStubEntityA];

        entityStore.sync();

        expect(sourceStubEntityA["properties"]["prop1"]["value"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["properties"]["prop2"]["properties"]["prop1"]["value"]).to.eql(entity.prop2.prop1);

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

        expect([
            {
                "entity": "StubEntityA",
                "ref": false,
                "properties": {
                    "prop1": {
                        "value": "hi"
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
            }
        ]).to.eql(source.updateEntities);
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
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": "hi"
                },
                "prop2": {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": "Tom"
                        }
                    }
                }
            }
        };
        source.loadedEntities = [sourceStubEntityA];

        entityStore.sync();

        expect(sourceStubEntityA["properties"]["prop1"]["value"]).to.eql(entity.prop1);
        expect(sourceStubEntityA["properties"]["prop2"]["properties"]["prop1"]["value"]).to.eql(entity.prop2.prop1);

        entity.prop1 = "hello";
        entity.delete();

        expect({
            "StubEntityA::update": new UpdateSourceAction(entity),
            "StubEntityA::delete": new DeleteSourceAction(entity)
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([
            {
                "entity": "StubEntityA",
                "ref": false,
                "properties": {
                    "prop1": {
                        "value": "hello"
                    },
                    "prop2": {
                        "entity": "StubEntityB",
                        "ref": true,
                        "properties": {
                            "prop1": {
                                "value": "Tom"
                            }
                        }
                    }
                }
            }
        ]).to.eql(source.updateEntities);
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
            "properties": []
        });

        expect({
            "StubEntityC::load": new LoadSourceAction(cEntity)
        }).to.eql(entityStore.actions);

        const sourceStubEntityC = {
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
            "properties": [
                {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": "hi1"
                        }
                    }
                },
                {
                    "entity": "StubEntityB",
                    "ref": true,
                    "properties": {
                        "prop1": {
                            "value": "hi2"
                        }
                    }
                }
            ]
        };
        source.loadedEntities = [sourceStubEntityC];

        entityStore.sync();

        expect(sourceStubEntityC["properties"][0]["properties"]["prop1"]["value"]).to.eql(cEntity.get(0).prop1);
        expect(sourceStubEntityC["properties"][1]["properties"]["prop1"]["value"]).to.eql(cEntity.get(1).prop1);

        cEntity.get(1).prop1 = "Tom";

        expect({
            "StubEntityC=>StubEntityB[1]::update": new UpdateSourceAction(cEntity.get(1))
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([
            {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": "Tom"
                    }
                }
            }
        ]).to.eql(source.updateEntities);
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
            "entity": "StubEntityA",
            "ref": false,
            "properties": {
                "prop1": {
                    "value": "hi"
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
        };
        const sourceStubEntityD = {
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
                    "properties": [
                        {
                            "entity": "StubEntityB",
                            "ref": true,
                            "properties": {
                                "prop1": {
                                    "value": "hi1"
                                }
                            }
                        },
                        {
                            "entity": "StubEntityB",
                            "ref": true,
                            "properties": {
                                "prop1": {
                                    "value": "hi2"
                                }
                            }
                        }
                    ]
                }
            }
        };
        source.loadedEntities = [sourceStubEntityA, sourceStubEntityD];

        entityStore.sync();

        expect(sourceStubEntityA["properties"]["prop1"]["value"]).to.eql(aEntity.prop1);
        expect(sourceStubEntityA["properties"]["prop2"]["properties"]["prop1"]["value"]).to.eql(aEntity.prop2.prop1);
        expect(sourceStubEntityD["properties"]["props"]["properties"][0]["properties"]["prop1"]["value"]).to.eql(dEntity.props.get(0).prop1);
        expect(sourceStubEntityD["properties"]["props"]["properties"][1]["properties"]["prop1"]["value"]).to.eql(dEntity.props.get(1).prop1);

        aEntity.prop2.prop1 = "hello";
        dEntity.props.get(1).prop1 = "Tom";

        expect({
            "StubEntityA::update": new UpdateSourceAction(aEntity),
            "StubEntityD=>StubEntityC=>StubEntityB[1]::update": new UpdateSourceAction(dEntity.props.get(1))
        }).to.eql(entityStore.actions);

        entityStore.sync();

        expect([
            {
                "entity": "StubEntityA",
                "ref": false,
                "properties": {
                    "prop1": {
                        "value": "hi"
                    },
                    "prop2": {
                        "entity": "StubEntityB",
                        "ref": true,
                        "properties": {
                            "prop1": {
                                "value": "hello"
                            }
                        }
                    }
                }
            },
            {
                "entity": "StubEntityB",
                "ref": true,
                "properties": {
                    "prop1": {
                        "value": "Tom"
                    }
                }
            }
        ]).to.eql(source.updateEntities);
        expect(entityStore.actions).is.empty;
    })
});
