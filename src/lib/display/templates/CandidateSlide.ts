import {
	GenericVoltBackgroundAwareRenderable
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import type {
	GenericVoltBackgroundAwareRenderableOptions
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import { Vector2D } from "@/lib/display/templates/Vector2D";


export interface CandidateSlideOptions extends GenericVoltBackgroundAwareRenderableOptions {
	name: string;
	position: string;
}

export class CandidateSlide extends GenericVoltBackgroundAwareRenderable {

	constructor(private soptions: CandidateSlideOptions) {
		super(soptions);
	}

	async render(): Promise<void> {
		await this.drawImageFullscreen(this.imageName());

		const padding = 50;

		let y = this.height() / 2 - 40;
		const x = padding;
		const maxWidth = this.width() - padding * 2;

		const text = `Kandidatur zum*zur ${this.soptions.position}`;
		y += this.fillTextV(new Vector2D(x, y), maxWidth, "bold 48px Ubuntu", "#ffffff", "left", true, text);

		y += 20;

		y += this.fillTextV(new Vector2D(x, y), maxWidth, "bold 72px Ubuntu", "#ffffff", "left", true, this.soptions.name);
	}
}
