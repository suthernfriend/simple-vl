import proceduresFile from "@/resources/procedures.yaml";
import type {AgendaItem} from "@/lib/assembly/Assembly";
import {Splashscreen} from "@/lib/display/templates/Splashscreen";
import type {Renderable} from "@/lib/display/Renderable";
import {TextContentSlide} from "@/lib/display/templates/TextContentSlide";
import {AgendaItemTitle} from "@/lib/display/templates/AgendaItemTitle";
import type {
    GenericVoltBackgroundAwareRenderableColor
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";

export interface ProceduresParameters {
    participants: number;
    chairpersons: string[];
    secretaries: string[];
    invitationDate: string;
    countingCommission: string[];
    event: string;
    association: string;
}

const proceduresParameters: (keyof ProceduresParameters)[] = [
    "participants",
    "chairpersons",
    "secretaries",
    "invitationDate",
    "countingCommission",
    "event",
    "association"
];

export interface ProceduresFileSchemaRundownStep {
    title: string;
    slide?: string;
    example?: string;
    text?: string;
}

interface ProceduresFileSchema {
    agendaTypes: {
        [name: string]: {
            rundown: ProceduresFileSchemaRundownStep[]
        }
    };
}

export class Procedures {
    private procs: ProceduresFileSchema;
    private color: GenericVoltBackgroundAwareRenderableColor = "blue";

    constructor() {
        console.log(proceduresFile)
        this.procs = proceduresFile as ProceduresFileSchema;
    }

    setColor(color: GenericVoltBackgroundAwareRenderableColor) {
        this.color = color;
    }

    getSlide(agendaItem: AgendaItem, step: ProceduresFileSchemaRundownStep, parameters: ProceduresParameters): Renderable {
        if (!step.slide)
            throw new Error(`No slide defined for step ${step.title}`);

        switch (step.slide) {
            case "splashscreen":
                return new Splashscreen({
                    title: parameters.event,
                    association: parameters.association
                });
            case "chairperson-election":
                const chairpersonLead = parameters.chairpersons[0];
                const chairpersonRest = parameters.chairpersons.slice(1);

                return new TextContentSlide({
                    title: `TOP ${agendaItem.digit}: ${agendaItem.title}`,
                    text: "Als Versammlungsleitung wird vorgeschlagen:\n\n" +
                        chairpersonLead + " (Leitung)\n" +
                        chairpersonRest.join(", "),
                    color: this.color
                });
            case "top":
                return new AgendaItemTitle({
                    title: agendaItem.title,
                    color: this.color,
                    digit: agendaItem.digit
                })
            case "counting-commission-election":
                const ccLead = parameters.countingCommission[0];
                const ccRest = parameters.countingCommission.slice(1);

                return new TextContentSlide({
                    color: this.color,
                    text: "Als Zählkommission wird vorgeschlagen:\n\n" +
                        ccLead + " (Leitung)\n" +
                        ccRest.join(", "),
                    title: `TOP ${agendaItem.digit}: ${agendaItem.title}`
                });
            default:
                throw new Error(`Unknown slide ${step.slide}`);
        }
    }

    getRundown(agendaItem: AgendaItem, parameters: ProceduresParameters): ProceduresFileSchemaRundownStep[] {
        if (!this.procs.agendaTypes[agendaItem.type])
            throw new Error(`Unknown agenda item type ${agendaItem.type}`);

        const agendaType = this.procs.agendaTypes[agendaItem.type];

        const out: ProceduresFileSchemaRundownStep[] = [];
        for (const item of agendaType.rundown) {

            let example: string | undefined = item.example;
            let text = item.text;
            for (const k of proceduresParameters) {
                if (!!example)
                    example = example.replace(`{${k}}`, `${parameters[k]}`);
                if (!!text)
                    text = text.replace(`{${k}}`, `${parameters[k]}`);
            }

            out.push({
                title: item.title,
                slide: item.slide,
                example: example,
                text: text
            });
        }

        return out;
    }

}
