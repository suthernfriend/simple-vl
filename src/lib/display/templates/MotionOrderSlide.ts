import { ContentSlide } from "@/lib/display/templates/ContentSlide";
import type { Vector4D } from "@/lib/display/templates/Vector4D";
import type {
	GenericVoltBackgroundAwareRenderableOptions
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import { Vector2D } from "@/lib/display/templates/Vector2D";

export interface MotionOrderSlideOptions extends GenericVoltBackgroundAwareRenderableOptions {
	title: string;
	tops: { digit: string, title: string, motions: { digit: string, title: string }[] }[];
}

export class MotionOrderSlide extends ContentSlide {

	constructor(private soptions: MotionOrderSlideOptions) {
		super(soptions);
	}

	protected getTitle(): string {
		return this.soptions.title;
	}

	protected async renderContent(rect: Vector4D): Promise<void> {
		let y = rect.topLeft().y();

		y += this.fillTextV(new Vector2D(rect.topLeft().x(), y), rect.width(), "48px Ubuntu", "#000000",
			"left", false, "Vorgestellte Antragsreihenfolge:");

		y += 50;

		for (const top of this.soptions.tops) {
			this.fillTextV(new Vector2D(rect.topLeft().x(), y), rect.width(), "48px Ubuntu", "#000000",
				"left", false, `TOP ${top.digit}:`);
			y += this.fillTextV(new Vector2D(rect.topLeft().x() + 200, y), rect.width() - 200, "48px Ubuntu", "#000000",
				"left", false, top.title);

			y += 10;

			for (const motion of top.motions) {
				this.fillTextV(new Vector2D(rect.topLeft().x() + 100, y), rect.width() - 200, "42px Ubuntu", "#000000",
					"left", false, `Antrag ${motion.digit}:`);
				y += this.fillTextV(new Vector2D(rect.topLeft().x() + 450, y), rect.width() - 500, "42px Ubuntu", "#000000",
					"left", false, motion.title);
			}

			y += 30;
		}
	}
}
