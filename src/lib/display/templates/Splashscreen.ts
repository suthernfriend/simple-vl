import type { Renderable } from "@/lib/display/Renderable";

import voltBackground from "@/assets/screens/volt-background.png";
import voltClaim from "@/assets/screens/volt-claim.png";
import { AbstractRenderable, loadImage } from "@/lib/display/templates/AbstractRenderable";

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

		const width = this.width();
		const height = this.height();
		await this.drawImageFullscreen("volt-background");

		const radius = 0.4 * height;
		let y = height / 2 - radius * 0.3;
		this.fillCircle(width / 2, height / 2, radius, "white");
		y += this.fillTextV(width / 2 - radius, y, 2 * radius, "700 90px Ubuntu", "#582c83", "center", this.options.title);
		y += 20;

		this.context().fillStyle = "#582c83";
		this.context().fillRect(width / 2 - radius * 0.6, y, radius * 1.2, 80);
		y += 20;
		y += this.fillTextV(width / 2 - radius * 0.6, y, radius * 1.2, "400 40px Ubuntu", "#ffffff", "center", this.options.association);
		y += 40;

		const voltClaimImage = await this.image("volt-claim");
		const imageWith = radius * 1.2;
		const imageHeight = voltClaimImage.height / voltClaimImage.width * imageWith;
		this.context().drawImage(voltClaimImage, width / 2 - radius * 0.6, y, imageWith, imageHeight);
		y += imageHeight + 20;
	}
}
