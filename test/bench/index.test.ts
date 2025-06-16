import Benchmark, { Suite } from 'benchmark';
import { Proxable } from '../../src/index.js'

function makeDeepObject ( depth: number ) {
	let obj: any = {};
	let cur = obj;
	for ( let i = 0; i < depth; i++ ) {
		cur[`p${i}`] = {};
		cur = cur[`p${i}`];
	}
	cur.value = 0;
	return obj;
}

function createDeepProxy<T extends object>(obj: T): T {
	return new Proxy(obj, {
		get(target, prop, receiver) {
		const val = Reflect.get(target, prop, receiver)
		return (val !== null && typeof val === 'object')
			? createDeepProxy(val as object)
			: val
		},
		set(target, prop, value, receiver) {
		return Reflect.set(target, prop, value, receiver)
		}
	})
}

const depths = [10, 100, 500];
const suite = new Suite ();

for (const d of depths) {
	const obj = makeDeepObject(d);

	const proxableobj = { ...obj };
	const proxable = Proxable.create(proxableobj);

	const proxyobj = { ...obj };
	const jsProxy = createDeepProxy(proxyobj);

	// compute the full path string: 'p0.p1....p{d-1}.value'
	const pathParts = Array.from({ length: d }, (_, i) => `p${i}`);
	const fullPath = [...pathParts, 'value'].join('.');

	// 1) Baseline: plain set
	suite.add(`plainset          depth: ${d}`, () => {
		obj[pathParts[0]][pathParts[1]].value = Math.random();
	});

	// 3) JS Proxy set
	suite.add(`jsproxy           depth: ${d}`, () => {
		jsProxy[pathParts[0]][pathParts[1]].value = Math.random()
	})

	// 4) Proxable with no listeners
	suite.add(`proxable   0-subs depth: ${d}`, () => {
		(proxable as any)[pathParts[0]][pathParts[1]].value = Math.random();
	});

	// 5) Proxable with 1 exact‐path listener
	proxable.subscribe(fullPath, () => {});
	suite.add(`proxable   1-subs depth: ${d}`, () => {
		(proxable as any)[pathParts[0]][pathParts[1]].value = Math.random();
	});

	// 6) Proxable with 100 exact‐path listeners
	for (let i = 0; i < 100; i++) {
		proxable.subscribe(fullPath, () => {});
	}
	suite.add(`proxable 100-subs depth: ${d}`, () => {
		(proxable as any)[pathParts[0]][pathParts[1]].value = Math.random();
	});

	// 7) Proxable with recursive wildcard listener
	proxable.subscribe('**.value', () => {});
	suite.add(`proxable   *-subs depth: ${d}`, () => {
		(proxable as any)[pathParts[0]][pathParts[1]].value = Math.random();
	});
}

suite
	.on ( 'cycle', ( evt: Benchmark.Event ) => console.log ( String(evt.target) ) )
	.on ( 'complete',
		function ( this: Suite, evt: Benchmark.Event) {
			console.log(`\n---Summary---`);
			console.log('Fastest is ' + this.filter('fastest').map('name'))
		}
	)
	.run({ async: true } as Benchmark.Options)
