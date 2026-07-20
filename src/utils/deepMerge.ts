type AnyObj = Record<string, unknown>;

const isPlainObj = (v: unknown): v is AnyObj =>
	v !== null && typeof v === "object" && !Array.isArray(v);

export function deepMerge<T>(a: T, b: unknown): T {
	if (Array.isArray(a) && Array.isArray(b)) {
		return [...a, ...b] as T;
	}

	if (isPlainObj(a) && isPlainObj(b)) {
		const out: AnyObj = { ...a };

		for (const k of Object.keys(b)) {
			const av = (a as AnyObj)[k],
				bv = b[k];
			out[k] =
				(Array.isArray(av) && Array.isArray(bv)) ||
				(isPlainObj(av) && isPlainObj(bv))
					? deepMerge(av, bv)
					: bv;
		}

		return out as T;
	}

	return b as T;
}
