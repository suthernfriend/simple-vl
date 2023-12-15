<script setup lang="ts">

import { WindowCanvas } from "@/lib/display/WindowCanvas";
import type { Renderable } from "@/lib/display/Renderable";
import { computed, reactive, ref } from "vue";

import assemblyImport from "@/lib/assembly/rlp.yaml";
import type { AgendaItem, Assembly } from "@/lib/assembly/Assembly";
import Clock from "@/components/Clock.vue";
import Stopwatch from "@/components/Stopwatch.vue";
import type { LinearRundownItem, ProceduresParameters } from "@/lib/assembly/Procedures";
import { Procedures } from "@/lib/assembly/Procedures";
import { getRandomColor } from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";
import AssemblyState from "@/components/AssemblyState.vue";
import type { SpecialOperation } from "@/lib/display/SpecialOperation";

const assembly = assemblyImport as Assembly;

const screen = ref<"settings" | "agenda">("settings");
const agendaItem = ref<AgendaItem>();

const preview = ref<HTMLCanvasElement>();
const canvas = new WindowCanvas();

function openPresentation() {
	canvas.start();
}

async function renderTemplate(template: Renderable) {
}

function selectAgendaItem(item: AgendaItem) {
	agendaItem.value = item;
	setRundownSteps();
	screen.value = "agenda";
}

function selectSettings() {
	agendaItem.value = undefined;
	screen.value = "settings";
}

const rundownSteps = ref<LinearRundownItem[]>([]);

const procedures = new Procedures();

interface Settings {
	association: string;
	event: string;
	chairpersons: string[];
	secretaries: string[];
	countingCommission: string[];
	invitationDate: string;
	participants: number;
}

const settingsTitles: { [name in keyof Settings]: string } = {
	association: "Verband",
	event: "Veranstaltung",
	chairpersons: "Versammlungsleitung",
	secretaries: "Schriftführung",
	countingCommission: "Zählkommission",
	invitationDate: "Einladungsdatum",
	participants: "Anzahl Teilnehmer"
};

const settings = reactive<Settings>({
	association: assembly.association,
	event: assembly.event,
	chairpersons: ["Jan Peter König", "Jennifer Scharpenberg"],
	secretaries: ["Ron-David Roeder"],
	countingCommission: ["Sabrina Hinz", "Nic Kraneis", "Sascha Zimmermann"],
	invitationDate: "24.11.2023",
	participants: 15
});

const procedureParams = computed<ProceduresParameters>(() => ({
	association: settings.association,
	event: settings.event,
	chairpersons: settings.chairpersons,
	secretaries: settings.secretaries,
	countingCommission: settings.countingCommission,
	invitationDate: settings.invitationDate,
	participants: settings.participants
}));

function setRundownSteps() {
	if (!agendaItem.value)
		rundownSteps.value = [];
	else {
		rundownSteps.value = procedures.resolveAgendaItem(assembly, agendaItem.value, procedureParams.value);
	}
}

async function openSlide(agendaItem: AgendaItem, step: LinearRundownItem) {
	if (!step.slide)
		throw new Error("Rundown item has no slide");

	const slide = step.slide(getRandomColor());

	try {
		if (canvas.isRunning()) {
			const liveContext = canvas.getContext();
			await slide.renderOnContext(liveContext);
		}
		const previewContext = preview.value?.getContext("2d")!;
		await slide.renderOnContext(previewContext);
	} catch (e) {
		console.error(e);
		throw e;
	}
}

async function doSpecialOperation(operationGetter: () => SpecialOperation) {
	const operation = operationGetter();

	switch (operation.type) {
		case "open-link":
			canvas.openLink(operation.url);
			break;
		default:
			throw new Error(`Unknown special operation type ${operation.type}`);
	}
}

</script>

<template>
	<div class="top">
		<header>
			<nav class="navbar is-primary">
				<div class="container">
					<div class="navbar-brand">
						<a class="navbar-item" href="/">
							<img src="./assets/logo.png" alt="Volt Logo">
						</a>
						<h1 class="navbar-item">Versammlungsleitung Toolkit</h1>
					</div>
				</div>
			</nav>
		</header>
		<main>
			<div class="container">
				<div class="columns pt-5">
					<div class="column is-one-fifth">
						<aside class="menu">
							<p class="menu-label">
								Admin
							</p>
							<ul class="menu-list">
								<li><a @click="selectSettings()">Event Einstellungen</a></li>
							</ul>
							<p class="menu-label">
								Tagesordnung
							</p>
							<ul class="menu-list">
								<li v-for="item in assembly.agenda">
									<a :class="agendaItem?.digit === item.digit ? 'is-active' : ''"
									   @click="selectAgendaItem(item)">TOP {{ item.digit }}: {{ item.title }}</a>
									<ul v-if="agendaItem?.digit === item.digit && item.type === 'amendments' && item.motions.length > 0">
										<li v-for="motion in item.motions">
											<a>{{ assembly.motions[motion].title }}</a>
										</li>
									</ul>
								</li>
							</ul>
							<p class="menu-label">
								Sonstiges
							</p>
						</aside>
					</div>
					<div v-if="screen === 'settings'" class="column is-two-fifths">
						<h1 class="title is-3">Einstellungen</h1>
						<div class="mb-5">
							<button class="button is-primary" @click="openPresentation">Open Presentation</button>
						</div>
						<div class="field" v-for="(_, key) in settings">
							<label class="label">{{ settingsTitles[key] }}</label>
							<div class="control">
								<input class="input" v-model="settings[key]" type="text" placeholder="">
							</div>
						</div>
					</div>
					<div v-else-if="screen === 'agenda' && agendaItem" class="column is-three-fifths">
						<h1 class="title is-3">TOP {{ agendaItem.digit }} {{ agendaItem.title }}</h1>
						<div>
							<ul>
								<li v-for="step in rundownSteps" class="mb-5">
									<h3 class="title is-6 mb-2 is-uppercase">{{ step.title }}</h3>
									<p v-if="step.text">
										{{ step.text }}
									</p>
									<p v-if="step.example" class="is-italic mt-2">
										{{ step.example }}
									</p>
									{{ step.operation === undefined ? "" : JSON.stringify(step.operation) }}
									<div v-if="step.operation">
										<button @click="doSpecialOperation(step.operation)"
												class="button is-primary is-small" type="button">
											Spezialoperation ausführen
										</button>
									</div>
									<div v-if="step.slide" class="mt-2">
										<button @click="openSlide(agendaItem, step)" class="button is-primary is-small"
												type="button">Folie öffnen
										</button>
									</div>
									<hr>
								</li>
							</ul>
						</div>
					</div>
					<div class="column is-two-fifths" style="position: fixed; right: 0">
						<div class="box">
							<canvas ref="preview" width="1920" height="1080" style="width: 100%" />
						</div>
						<clock />
						<stopwatch />
						<assembly-state />
					</div>
				</div>
			</div>
		</main>
		<footer>
			<div class="container">
				Status
			</div>
		</footer>
	</div>
</template>

<style lang="scss" scoped>
div.top {
	display: flex;
	flex-direction: column;
	height: 100vh;

	header {
		display: block;
	}

	main {
		//background: antiquewhite;
		flex: 1;
	}

	footer {
		display: block;
		height: 2rem;
		background: #502379;
		color: white;
	}
}

</style>
