import { ContentSlide } from "@/lib/display/templates/ContentSlide";
import { Vector2D } from "@/lib/display/templates/Vector2D";
import { Vector4D } from "@/lib/display/templates/Vector4D";
import type {
	GenericVoltBackgroundAwareRenderableOptions
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";

export interface TextContentSlideOptions extends GenericVoltBackgroundAwareRenderableOptions {
	title: string;
	text: string;
}

export class TextContentSlide extends ContentSlide {

	constructor(private voptions: TextContentSlideOptions) {
		super(voptions);
	}

	protected getTitle(): string {
		return this.voptions.title;
	}

	protected async renderContent(rect: Vector4D): Promise<void> {
		const [x, y, width, height] = rect.unpack();

		this.fillTextV(rect.topLeft(), rect.width(), "64px Ubuntu", "#000000", "left", true, this.voptions.text);
	}

}
