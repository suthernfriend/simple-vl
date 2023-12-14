<script setup lang="ts">

import { WindowCanvas } from "@/lib/display/WindowCanvas";
import type { Renderable } from "@/lib/display/Renderable";
import { Splashscreen } from "@/lib/display/templates/Splashscreen";
import { ContentSlide } from "@/lib/display/templates/ContentSlide";
import { ref } from "vue";

import assemblyImport from "@/lib/assembly/saarland.yaml";
import type { AgendaItem, Assembly } from "@/lib/assembly/Assembly";
import { AgendaItemTitle } from "@/lib/display/templates/AgendaItemTitle";

const assembly = assemblyImport as Assembly;

const text = ref<string>("");
const preview = ref<HTMLCanvasElement>();
const currentTime = ref<string>("");

function updateTime() {
	const date = new Date();

	currentTime.value = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
}

setInterval(updateTime, 1000);

const canvas = new WindowCanvas();

function openPresentation() {
	canvas.start();
}

async function renderTemplate(template: Renderable) {
	try {
		if (canvas.isRunning()) {
			const liveContext = canvas.getContext();
			await template.renderOnContext(liveContext);
		}
		const previewContext = preview.value?.getContext("2d")!;
		await template.renderOnContext(previewContext);
	} catch (e) {
		console.error(e);
		throw e;
	}
}

async function renderSplashscreen() {
	try {
		await renderTemplate(new Splashscreen({
			title: "5. ordentlicher Landesparteitag",
			association: "Volt Rheinland-Pfalz"
		}));
	} catch (e) {
		console.error(e);
	}
}

async function printTopTitle(agendaItem: AgendaItem) {
	await renderTemplate(new AgendaItemTitle({
		title: agendaItem.title,
		digit: agendaItem.digit,
		color: "yellow"
	}));
}

async function renderContentSlide() {
	try {
		await renderTemplate(new ContentSlide({
			color: "red",
			title: "Tagesordnung",
			text: text.value
		}));
	} catch (e) {
		console.error(e);
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
					<div class="column is-two-fifths">
						<aside class="menu">
							<p class="menu-label">
								Admin
							</p>
							<ul class="menu-list">
								<li><a>Event Einstellungen</a></li>
							</ul>
							<p class="menu-label">
								Tagesordnung
							</p>
							<ul class="menu-list">
								<li v-for="agendaItem in assembly.agenda">
									<a @click="printTopTitle(agendaItem)">TOP {{ agendaItem.digit }}:
										{{ agendaItem.title }}</a>
								</li>
							</ul>
							<p class="menu-label">
								Sonstiges
							</p>
						</aside>
					</div>
					<div class="column is-two-fifths">
						<div>
							<button class="button is-primary" @click="openPresentation">Open Presentation</button>
							<button class="button is-dark" @click="renderSplashscreen">Render Splashscreen</button>
							<button class="button is-dark" @click="renderContentSlide">Render Content-Slide</button>
							<textarea class="textarea" v-model="text" />
						</div>
					</div>
					<div class="column is-one-fifth">
						<div class="box">
							<canvas ref="preview" width="1920" height="1080" style="width: 100%" />
						</div>
						<div class="box is-family-monospace title is-2">
							{{ currentTime }}
						</div>
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
		background: antiquewhite;
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
