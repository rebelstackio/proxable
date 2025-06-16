export type Listener<T = any> = (value: T, path: string[]) => void;

export class SubscriptionIndex {
	private entries: Array<{ parts: string[]; listener: Listener }> = [];

	add ( path: string, listener: Listener ): () => void {
		const parts = path.split('.');
		this.entries.push ( { parts, listener } );
		return () => {
			this.entries = this.entries.filter(
				e => e.listener !== listener || e.parts.join('.') !== path
			);
		};
	}

	match ( path: string[] ): Set<Listener> {
		const result = new Set<Listener>();
		for ( const { parts, listener } of this.entries ) {
			if ( this._matchParts ( parts, path ) ) {
				result.add ( listener );
			}
		}
		return result;
	}

	hasMatchingPrefix ( path: string[] ): boolean {
		for ( const { parts } of this.entries ) {
			if ( this._prefixMatch ( parts, path ) ) {
				return true;
			}
		}
		return false;
	}

	public prefixListeners ( path: string[] ): Set<Listener> {
		const out = new Set<Listener>();
		for ( const { parts, listener } of this.entries ) {
			if ( this._prefixMatch ( parts, path ) ) {
				out.add ( listener );
			}
		}
		return out;
	}

	private _matchParts ( parts: string[], path: string[], pi = 0, xi = 0 ): boolean {
		if ( pi === parts.length ) {
			return xi === path.length;
		}
		if ( parts[pi] === '**' ) {
			for ( let k = xi; k <= path.length; k++ ) {
				if ( this._matchParts ( parts, path, pi + 1, k ) ) return true;
			}
			return false;
		}
		if ( xi === path.length ) return false;
		if ( parts[pi] === '*' || parts[pi] === path[xi] ) {
			return this._matchParts ( parts, path, pi + 1, xi + 1 );
		}
		return false;
	}

	private _prefixMatch ( parts: string[], path: string[], pi = 0, xi = 0 ): boolean {
		if ( xi === path.length ) return true;
		if ( pi === parts.length ) return false;
		if ( parts[pi] === '**' ) {
			return (
				this._prefixMatch ( parts, path, pi + 1, xi ) ||
				this._prefixMatch ( parts, path, pi, xi + 1 )
			);
		}
		if ( parts[pi] === '*' || parts[pi] === path[xi] ) {
			return this._prefixMatch ( parts, path, pi + 1, xi + 1 );
		}
		return false;
	}

}
