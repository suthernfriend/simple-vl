<script setup lang="ts">

import { WindowCanvas } from "@/lib/display/WindowCanvas";
import type { Renderable } from "@/lib/display/Renderable";
import { Splashscreen } from "@/lib/display/templates/Splashscreen";

const canvas = new WindowCanvas();

function openPresentation() {
	canvas.start();
}

async function renderTemplate(template: Renderable) {
	// const context = canvas.getContext();
	const localCanvas = document.getElementById("canvas") as HTMLCanvasElement;
	const context = localCanvas.getContext("2d")!;
	await template.renderOnContext(context);
}

async function renderSplashscreen() {
	await renderTemplate(new Splashscreen({
		title: "5. ordentlicher Landesparteitag",
		association: "Volt Rheinland-Pfalz"
	}));
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
			<h1>VL</h1>
			<button class="button is-primary" @click="openPresentation">Open Presentation</button>
			<button class="button is-dark" @click="renderSplashscreen">Render Splashscreen</button>
			<div>
				<canvas id="canvas" style="width: 1280px; height: 720px" width="1920" height="1080"></canvas>
			</div>
		</main>
		<footer>
			Status
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
