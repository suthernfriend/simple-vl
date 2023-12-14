import type { Renderable } from "@/lib/display/Renderable";
import voltBackground from "@/assets/screens/volt-background.png";
import voltClaim from "@/assets/screens/volt-claim.png";
import voltClaimWhite from "@/assets/screens/volt-claim-white.png";
import voltStripesRed from "@/assets/screens/volt-stripes-red.jpg";
import voltStripesYellow from "@/assets/screens/volt-stripes-yellow.jpg";

export function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = url;
		image.onload = () => resolve(image);
		image.onerror = (e: any) => {
			console.log("Error loading image", url, e);
			reject(e);
		};
	});
}

export type AvailableImages =
	"volt-background"
	| "volt-claim"
	| "volt-claim-white"
	| "volt-stripes-red"
	| "volt-stripes-yellow";

export abstract class AbstractRenderable implements Renderable {

	private _context: CanvasRenderingContext2D | undefined;

	async renderOnContext(context: CanvasRenderingContext2D): Promise<void> {
		this._context = context;
		await this.render();
		this._context = undefined;
	}

	protected context(): CanvasRenderingContext2D {
		if (this._context === undefined) {
			throw new Error("Context not set");
		}
		return this._context;
	}

	protected image(name: AvailableImages): Promise<HTMLImageElement> {
		return loadImage(this.imagePath(name));
	}

	private imagePath(name: AvailableImages): string {
		switch (name) {
			case "volt-background":
				return voltBackground;
			case "volt-claim":
				return voltClaim;
			case "volt-claim-white":
				return voltClaimWhite;
			case "volt-stripes-red":
				return voltStripesRed;
			case "volt-stripes-yellow":
				return voltStripesYellow;
			default:
				throw new Error(`Unknown image ${name}`);
		}
	}

	protected async drawImage(name: AvailableImages, x: number, y: number, width: number, height: number) {
		const image = await this.image(name);
		this.context().drawImage(image, x, y, width, height);
	}

	protected fillRect(x: number, y: number, width: number, height: number, color: string) {
		this.context().fillStyle = color;
		this.context().fillRect(x, y, width, height);
	}

	protected async drawImageFullscreen(name: AvailableImages) {
		console.log("drawImageFullscreen", name);
		const image = await this.image(name);
		console.log("image loaded", image);
		this.context().drawImage(image, 0, 0, this.width(), this.height());
	}

	protected width(): number {
		return this.context().canvas.width;
	}

	protected height(): number {
		return this.context().canvas.height;
	}

	protected fillCircle(x: number, y: number, radius: number, color: string) {
		const context = this.context();
		context.fillStyle = color;
		context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
		context.fill();
	}

	protected splitTextIntoLines(font: string, width: number, text: string) {
		const context = this.context();
		const sentences = text.split("\n");

		context.font = font;
		const lines: string[] = [];

		for (const sentence of sentences) {
			const words = sentence.split(/\s+/);

			const current: string[] = [];

			while (words.length > 0) {
				const nextWord = words.shift()!;
				const next = [...current, nextWord].join(" ");

				const measurement = context.measureText(next);
				if (measurement.width > width) {
					console.log(`measured text is longer than width ${width}: ${measurement.width}`);
					lines.push(current.join(" "));
					current.splice(0, current.length);
				} else {
					console.log(`measured text is not longer than width ${width}: ${measurement.width}`);
				}
				current.push(nextWord);
			}

			lines.push(current.join(" "));
		}

		return lines;
	}

	protected fillTextV(x: number, y: number, maxWidth: number, font: string, color: string, orientation: "left" | "center", text: string) {
		const context = this.context();

		// context.shadowColor = "rgba(0,0,0,0.6)";
		// context.shadowBlur = 5;
		// context.shadowOffsetY = 0;
		// context.shadowOffsetX = 0;
		context.fillStyle = color;
		context.font = font;
		context.textAlign = "left";
		context.textBaseline = "top";

		const lines = this.splitTextIntoLines(font, maxWidth, text);
		console.log(lines);

		let offsetY = 0;
		for (const line of lines) {
			const measurement = context.measureText(line);
			const height = measurement.fontBoundingBoxAscent + measurement.fontBoundingBoxDescent;
			const width = orientation === "center" ? (measurement.width) : maxWidth;
			const offsetX = 0.5 * (maxWidth - width);

			// context.strokeRect(x + offsetX, y + offsetY, width, height);
			context.fillText(line, x + offsetX, y + offsetY);
			console.log(`context.fillText(${line}, ${x} + ${offsetX}, ${y} + ${offsetY}, ${maxWidth});`);

			offsetY += height;
		}

		return offsetY;
	}

	protected fillTextByCenter(x: number, y: number, color: string, font: string, orientation: "left" | "center", text: string) {

		const context = this.context();

		context.fillStyle = color;
		context.font = font;
		context.textBaseline = "middle";
		if (orientation === "center")
			context.textAlign = "center";
		else
			context.textAlign = "left";

		context.fillText(text, x, y);
	}

	protected measureText(font: string, text: string): { width: number, height: number } {
		const context = this.context();
		context.font = font;
		const metrics = context.measureText(text);
		return {
			height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
			width: metrics.width
		};
	}

	abstract render(): Promise<void>;

}
