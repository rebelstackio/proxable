import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Proxable, ChangeEvent } from '../../src';

describe ( 'Proxable', () => {

	it ( 'should fire callback only for exact subscribed path', () => {
		const store = { a: { b: 1 }, x: 0 };
		const obs = Proxable.create ( store );
		let called = false;
		const off = obs.subscribe ( 'a.b', ( v:any, p:string[] ) => {
			called = true;
			assert.deepEqual ( p, ['a', 'b'] );
			assert.equal ( v, 2 );
		});

		obs.x = 5;
		assert.equal ( called, false );

		obs.a.b = 2;
		assert.equal ( called, true );
		off();
	});

	it ( 'should fire callback when subscribed path is created later', () => {
		const obs = Proxable.create ( );
		let evt: ChangeEvent | undefined;
		const off = obs.subscribe('foo.bar', (v:any, p:string[]) => {
		evt = { path: p, value: v };
		});

		obs.foo = {};
		assert.deepEqual(evt, { path: ['foo'], value: {} });

		obs.foo.bar = 42;
		assert.deepEqual(evt, { path: ['foo', 'bar'], value: 42 });
		off();
	});

	it ( 'should match single-segment wildcard paths', () => {
		const store = { u: { a: { name: 'old' } } };
		const obs = Proxable.create ( store );

		let got: ChangeEvent | undefined;
		const off = obs.subscribe ( 'u.*.name', (v, p) => {
			got = { path: p, value: v };
		});

		obs.u.a.name = 'new';
		assert.deepEqual ( got, { path: ['u', 'a', 'name'], value: 'new' } );

		got = undefined;
		(obs.u as any).a.x = 1;
		assert.equal ( got, undefined );
		off();
	});

	it ( 'should receive events for every set when subscribing to "*" wildcard', () => {
		const obs = Proxable.create ( );
		obs.m = 0;
		const events: ChangeEvent[] = [];
		const offAll = obs.subscribe ( '*', (v, p) => {
			events.push ( { path: p, value: v } );
		});

		obs.m = 10;
		obs.n = 20;

		assert.equal ( events.length, 2 );
		assert.deepEqual ( events[0], { path: ['m'], value: 10 } );
		assert.deepEqual ( events[1], { path: ['n'], value: 20 } );
		offAll();
	});

	it ( 'should not fire callbacks after unsubscribe', () => {
		type teststore = { p: number };
		const store = { p: 1 } as teststore;
		const obs = Proxable.create<teststore> ( store );

		let count = 0;
		const off1 = obs.subscribe ( 'p', () => count++ );
		const offAll = obs.subscribe ( '*', () => (count += 10) );

		obs.p = 2;
		assert.equal ( count, 11 );

		off1();
		obs.p = 3;
		assert.equal ( count, 21 );

		offAll();
		obs.p = 4;
		assert.equal ( count, 21 );
	});

});