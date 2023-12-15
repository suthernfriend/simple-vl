import { Vector2D } from "@/lib/display/templates/Vector2D";

export class Vector4D {
	private _x1: number;
	private _x2: number;
	private _x3: number;
	private _x4: number;

	public constructor(x1: number, x2: number, x3: number, x4: number) {
		this._x1 = x1;
		this._x2 = x2;
		this._x3 = x3;
		this._x4 = x4;
	}

	x(): number {
		return this._x1;
	}

	y(): number {
		return this._x2;
	}

	width(): number {
		return this._x3;
	}

	height(): number {
		return this._x4;
	}

	topLeft(): Vector2D {
		return new Vector2D(this._x1, this._x2);
	}

	bottomRight(): Vector2D {
		return new Vector2D(this._x1 + this._x3, this._x2 + this._x4);
	}

	size(): Vector2D {
		return new Vector2D(this._x3, this._x4);
	}

	unpack(): [number, number, number, number] {
		return [this._x1, this._x2, this._x3, this._x4];
	}

	to2d(): [Vector2D, Vector2D] {
		return [new Vector2D(this._x1, this._x2), new Vector2D(this._x3, this._x4)];
	}
}
