import { GenericVoltBackgroundAwareRenderable } from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import { Vector4D } from "@/lib/display/templates/Vector4D";
import { Vector2D } from "@/lib/display/templates/Vector2D";

export abstract class ContentSlide extends GenericVoltBackgroundAwareRenderable {


	async render(): Promise<void> {
		await this.drawImageFullscreen(this.imageName());

		const padding = 50;
		const innerPadding = 25;
		const topExtraHeight = 100;
		const whitespaceOffsetY = padding + topExtraHeight;
		const whitespaceHeight = this.height() - 2 * padding - 100;
		const whitespaceWidth = this.width() - 2 * padding;
		this.fillRect(new Vector4D(padding, whitespaceOffsetY, whitespaceWidth, whitespaceHeight), "white");

		this.fillTextByCenter(new Vector2D(padding + innerPadding, (padding + topExtraHeight) * 0.5),
			"#ffffff", "bold 64px Ubuntu", "left", this.getTitle());

		const centerOfWhiteSpace = whitespaceOffsetY + whitespaceHeight * 0.5;

		const textSpaceOffsetX = padding + innerPadding;
		const textSpaceOffsetY = whitespaceOffsetY + innerPadding;
		const textSpaceWidth = whitespaceWidth - 2 * innerPadding;

		await this.renderContent(new Vector4D(textSpaceOffsetX, textSpaceOffsetY, textSpaceWidth, whitespaceHeight - 2 * innerPadding));
	}

	protected abstract getTitle(): string;

	protected abstract renderContent(rect: Vector4D): Promise<void>;
}
