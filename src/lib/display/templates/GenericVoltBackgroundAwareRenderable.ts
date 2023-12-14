import { AbstractRenderable } from "@/lib/display/templates/AbstractRenderable";

export interface GenericVoltBackgroundAwareRenderableOptions {
	color: "red" | "yellow";
}

export abstract class GenericVoltBackgroundAwareRenderable extends AbstractRenderable {
	protected constructor(private options: GenericVoltBackgroundAwareRenderableOptions) {
		super();
	}

	protected imageName() {
		switch (this.options.color) {
			case "red":
				return "volt-stripes-red";
			case "yellow":
				return "volt-stripes-yellow";
		}
	}
}
