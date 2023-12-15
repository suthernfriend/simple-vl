import { ContentSlide } from "@/lib/display/templates/ContentSlide";
import type { Vector4D } from "@/lib/display/templates/Vector4D";
import type {
	GenericVoltBackgroundAwareRenderableOptions
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import { Vector2D } from "@/lib/display/templates/Vector2D";

export interface AgendaSlideOptions extends GenericVoltBackgroundAwareRenderableOptions {
	title: string;
	tops: { digit: string, title: string }[];
}

export class AgendaSlide extends ContentSlide {

	constructor(private soptions: AgendaSlideOptions) {
		super(soptions);
	}

	protected getTitle(): string {
		return this.soptions.title;
	}

	protected async renderContent(rect: Vector4D): Promise<void> {
		let y = rect.topLeft().y();

		y += this.fillTextV(new Vector2D(rect.topLeft().x(), y), rect.width(), "48px Ubuntu", "#000000",
			"left", false, "Vorgestellte Tagesordnung:");

		y += 50;

		for (const top of this.soptions.tops) {
			this.fillTextV(new Vector2D(rect.topLeft().x(), y), rect.width(), "48px Ubuntu", "#000000",
				"left", false, `TOP ${top.digit}:`);
			y += this.fillTextV(new Vector2D(rect.topLeft().x() + 200, y), rect.width() - 100, "48px Ubuntu", "#000000",
				"left", false, top.title);

		}
	}
}
