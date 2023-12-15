import {
	GenericVoltBackgroundAwareRenderable
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import type {
	GenericVoltBackgroundAwareRenderableOptions
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import { Vector2D } from "@/lib/display/templates/Vector2D";


export interface AgendaItemTitleOptions extends GenericVoltBackgroundAwareRenderableOptions {
	title: string;
	digit: string;
}

export class AgendaItemTitle extends GenericVoltBackgroundAwareRenderable {

	constructor(private soptions: AgendaItemTitleOptions) {
		super(soptions);
	}

	async render(): Promise<void> {
		await this.drawImageFullscreen(this.imageName());

		const padding = 50;
		const digitText = `Tagesordnungspunkt ${this.soptions.digit}`;

		let y = this.height() / 2 - 40;
		const x = padding;
		const maxWidth = this.width() - padding * 2;

		y += this.fillTextV(new Vector2D(x, y), maxWidth, "bold 36px Ubuntu", "#ffffff", "left", true, digitText);
		y += this.fillTextV(new Vector2D(x, y), maxWidth, "bold 96px Ubuntu", "#ffffff", "left", true, this.soptions.title);
	}
}
