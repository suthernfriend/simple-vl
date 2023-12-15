import type { Renderable } from "@/lib/display/Renderable";
import voltBackground from "@/assets/screens/volt-background.png";
import voltClaim from "@/assets/screens/volt-claim.png";
import voltClaimWhite from "@/assets/screens/volt-claim-white.png";
import voltStripesRed from "@/assets/screens/volt-stripes-red.jpg";
import voltStripesYellow from "@/assets/screens/volt-stripes-yellow.jpg";
import voltStripesGreen from "@/assets/screens/volt-stripes-green.jpg";
import voltStripesBlue from "@/assets/screens/volt-stripes-blue.jpg";
import { Vector2D } from "@/lib/display/templates/Vector2D";
import { Vector4D } from "@/lib/display/templates/Vector4D";

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
	| "volt-stripes-yellow"
	| "volt-stripes-green"
	| "volt-stripes-blue";

export abstract class AbstractRenderable implements Renderable {

	private _context: CanvasRenderingContext2D | undefined;

	async renderOnContext(context: CanvasRenderingContext2D): Promise<void> {
		this._context = context;

		await this.render();
		this.fillTextV(new Vector2D(0, this.height() - 24), 200, "bold 24px Ubuntu", "#ffffff", "left", false, "alpha v0.1");
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
			case "volt-stripes-green":
				return voltStripesGreen;
			case "volt-stripes-blue":
				return voltStripesBlue;
			default:
				throw new Error(`Unknown image ${name}`);
		}
	}

	protected async drawImage(name: AvailableImages, rect: Vector4D) {
		const [x, y, width, height] = rect.unpack();
		const image = await this.image(name);
		this.context().drawImage(image, x, y, width, height);
	}

	protected drawImageFullscreen(name: AvailableImages) {
		return this.drawImage(name, new Vector4D(0, 0, this.width(), this.height()));
	}

	protected size(): Vector2D {
		const canvas = this.context().canvas;
		const width = canvas.width;
		const height = canvas.height;
		return new Vector2D(width, height);
	}

	protected width(): number {
		return this.size().width();
	}

	protected height(): number {
		return this.size().height();
	}

	protected fillCircle(center: Vector2D, radius: number, color: string) {
		const [x, y] = center.unpack();
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

	protected fillTextV(topLeft: Vector2D, maxWidth: number, font: string, color: string, orientation: "left" | "center", shadow: boolean, text: string) {
		const [x, y] = topLeft.unpack();
		const context = this.context();

		if (shadow) {
			context.shadowColor = "rgba(0,0,0,0.8)";
			context.shadowBlur = 3;
			context.shadowOffsetY = 0;
			context.shadowOffsetX = 0;
		} else {
			context.shadowColor = "rgba(0,0,0,0)";
			context.shadowBlur = 0;
			context.shadowOffsetY = 0;
			context.shadowOffsetX = 0;
		}
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

	protected fillRect(rect: Vector4D, color: string) {
		const [x, y, width, height] = rect.unpack();
		this.context().fillStyle = color;
		this.context().fillRect(x, y, width, height);
	}

	protected fillTextByCenter(position: Vector2D, color: string, font: string, orientation: "left" | "center", text: string) {
		const [x, y] = position.unpack();

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

	protected measureText(font: string, text: string): Vector2D {
		const context = this.context();
		context.font = font;
		const metrics = context.measureText(text);
		return new Vector2D(metrics.width, metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent);
	}

	abstract render(): Promise<void>;

}
