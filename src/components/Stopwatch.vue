<script setup lang="ts">

import { computed, ref } from "vue";

const timerIntervalRef = ref<number>(-1);
const timerValue = ref<number>(0);

const timer = computed<string>(() => {
	const value = Math.floor(timerValue.value / 10);
	const tenths = Math.floor(timerValue.value % 10);

	const hours = Math.floor(value / 3600);
	const minutes = Math.floor((value % 3600) / 60);
	const seconds = value % 60;
	return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)},${tenths}`;
});

function startTimer() {
	timerIntervalRef.value = setInterval(() => {
		timerValue.value++;
	}, 100);
}

function resetTimer() {
	stopTimer();
	timerValue.value = 0;
}

function stopTimer() {
	if (timerIntervalRef.value !== -1) {
		clearInterval(timerIntervalRef.value);
		timerIntervalRef.value = -1;
	}
}

</script>

<template>
	<div class="box">
		<div class="title is-6">Stopuhr</div>
		<div class="is-family-monospace title is-3">
			{{ timer }}
		</div>
		<hr>
		<div class="buttons">
			<button class="button is-success" @click="startTimer">Start</button>
			<button class="button is-danger" @click="stopTimer">Stop</button>
			<button class="button is-warning" @click="resetTimer">Reset</button>
		</div>
	</div>
</template>

<style scoped>

</style>
