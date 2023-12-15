<script setup lang="ts">

import { ref } from "vue";

const currentTime = ref<string>("");

function updateTime() {
	const date = new Date();
	currentTime.value = `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
}

setInterval(updateTime, 1000);

</script>

<template>
	<div class="box">
		<div class="title is-6">Aktuelle Uhrzeit</div>
		<div class="is-family-monospace title is-2">
			{{ currentTime }}
		</div>
	</div>
</template>

<style scoped>

</style>
