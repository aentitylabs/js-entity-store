!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.jsentitystore=t():e.jsentitystore=t()}(this,(function(){return(()=>{"use strict";var e={534:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Bridge=void 0,t.Bridge=class{}},665:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DeleteSourceAction=void 0;const r=i(608),s=i(58);class o extends s.SourceAction{constructor(e){super("DeleteSourceAction",e)}sync(e){const t=this.entity.serialize(),i=r.EntityFactory.buildEntityDataFromSchema(t);this.validateDelete(i),e.delete(i)}}t.DeleteSourceAction=o},753:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Entity=void 0;const r=i(608),s=i(92),o=i(190);t.Entity=class{constructor(e,t,i,s){let n;this._properties={},this._isReferenced=!1,this._source=new o.NullSource,this._isItem=!1,this._isCollection=!1,this._item={},this._entityStore=e,this._name=t,this._key=t,this._item=s,this._isCollection=!!s,null!=i&&null!=i&&(this._key=i.getKey()+"=>"+this._key,this._isReferenced=!0,n=i._source),this._ref=i,this._entityStore.register(this,n),i||(this._ref=this,this._entityStore.load(this)),this._item&&(this._itemPrototype=r.EntityFactory.newEntity(this._entityStore,this._item,this))}setKey(e){this._key=e}getKey(){return this._key}setName(e){this._name=e}getName(){return this._name}getRef(){return this._ref}getProperties(){return this._properties}getSource(){return this._source}getEntityStore(){return this._entityStore}setSource(e){this._source=e}isReferenced(){return this._isReferenced}isCollection(){return this._isCollection}setIsItem(e){this._isItem=e}isItem(){return this._isItem}getItem(){return this._item}getItemPrototype(){return this._itemPrototype}delete(){this._entityStore.delete(this)}get(e){return this._properties[e].value}add(){const e=r.EntityFactory.newEntity(this._entityStore,this._item,this);e.deserialize(this.getItem());const t=Object.keys(this.getProperties()).length;return this.getProperties()[t]=e,e.setKey(e.getKey()+"["+t+"]"),e.setIsItem(!0),this.getEntityStore().register(e,this.getSource()),this.getEntityStore().update(e),this.getEntityStore().load(this),e}remove(e){const t=this.get(e);this.getEntityStore().delete(t),this.getEntityStore().load(this)}serialize(){const e={};for(var t in e.entity=this.getName(),e.properties={},e.ref=this.isReferenced(),this.getProperties())e.properties[t]=this.getProperties()[t].serialize();return e}deserialize(e){if(this.setName(e.entity),!e.properties)return;let t=0;for(let i in e.properties){const r=new s.EntityProperty(this.getEntityStore(),this);if(r.deserialize(e.properties[i]),this.getProperties()[i]=r,this.isCollection()){const e=r.value;e.setKey(e.getKey()+"["+t+"]"),e.setIsItem(!0),this.getEntityStore().register(e,this.getSource())}t++}}}},608:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EntityFactory=void 0;const r=i(753),s=i(557);class o{static newEntity(e,t,i){let o=null;return o=t.collectionItem?new r.Entity(e,t.entity,i,t.collectionItem):new r.Entity(e,t.entity,i),o.deserialize(t),new Proxy(o,new s.EntityHandler)}static buildEntitySchemaFromData(e,t){const i={};i.entity=e.getName(),i.properties={},i.ref=e.isReferenced();for(let r in t)!0===e.isCollection()?(i.collectionItem=e.getItem(),e.getItemPrototype()&&(i.properties[r]=o.buildEntitySchemaFromData(e.getItemPrototype(),t[r]))):!0===e.getProperties()[r].isEntity?i.properties[r]=o.buildEntitySchemaFromData(e.getProperties()[r].value,t[r]):i.properties[r]={value:t[r]};return i}static buildEntityDataFromSchema(e){const t={};for(let i in e.properties)e.properties[i].entity?t[i]=o.buildEntityDataFromSchema(e.properties[i]):t[i]=e.properties[i].value;return t}}t.EntityFactory=o},557:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EntityHandler=void 0,t.EntityHandler=class{get(e,t,i){return e.getProperties()[t]?e.getProperties()[t].value:e[t]}set(e,t,i){return e.getProperties()[t]?(e.getProperties()[t].value=i,e.getEntityStore().update(e),!0):(e[t]=i,!0)}}},92:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EntityProperty=void 0;const r=i(608);t.EntityProperty=class{constructor(e,t){this._isEntity=!1,this._entityStore=e,this._ref=t}get isEntity(){return this._isEntity}get value(){return this._value}set value(e){this._value=e}serialize(){return!0===this._isEntity?this._value.serialize():{value:this._value}}deserialize(e){if(e.entity){const t=!0===e.ref?this._ref:void 0;return this._value=r.EntityFactory.newEntity(this._entityStore,e,t),this._isEntity=!0,void this._value.deserialize(e)}this._value=e.value}}},758:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EntityStore=void 0;const r=i(665),s=i(608),o=i(328),n=i(190),c=i(172),u=i(246);t.EntityStore=class{constructor(){this._sources={},this._entities={},this._actions={}}get actions(){return this._actions}addSource(e,t){this._sources[e]=t}register(e,t){this._entities[e.getKey()]=e,t?e.setSource(t):this._sources[e.getName()]?e.setSource(this._sources[e.getName()]):e.setSource(new n.NullSource)}sync(){for(;Object.keys(this._actions).length>0;){const e=Object.keys(this._actions)[0],t=this._actions[e];t.sync(t.entity.getSource()),delete this._actions[e]}}syncTo(e){return new Promise(((t,i)=>{const r={};for(const e in this._actions){const t=this._actions[e];t.sync(t.entity.getSource()),r[e]=c.SourceActionFactory.serialize(t)}if(0===Object.keys(r).length)return t();e.send(r,(e=>{for(;Object.keys(this._actions).length>0;){const t=Object.keys(this._actions)[0],i=this._actions[t],r=i.entity.getName();e[r]&&(i.entity.deserialize(e[r]),this._sources[r]&&i.sync(this._sources[r])),delete this._actions[t]}t()}))}))}syncFrom(e,t,i){const r={},o={};for(const e in t){const i=t[e];this._entities[i.entityKey]||(this._entities[i.entityKey]=s.EntityFactory.newEntity(this,i.entity,this._entities[i.refKey]));const n=this._entities[i.entityKey];n.deserialize(i.entity),r[e]=c.SourceActionFactory.deserialize(i,n);const u=r[e].entity.getName();this._sources[u]&&(r[e].sync(this._sources[u]),o[u]=r[e].entity)}i(),this.sync();const n={};for(const e in o)n[e]=o[e].serialize();e.reply(n)}load(e){if(e.isReferenced()&&!e.isItem()&&e.getRef())return this.load(e.getRef());this._actions[e.getKey()+"::load"]=new o.LoadSourceAction(e)}update(e){if(e.isReferenced()&&!e.isItem()&&e.getRef())return this.update(e.getRef());this._actions[e.getKey()+"::update"]=new u.UpdateSourceAction(e)}delete(e){if(e.isReferenced()&&!e.isItem()&&e.getRef())return this.delete(e.getRef());this._actions[e.getKey()+"::delete"]=new r.DeleteSourceAction(e)}}},328:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LoadSourceAction=void 0;const r=i(608),s=i(58);class o extends s.SourceAction{constructor(e){super("LoadSourceAction",e)}sync(e){const t=this.entity.serialize(),i=r.EntityFactory.buildEntityDataFromSchema(t),s=e.load(i);this.validateLoad(s);const o=r.EntityFactory.buildEntitySchemaFromData(this.entity,s);this.entity.deserialize(o)}}t.LoadSourceAction=o},190:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.NullSource=void 0;const r=i(886);class s extends r.Source{load(e){return e}update(e){return e}delete(e){}}t.NullSource=s},625:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.NullSourceAction=void 0;const r=i(58);class s extends r.SourceAction{constructor(e){super("NullSourceAction",e)}sync(e){throw new Error("NullSourceAction: method not implemented.")}}t.NullSourceAction=s},886:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Source=void 0,t.Source=class{}},58:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SourceAction=void 0,t.SourceAction=class{constructor(e,t){this._type=e,this._entity=t}get type(){return this._type}get entity(){return this._entity}set entity(e){this._entity=e}validateLoad(e){}validateUpdate(e){}validateDelete(e){}}},172:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SourceActionFactory=void 0;const r=i(665),s=i(328),o=i(625),n=i(246);t.SourceActionFactory=class{static serialize(e){const t={};return t.type=e.type,t.entityKey=e.entity.getKey(),t.entityType=e.entity.getName(),t.entity=e.entity.serialize(),t.refKey=e.entity.getRef()?e.entity.getRef().getKey():void 0,t}static deserialize(e,t){switch(e.type){case"LoadSourceAction":return new s.LoadSourceAction(t);case"UpdateSourceAction":return new n.UpdateSourceAction(t);case"DeleteSourceAction":return new r.DeleteSourceAction(t)}return new o.NullSourceAction(t)}}},246:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UpdateSourceAction=void 0;const r=i(608),s=i(58);class o extends s.SourceAction{constructor(e){super("UpdateSourceAction",e)}sync(e){const t=this.entity.serialize(),i=r.EntityFactory.buildEntityDataFromSchema(t);this.validateUpdate(i);const s=e.update(i),o=r.EntityFactory.buildEntitySchemaFromData(this.entity,s);this.entity.deserialize(o)}}t.UpdateSourceAction=o}},t={};function i(r){var s=t[r];if(void 0!==s)return s.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,i),o.exports}var r={};return(()=>{var e=r;Object.defineProperty(e,"__esModule",{value:!0}),e.Bridge=e.Source=e.Entity=e.EntityFactory=e.EntityStore=void 0;const t=i(758);Object.defineProperty(e,"EntityStore",{enumerable:!0,get:function(){return t.EntityStore}});const s=i(608);Object.defineProperty(e,"EntityFactory",{enumerable:!0,get:function(){return s.EntityFactory}});const o=i(753);Object.defineProperty(e,"Entity",{enumerable:!0,get:function(){return o.Entity}});const n=i(886);Object.defineProperty(e,"Source",{enumerable:!0,get:function(){return n.Source}});const c=i(534);Object.defineProperty(e,"Bridge",{enumerable:!0,get:function(){return c.Bridge}})})(),r})()}));
//# sourceMappingURL=entitystore.js.map