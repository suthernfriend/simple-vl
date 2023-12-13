<script setup lang="ts">

import assembly from "../test/saarland.yaml";
import {RundownXlsxRenderer} from "@/lib/assembly/impl/RundownXlsxRenderer";
import {ref} from "vue";

const text = ref("");

async function buildRundown() {
  const renderer = new RundownXlsxRenderer();

  return await renderer.render(assembly);
}

function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.target = "_blank";
  link.click();
  link.remove();
}

async function doDownload() {

  const rundown = await buildRundown();
  text.value = rundown;
  downloadFile(rundown, `rundown.xlsx`);
}


</script>

<template>
  <header>
    <h1>Versammlungsleitung Toolkit</h1>
  </header>
  <main>
    <button @click="doDownload()">Download</button>
    <div>
      {{ text }}
    </div>
  </main>
</template>

<style scoped>
</style>
