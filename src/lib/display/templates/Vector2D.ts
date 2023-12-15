

export class Vector2D {
	private _x1: number;
	private _x2: number;

	public constructor(x1: number, x2: number) {
		this._x1 = x1;
		this._x2 = x2;
	}

	x(): number {
		return this._x1;
	}

	y(): number {
		return this._x2;
	}

	width(): number {
		return this._x1;
	}

	height(): number {
		return this._x2;
	}

	unpack(): [number, number] {
		return [this._x1, this._x2];
	}
}
