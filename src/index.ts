import type { Subject as RxSubject, Observable as RxObservable } from 'rxjs';
import { SubscriptionIndex, Listener } from './subscription-index/index.js';

export interface ChangeEvent {
	path  : string[];
	value : any;
}

export interface ProxableObject {
	[ key: string] : any;
	subscribe ( path: string, cb: Listener ) : () => void;
	observable? () : RxObservable<ChangeEvent>;
}

export interface ProxableOptions {
	subject? : RxSubject<ChangeEvent>;
}

export class Proxable<T extends object> {
	private index = new SubscriptionIndex();
	private proxyCache = new WeakMap<object, any>();
	private listenerCache = new WeakMap<object, Map<string, Set<Listener>>>();
	private rxSubject?: RxSubject<ChangeEvent>;

	constructor ( options?: ProxableOptions ) {
		this.rxSubject = options?.subject;
	}

	static create<T extends object> (
		data?: T,
		options?: ProxableOptions
	) : T & ProxableObject {
		const factory = new Proxable<T>( options );
		return factory.create( data ?? ({} as T) );
	}

	create ( data: T ): T & ProxableObject {
		const root = this._createProxy ( data, [] ) as T & ProxableObject;

		Object.defineProperty( root, 'subscribe', {
			value: ( path: string, cb: Listener ) => {
				const off = this.index.add ( path, cb );
				this.listenerCache = new WeakMap();
				return () => {
					off();
					this.listenerCache = new WeakMap();
				};
			},
			writable: false,
			enumerable: false,
		});

		if ( this.rxSubject ) {
			Object.defineProperty ( root, 'observable', {
				value: () => this.rxSubject!.asObservable(),
				writable: false,
				enumerable: false,
			});
		}

		return root;
	}

	private _createProxy ( target: any, basePath: string[] ): any {
		if ( this.proxyCache.has ( target ) ) {
			return this.proxyCache.get ( target );
		}

		const handler: ProxyHandler<any> = {
			get: ( obj, prop ) => {
				const val = obj[prop];
				const nextPath = [...basePath, String(prop)];
				if (
					val != null &&
					typeof val === 'object' &&
					this.index.hasMatchingPrefix ( nextPath )
				) {
					return this._createProxy ( val, nextPath );
				}
				return val;
			},
			set: ( obj, prop, value ) => {
				const nextPath = [...basePath, String( prop )];
				const ok = Reflect.set ( obj, prop, value );
				const key = nextPath.join('.');
				const objMap = this.listenerCache.get ( obj ) ?? new Map<string,Set<Listener>>();
				this.listenerCache.set ( obj, objMap );
				let listeners = objMap.get ( prop as string );
				if ( !listeners ) {
					const full   = this.index.match( nextPath );
					const prefix = this.index.prefixListeners( nextPath );
					listeners = new Set<Listener>( [...full, ...prefix] );
					objMap.set(prop as string, listeners);
				}
				for ( const l of listeners ) l( value, nextPath );
				if ( this.rxSubject ) {
					this.rxSubject.next ( { path: nextPath, value } );
				}
				return ok;
			}
		};
		const proxy = new Proxy ( target, handler );
		this.proxyCache.set ( target, proxy );
		return proxy;
	}
}
