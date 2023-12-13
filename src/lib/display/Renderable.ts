export interface Renderable {
	renderOnContext(context: CanvasRenderingContext2D): Promise<void>;
}
