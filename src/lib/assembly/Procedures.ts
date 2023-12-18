import proceduresFile from "@/resources/procedures.yaml";
import type { AgendaItem, Assembly } from "@/lib/assembly/Assembly";
import { Splashscreen } from "@/lib/display/templates/Splashscreen";
import type { Renderable } from "@/lib/display/Renderable";
import { TextContentSlide } from "@/lib/display/templates/TextContentSlide";
import { AgendaItemTitle } from "@/lib/display/templates/AgendaItemTitle";
import type {
	GenericVoltBackgroundAwareRenderableColor
} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import type { SpecialOperation, SpecialOperationOpenLink } from "@/lib/display/SpecialOperation";
import { AgendaSlide } from "@/lib/display/templates/AgendaSlide";
import { MotionOrderSlide } from "@/lib/display/templates/MotionOrderSlide";
import { CandidateSlide } from "@/lib/display/templates/CandidateSlide";

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

export type SlideTypes = "top" | "agenda" | "splashscreen" | "chairperson-election" | "motion-order"

export type ProceduresFileSchemaRundownStepSpecialOperation = "loadMotionLink";

export type StringDictionary = { [k: string]: string };

export interface LinearRundownItem {
	title: string;
	slide?: (color: GenericVoltBackgroundAwareRenderableColor) => Renderable;
	operation?: () => SpecialOperation;
	text?: string;
	example?: string;
}

export interface ProceduresFileSchemaRundownStep {
	title: string;
	slide?: string;
	example?: string;
	text?: string;
	operation?: string;
	operationArgument?: string;
	doWithEachMotion?: ProceduresFileSchemaRundownStep[];
	doWithEachAmendment?: ProceduresFileSchemaRundownStep[];
	doWithEachLink?: ProceduresFileSchemaRundownStep[];
	doWithEachCandidate?: ProceduresFileSchemaRundownStep[];
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

	constructor() {
		console.log(proceduresFile);
		this.procs = proceduresFile as ProceduresFileSchema;
	}

	getSlide(color: GenericVoltBackgroundAwareRenderableColor,
			 assembly: Assembly, agendaItem: AgendaItem,
			 step: ProceduresFileSchemaRundownStep, parameters: StringDictionary): Renderable {

		if (!step.slide)
			throw new Error(`No slide defined for step ${step.title}`);

		switch (step.slide) {
			case "splashscreen":
				return new Splashscreen({
					title: parameters["event"],
					association: parameters["association"]
				});
			case "chairperson-election":
				const chairpersons = parameters["chairpersons"].split(", ");
				const chairpersonLead = chairpersons[0];
				const chairpersonRest = chairpersons.slice(1);

				const secretaries = parameters["secretaries"].split(", ");
				const secretaryLead = secretaries[0];
				const secretaryRest = secretaries.slice(1);

				return new TextContentSlide({
					title: `TOP ${agendaItem.digit}: ${agendaItem.title}`,
					text: "Als Versammlungsleitung wird vorgeschlagen:\n\n" +
						chairpersonLead + " (Leitung)\n" +
						chairpersonRest.join(", ") + "\n" +
						"\n\n" +
						"Als Schriftführung wird vorgeschlagen:\n\n" +
						secretaryLead + " (Leitung)\n" +
						secretaryRest.join(", "),
					color
				});
			case "candidate":
				const name = parameters["candidateName"];
				const position = parameters["candidatePosition"];

				return new CandidateSlide({
					name,
					position,
					color
				});
			case "top":
				return new AgendaItemTitle({
					title: agendaItem.title,
					color,
					digit: agendaItem.digit
				});
			case "motion-order":
				const tops: { digit: string, title: string, motions: { digit: string, title: string }[] }[] = [];

				for (const item of assembly.agenda) {
					if (item.type !== "amendments" || item.motions.length === 0)
						continue;

					const motions: { digit: string, title: string }[] = [];

					for (const motionId of item.motions) {
						motions.push({
							digit: motionId,
							title: assembly.motions[motionId].title
						});
					}

					tops.push({
						digit: item.digit,
						title: item.title,
						motions: motions
					});
				}

				return new MotionOrderSlide({
					title: agendaItem.title,
					color,
					tops
				});
			case "agenda":
				return new AgendaSlide({
					title: agendaItem.title,
					color,
					tops: assembly.agenda.map((top) => {
						return {
							digit: top.digit,
							title: top.title
						};
					})
				});
			case "counting-commission-election":
				const countingCommission = parameters["countingCommission"].split(", ");
				const ccLead = countingCommission[0];
				const ccRest = countingCommission.slice(1);

				return new TextContentSlide({
					color,
					text: "Als Zählkommission wird vorgeschlagen:\n\n" +
						ccLead + " (Leitung)\n" +
						ccRest.join(", "),
					title: `TOP ${agendaItem.digit}: ${agendaItem.title}`
				});
			default:
				throw new Error(`Unknown slide ${step.slide}`);
		}
	}

	reduceProcedureParameters(parameters: ProceduresParameters): StringDictionary {
		return {
			association: parameters.association,
			event: parameters.event,
			invitationDate: parameters.invitationDate,
			chairpersons: parameters.chairpersons.join(", "),
			countingCommission: parameters.countingCommission.join(", "),
			participants: `${parameters.participants}`,
			secretaries: parameters.secretaries.join(", ")
		};
	}

	resolveText(input: string | undefined, parameters: StringDictionary): string | undefined {
		if (!input)
			return undefined;

		let output = input;
		for (const k in parameters) {
			output = output.replace(`\{${k}}`, `${parameters[k]}`);
		}
		return output;
	}

	resolveRundownStep(assembly: Assembly, agendaItem: AgendaItem,
					   parameters: StringDictionary, rundownStep: ProceduresFileSchemaRundownStep)
		: LinearRundownItem[] {

		const out: LinearRundownItem[] = [];

		out.push({
			title: this.resolveText(rundownStep.title, parameters)!,
			text: this.resolveText(rundownStep.text, parameters),
			example: this.resolveText(rundownStep.example, parameters),
			slide: rundownStep.slide ? (color: GenericVoltBackgroundAwareRenderableColor) => {
				return this.getSlide(color, assembly, agendaItem, rundownStep, parameters);
			} : undefined,
			operation: rundownStep.operation ? () => {
				return {
					type: "open-link",
					url: this.resolveText(rundownStep.operationArgument, parameters)!
				} satisfies SpecialOperationOpenLink;
			} : undefined
		});

		if (rundownStep.doWithEachLink && agendaItem.type === "presentation") {

			let i = 1;
			for (const link of agendaItem.links) {
				for (const subStep of rundownStep.doWithEachLink) {
					if (!subStep.operationArgument)
						throw new Error(`No operation argument defined for step ${subStep.title}`);

					const params = {
						...parameters,
						link: link
					};

					out.push(...this.resolveRundownStep(assembly, agendaItem, params, subStep));
				}
			}

		}

		if (rundownStep.doWithEachCandidate && agendaItem.type === "election") {

			for (const candidate of agendaItem.candidates) {
				for (const subStep of rundownStep.doWithEachCandidate) {
					const params = {
						...parameters,
						candidateName: candidate.name,
						candidatePosition: candidate.position
					};

					out.push(...this.resolveRundownStep(assembly, agendaItem, params, subStep));
				}
			}

		}

		if (rundownStep.doWithEachMotion && agendaItem.type === "amendments") {

			for (const motionId of agendaItem.motions) {
				if (!assembly.motions.hasOwnProperty(motionId))
					throw new Error(`Motion with id ${motionId} referenced. But unknown`);

				const motion = assembly.motions[motionId];

				const motionParameters = {
					motionTitle: motion.title,
					motionLink: motion.link,
					motionPresenter: motion.presenter,
					motionDigit: motionId
				};

				for (const child of rundownStep.doWithEachMotion) {
					out.push(...this.resolveRundownStep(assembly, agendaItem, {
						...parameters,
						...motionParameters
					}, child));
				}
			}
		}

		return out;
	}

	resolveAgendaItem(assembly: Assembly, agendaItem: AgendaItem, parameters: ProceduresParameters)
		: LinearRundownItem[] {

		const reduced = this.reduceProcedureParameters(parameters);

		if (!this.procs.agendaTypes[agendaItem.type])
			throw new Error(`Unknown agenda item type ${agendaItem.type}`);

		const template = this.procs.agendaTypes[agendaItem.type];

		const out: LinearRundownItem[] = [];

		for (const templateItem of template.rundown) {
			out.push(...this.resolveRundownStep(
				assembly, agendaItem, reduced, templateItem
			));
		}

		return out;
	}
}
