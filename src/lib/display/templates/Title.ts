import type { Renderable } from "@/lib/display/Renderable";

export class Title implements Renderable {

	constructor(private options: { title: string }) {
	}

	renderOnContext(context: CanvasRenderingContext2D): void {
	}
}
