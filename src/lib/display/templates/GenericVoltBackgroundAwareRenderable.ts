import {AbstractRenderable} from "@/lib/display/templates/AbstractRenderable";

export type GenericVoltBackgroundAwareRenderableColor = "red" | "green" | "blue" | "yellow";

export function getRandomColor(): GenericVoltBackgroundAwareRenderableColor {
    const colors: GenericVoltBackgroundAwareRenderableColor[] = ["red", "green", "blue", "yellow"];
    return colors[Math.floor(Math.random() * colors.length)];
}

export type GenericVoltBackgroundAwareRenderableImages =
    "volt-stripes-red" | "volt-stripes-green" | "volt-stripes-blue" | "volt-stripes-yellow";

export interface GenericVoltBackgroundAwareRenderableOptions {
    color: GenericVoltBackgroundAwareRenderableColor;
}

export abstract class GenericVoltBackgroundAwareRenderable extends AbstractRenderable {
    protected constructor(private options: GenericVoltBackgroundAwareRenderableOptions) {
        super();
    }

    protected imageName(): GenericVoltBackgroundAwareRenderableImages {
        switch (this.options.color) {
            case "red":
                return "volt-stripes-red";
            case "yellow":
                return "volt-stripes-yellow";
            case "green":
                return "volt-stripes-green";
            case "blue":
                return "volt-stripes-blue";
        }
    }
}
