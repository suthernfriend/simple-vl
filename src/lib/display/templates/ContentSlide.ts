import { AbstractRenderable } from "@/lib/display/templates/AbstractRenderable";
import {
	GenericVoltBackgroundAwareRenderable
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import type {
	GenericVoltBackgroundAwareRenderableOptions
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";

export interface ContentSlideOptions extends GenericVoltBackgroundAwareRenderableOptions {
	title: string;
	text: string;
}

export class ContentSlide extends GenericVoltBackgroundAwareRenderable {

	constructor(private soptions: ContentSlideOptions) {
		super(soptions);
	}

	async render(): Promise<void> {
		await this.drawImageFullscreen(this.imageName());

		const padding = 50;
		const innerPadding = 25;
		const topExtraHeight = 100;
		const whitespaceOffsetY = padding + topExtraHeight;
		const whitespaceHeight = this.height() - 2 * padding - 100;
		const whitespaceWidth = this.width() - 2 * padding;
		this.fillRect(padding, whitespaceOffsetY, whitespaceWidth, whitespaceHeight, "white");

		this.fillTextByCenter(padding + innerPadding, (padding + topExtraHeight) * 0.5,
			"#ffffff", "bold 64px Ubuntu", "left", this.soptions.title);

		const centerOfWhiteSpace = whitespaceOffsetY + whitespaceHeight * 0.5;

		const textSpaceOffsetX = padding + innerPadding;
		const textSpaceOffsetY = whitespaceOffsetY + innerPadding;
		const textSpaceWidth = whitespaceWidth - 2 * innerPadding;

		this.fillTextV(textSpaceOffsetX, textSpaceOffsetY, textSpaceWidth, "48px Ubuntu", "#000000", "left", this.soptions.text);
	}
}
