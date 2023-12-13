import type { Renderable } from "@/lib/display/Renderable";

import imageUrl from "@/assets/screens/volt-background.png";

const ubuntuFont = "https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap";

export interface SplashscreenOptions {
	title: string;
	association: string;
}

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = url;
		image.onload = () => resolve(image);
		image.onerror = reject;
	});
}

export class Splashscreen implements Renderable {
	constructor(private options: SplashscreenOptions) {
	}

	async renderOnContext(context: CanvasRenderingContext2D): Promise<void> {

		const image = await loadImage(imageUrl as string);
		const width = context.canvas.width;
		const height = context.canvas.height;
		context.drawImage(image, 0, 0, width, height);

		function fillCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
			context.fillStyle = color;
			context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
			context.fill();
		}

		function fillText(context: CanvasRenderingContext2D, x: number, y: number, color: string, font: string, text: string) {
			context.fillStyle = color;
			context.font = font;
			context.textBaseline = "middle";
			context.textAlign = "center";
			context.fillText(text, x, y);
		}

		function measureText(context: CanvasRenderingContext2D, font: string, text: string): { width: number, height: number } {
			context.font = font;
			const metrics = context.measureText(text)
			return {
				height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
				width: metrics.width
			};
		}

		//
		// function fillTextBoxCentered(context: CanvasRenderingContext2D, x: number, y: number, width: number,
		// 							 color: string, font: string, fontSize: number, text: string) {
		// 	const words = text.split(/\s+/);
		//
		// 	console.log(words);
		//
		// 	let line = "";
		// 	let fontString = `${fontSize}px ${font}`;
		// 	let offsetY = 0;
		// 	while (words.length > 0) {
		// 		const next = line + " " + words[0];
		// 		const lineLength = measureTextLength(context, fontString, line);
		// 		console.log(`next = ${next}`);
		// 		if (context.measureText(next).width > width) {
		// 			const offsetX = (width - lineLength) / 2;
		// 			console.log(`fillText(context, x + offsetX = ${x} + ${offsetX}, y = ${y} + ${offsetY}, width = ${width}, color = ${color}, ${fontSize}px ${font}, ${line})`);
		// 			fillText(context, x + offsetX, y + offsetY, lineLength, color, fontString, line);
		// 			line = "";
		// 			offsetY += fontSize;
		// 		} else {
		// 			line = next;
		// 			words.shift();
		// 		}
		// 	}
		//
		// 	const lineLength = measureTextLength(context, fontString, line);
		// 	const offsetX = (width - lineLength) / 2;
		// 	console.log(`fillText(context, x + offsetX = ${x} + ${offsetX}, y = ${y} + ${offsetY}, width = ${width}, color = ${color}, ${fontSize}px ${font}, ${line})`);
		// 	fillText(context, x + offsetX, y + offsetY, width, color, fontString, line);
		// }

		function fillTextMultiline(context: CanvasRenderingContext2D, x: number, y: number, width: number,
								   color: string, font: string, text: string) {
			const words = text.split(/\s+/);
			let line = "";
			let offsetY = 0;

			while (words.length > 0) {
				const next = line + " " + words[0];
				const nextTextSize = measureText(context, font, next);
				if (nextTextSize.width > width) {
					fillText(context, x, y + offsetY, color, font, line);
					line = words.shift()!;
					offsetY += nextTextSize.height;
				} else {
					line = next;
					words.shift();
				}
			}

			const nextTextSize = measureText(context, font, line);
			fillText(context, x, y + offsetY, color, font, line);
			return offsetY + nextTextSize.height;
		}

		const radius = 0.4 * height;
		let y = height / 2 - radius * 0.2;
		fillCircle(context, width / 2, height / 2, radius, "white");
		y += fillTextMultiline(context, width / 2, y, 2 * radius, "black", "700 90px Ubuntu", this.options.title);
		y += 20;
		y += fillTextMultiline(context, width / 2, y, 2 * radius, "black", "400 64px Ubuntu", this.options.association);

	}
}
