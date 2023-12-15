<script setup lang="ts">

import { ref } from "vue";

const redezeitBegrenzung = ref<string>("keine");

</script>

<template>
	<div class="box">
		<div class="title is-6">Zustand der Versammlung</div>
		<div class="field">
			<label class="label">Redezeitbegrenzung</label>
			<div class="control">
				<input class="input" v-model="redezeitBegrenzung" type="text" placeholder="">
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
