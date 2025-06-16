import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SubscriptionIndex } from '../../src/subscription-index';

describe('SubscriptionIndex', () => {
	it('matches an exact path listener', () => {
		const idx = new SubscriptionIndex();
		const fn = () => {};
		const off = idx.add('foo.bar.baz', fn);

		const listeners = idx.match(['foo','bar','baz']);
		assert.ok(listeners.has(fn));
		assert.equal(listeners.size, 1);

		off();
	});

	it('matches single-segment wildcard (*)', () => {
		const idx = new SubscriptionIndex();
		const fn = () => {};
		idx.add('foo.*.baz', fn);

		assert.ok(idx.match(['foo','anyKey','baz']).has(fn));
		assert.equal(idx.match(['foo','other','baz']).size, 1);
		// should not match deeper
		assert.equal(idx.match(['foo','x','y','baz']).size, 0);
	});

	it('matches recursive wildcard (**) at any depth', () => {
		const idx = new SubscriptionIndex();
		const fn = () => {};
		idx.add('settings.**.theme', fn);

		assert.ok(idx.match(['settings','theme']).has(fn));
		assert.ok(idx.match(['settings','ui','theme']).has(fn));
		assert.ok(idx.match(['settings','a','b','theme']).has(fn));
	});

	it('hasMatchingPrefix reflects subscriptions correctly', () => {
		const idx = new SubscriptionIndex();
		idx.add('a.*.c', () => {});

		assert.equal(idx.hasMatchingPrefix(['a']), true);
		assert.equal(idx.hasMatchingPrefix(['a','x']), true);
		assert.equal(idx.hasMatchingPrefix(['b']), false);
	});

	it('supports multiple listeners on the same path', () => {
		const idx = new SubscriptionIndex();
		const a = () => {};
		const b = () => {};

		idx.add('foo.bar', a);
		idx.add('foo.bar', b);

		const result = idx.match(['foo','bar']);
		assert.ok(result.has(a));
		assert.ok(result.has(b));
		assert.equal(result.size, 2);
	});
});
