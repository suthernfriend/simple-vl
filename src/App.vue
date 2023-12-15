<script setup lang="ts">

import {WindowCanvas} from "@/lib/display/WindowCanvas";
import type {Renderable} from "@/lib/display/Renderable";
import {Splashscreen} from "@/lib/display/templates/Splashscreen";
import {computed, reactive, ref} from "vue";

import assemblyImport from "@/lib/assembly/saarland.yaml";
import type {AgendaItem, Assembly} from "@/lib/assembly/Assembly";
import {AgendaItemTitle} from "@/lib/display/templates/AgendaItemTitle";
import {TextContentSlide} from "@/lib/display/templates/TextContentSlide";
import Clock from "@/components/Clock.vue";
import Stopwatch from "@/components/Stopwatch.vue";
import type {ProceduresFileSchemaRundownStep, ProceduresParameters} from "@/lib/assembly/Procedures";
import {Procedures} from "@/lib/assembly/Procedures";
import {getRandomColor} from "@/lib/display/templates/GenericVoltBackgroundAwareRenderable";

const assembly = assemblyImport as Assembly;

const screen = ref<"settings" | "agenda">("settings");
const agendaItem = ref<AgendaItem>();

const text = ref<string>("");
const preview = ref<HTMLCanvasElement>();
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
    await renderTemplate(new TextContentSlide({
      color: "red",
      title: "Tagesordnung",
      text: text.value
    }));
  } catch (e) {
    console.error(e);
  }
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

const rundownSteps = ref<ProceduresFileSchemaRundownStep[]>([]);

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
  association: "Volt Rheinland-Pfalz",
  event: "5. Ordentlicher Landesparteitag",
  chairpersons: ["Jan Peter König", "Jennifer Scharpenberg"],
  secretaries: ["Ron-David Roeder"],
  countingCommission: [],
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
    rundownSteps.value = procedures.getRundown(agendaItem.value, procedureParams.value);
  }
}

async function openSlide(agendaItem: AgendaItem, step: ProceduresFileSchemaRundownStep) {
  procedures.setColor(getRandomColor());
  const slide = procedures.getSlide(agendaItem, step, procedureParams.value);
  await renderTemplate(slide);
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
                  <div v-if="step.slide" class="mt-2">
                    <button @click="openSlide(agendaItem, step)" class="button is-primary is-small" type="button">Folie
                      öffnen
                    </button>
                  </div>
                  <hr>
                </li>
              </ul>
            </div>

            <div v-if="agendaItem?.type === 'opening'">

            </div>
            <div v-else-if="agendaItem?.type === 'chairperson-election'">
            </div>

            <div v-else-if="agendaItem?.type === 'counting-commission-election'">

            </div>
            <div v-else-if="agendaItem?.type === 'agenda-approval'">

            </div>
            <div v-else-if="agendaItem?.type === 'motion-order'">

            </div>
            <div v-else-if="agendaItem?.type === 'amendments'">

            </div>
            <div v-else-if="agendaItem?.type === 'election'">

            </div>
            <div v-else-if="agendaItem?.type === 'closing'">

            </div>
            <div>
              <button class="button is-dark" @click="renderSplashscreen">Render Splashscreen</button>
              <button class="button is-dark" @click="renderContentSlide">Render Content-Slide</button>
              <textarea class="textarea" v-model="text"/>
            </div>
          </div>
          <div class="column is-one-fifth" style="position: fixed; right: 0">
            <div class="box">
              <canvas ref="preview" width="1920" height="1080" style="width: 100%"/>
            </div>
            <clock/>
            <stopwatch/>
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
