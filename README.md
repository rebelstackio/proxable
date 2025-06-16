

# <img src="./assets/proxable.svg" style="margin-bottom:-12px; height:48px" /> proxable


A tiny, high-performance Proxy-based observable library with pathed subscriptions (including glob-like `*` and `**` wildcards).



## 🚀 Features

- Subscribe to any path in your object graph
- Wildcard patterns: `*` (one segment) & `**` (recursive)
- Lazy proxying based on subscription prefixes
- Zero dependencies by default, ~1.5 KB minified



## 📦 Installation

```bash
npm install proxable
# or
yarn add proxable
```



## 🔧 Quickstart

```ts
import { Proxable } from 'proxable';

type UIstore = {
  user? : {
    name      : string;
    metadata? : Record<string, any>;
  };
};

const observable = Proxable.create<UIstore>();

observable.user = { name: 'alice', metadata: {} };

// subscribe to a specific path
const off = observer.subscribe ( 'user.name', ( val, path) => {
  console.log ( `user.name changed to`, val );
});

// mutate directly
observer.user.name = 'bob';  // fires your callback

// teardown
off();
```



## 📚 API Reference

### SubscriptionIndex

- `add(path: string, listener: (value, path) => void): () => void`
- `match(pathArray: string[]): Set<listener>`
- `hasMatchingPrefix(pathArray: string[]): boolean`

### Proxable





## Benchmarks

```sh
npm run test:bench
> proxable@1.0.0 test:bench
> node --import tsx --test test/bench/*.test.ts

(depth: 10)
plainset          98,049,652 ops/sec ±2.27% (83 runs sampled)
jsproxy            4,672,670 ops/sec ±0.70% (93 runs sampled)
proxable   0-subs  3,811,691 ops/sec ±0.43% (98 runs sampled)
proxable   1-subs  3,827,106 ops/sec ±0.39% (97 runs sampled)
proxable 100-subs  3,769,844 ops/sec ±0.46% (97 runs sampled)
proxable   *-subs  3,748,935 ops/sec ±0.41% (94 runs sampled)

(depth: 100)
plainset          97,531,417 ops/sec ±2.19% (88 runs sampled)
jsproxy            4,619,193 ops/sec ±0.42% (99 runs sampled)
proxable   0-subs  3,757,186 ops/sec ±0.43% (97 runs sampled)
proxable   1-subs  3,734,462 ops/sec ±0.36% (97 runs sampled)
proxable 100-subs  3,770,729 ops/sec ±0.46% (95 runs sampled)
proxable   *-subs  3,739,736 ops/sec ±0.38% (95 runs sampled)

(depth: 500)
plainset          96,806,663 ops/sec ±2.53% (84 runs sampled)
jsproxy            4,617,251 ops/sec ±0.38% (98 runs sampled)
proxable   0-subs  3,728,569 ops/sec ±0.39% (99 runs sampled)
proxable   1-subs  3,719,367 ops/sec ±0.36% (94 runs sampled)
proxable 100-subs  3,724,364 ops/sec ±0.41% (97 runs sampled)
proxable   *-subs  3,729,223 ops/sec ±0.37% (93 runs sampled)
```

Subscription lookup cost is very low:

- depth of the object has no apparent impact on performance

- listener count has no apparent impact on performance

- wildcard subscriptions (`*` and `**`) have negligible overhead

- approximately ~25× slower than a plain property set which is not much slower than the bare native Proxy object performance for a single (deep) property set.

- depending on the processor, the performance is within 3.5% of the native Proxy object performance for a single (deep) property set.

- at approximately 3.7 million ops/sec, it is still very fast for most use cases, particularly in reactive UI where users are unlikely to produce such volumes of data sets. it's fast enough to be used in real-time applications like games, dashboards, and live data feeds.

- the performance is comparable to other libraries like MobX, but with a smaller footprint and simpler API.

- the library is designed to be efficient for both small and large applications, with lazy proxying ensuring minimal overhead until subscriptions are made.

- the library is optimized for deep reactivity, allowing for efficient updates to deeply nested properties without unnecessary overhead.





## 🎯 Goals

1. **Deep reactivity on demand**
	- Only wrap with `Proxy` where there are active subscriptions
	- Lazy, prefix-checked proxying to minimize overhead

2. **Flexible path subscriptions**
	- Dot-notation DSL (e.g. `user.profile.name`)
	- Single‐segment (`*`) and recursive (`**`) wildcards
	- Notify listeners when paths appear or change, even if nested keys didn’t exist initially

3. **Zero (or optional) dependencies**
	- Built-in lightweight callback emitter by default
	- Optional RxJS injection for those who want full stream/operator support

4. **Ergonomic API & strong typing**
	- `SubscriptionIndex` for pattern matching
	- `Proxable` to wrap (add reactivity to) your store and fire callbacks
	- TypeScript definitions for end-to-end safety



## 🛣️ Roadmap

- [ ] Integration samples: Vanilla JS with web components
- [ ] Documentation improvements: more examples, API details
- [ ] Tests and examples with RxJS integration
- [ ] More complex path matching scenarios



## 🤝 Contributing

Feel free to open issues or PRs. Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.



## 📄 License

LGPL v3 <span style="display:inline-block; transform:scaleX(-1)">©</span> Rein Petersen



## 📝 Changelog
See [CHANGELOG.md](./CHANGELOG.md) for details on changes.
