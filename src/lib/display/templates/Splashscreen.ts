import type { Renderable } from "@/lib/display/Renderable";

import voltBackground from "@/assets/screens/volt-background.png";
import voltClaim from "@/assets/screens/volt-claim.png";
import { AbstractRenderable, loadImage } from "@/lib/display/templates/AbstractRenderable";
import { Vector2D } from "@/lib/display/templates/Vector2D";
import { Vector4D } from "@/lib/display/templates/Vector4D";

const ubuntuFont = "https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap";

export interface SplashscreenOptions {
	title: string;
	association: string;
}

export class Splashscreen extends AbstractRenderable {
	constructor(private options: SplashscreenOptions) {
		super();
	}

	async render(): Promise<void> {
		await this.drawImageFullscreen("volt-background");

		const [width, height] = this.size().unpack();

		const radius = 0.4 * height;
		let y = height / 2 - radius * 0.3;
		this.fillCircle(new Vector2D(width / 2, height / 2), radius, "white");
		y += this.fillTextV(new Vector2D(width / 2 - radius, y), 2 * radius, "700 90px Ubuntu", "#582c83", "center", false, this.options.title);
		y += 20;

		this.fillRect(new Vector4D(width / 2 - radius * 0.6, y, radius * 1.2, 80), "#582c83");
		y += 20;
		y += this.fillTextV(new Vector2D(width / 2 - radius * 0.6, y), radius * 1.2, "400 40px Ubuntu", "#ffffff", "center", false, this.options.association);
		y += 40;

		const voltClaimImage = await this.image("volt-claim");
		const imageWith = radius * 1.2;
		const imageHeight = voltClaimImage.height / voltClaimImage.width * imageWith;
		this.context().drawImage(voltClaimImage, width / 2 - radius * 0.6, y, imageWith, imageHeight);
		y += imageHeight + 20;
	}
}
