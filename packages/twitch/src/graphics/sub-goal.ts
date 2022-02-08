import $ from "jquery"
import { Inputs } from "../dashboard/components/SubGoals"
import gsap from "gsap"
import TextPlugin from "gsap/TextPlugin"

gsap.registerPlugin(TextPlugin);
import Confetti from "canvas-confetti"
let debug = false
window.$ = $


var can = document.createElement('canvas');
can.id = "goal-confetti"
let goalEl = <HTMLDivElement>document.querySelector("#goal")
goalEl.appendChild(can);

declare global {
  interface Window {
    obsstudio: any
    $: typeof $
  }
}

if (!window.obsstudio) {
  console.log("%cDEBUG MODE", "color: #f00; font-size: 2em;");

  debug = true
}

var confetti = Confetti.create(can, {})

var celebrate =
  <CelebrateFunction>function () {
    console.log("%cLet's Celebrate! 🎉", "color: purple; font-size: 2em;");

    celebrate.playing = true
    celebrate.end = () => { celebrate.playing = false }
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 270,
        startVelocity: 10,
        // spread: 180,
        gravity: 0.75,
        origin: { x: Math.random(), y: -1 }
      })


      // keep going until we are out of time
      if (celebrate.playing) {
        requestAnimationFrame(frame);
      }
    })();
  }

type SubGoals = Inputs["subGoals"]
type SubGoal = SubGoals[0]

const subGoals = nodecg.Replicant<SubGoals>("subGoals")
const currentSubs = nodecg.Replicant<number>("currentSubs")
const currentFollowers = nodecg.Replicant<number>("currentFollowers")
const customCss = nodecg.Replicant<{ css: string; enabled: boolean }>("customCss");


let goalQueue: SubGoals = []
let doneGoals: SubGoals = []
let currentGoal: SubGoal
let achievedGoal: SubGoal


const defaultCss = $("#default-css")
const cssStyle = $("<style>").attr("id", "custom-css").appendTo("body")
const wrapper = $("#wrapper")
const goalDiv = $("#goal")
const goalName = goalDiv.find(".goal-name")
const goalProgress = $(".goal-progress")
const goalGoal = $(".goal-goal.active")
const goalSubs = $(".current-subs").text("0")


let charWidth = 23

import defaultCssText from "bundle-text:./sub-goal.css"
import { clamp } from "lodash"
defaultCss.text(defaultCssText)


// if (!window.obsstudio) $("html").css("background-color", "#e2e2e2")
// else 
$("html").css("background-color", "transparent")

const onSubChange = (subs: number) => {
  const tl = gsap.timeline()
  let numSubs = { val: parseInt(goalSubs.text()) }
  const percent = clamp(subs / currentGoal.goal, 1)
  tl.to(numSubs, { val: subs, roundProps: "val", onUpdate: () => { goalSubs.text(numSubs.val) } }, 0)
  tl.to(goalProgress, { width: `${percent * 100}%` }, 0)
  tl.to(goalSubs, { x: clamp(window.innerWidth * percent, charWidth, window.innerWidth), }, 0)
  if (subs >= currentGoal.goal) {
    celebrate()
  }
  else if (celebrate.playing) {
    celebrate.end()
  }
}

NodeCG.waitForReplicants(subGoals, currentSubs, customCss)
  .then(() => $.when($.ready))
  .then(() => {

    if (debug)
      initDebug()
    if (customCss.value.enabled) {
      defaultCss.remove()
      cssStyle.text(customCss.value.css)
    }
    customCss.on("change", (n, old) => {
      if (n !== old && n.enabled) {
        cssStyle.text(n.css)
      }
      else if (n !== old && !n.enabled) {
        cssStyle.text(defaultCssText)
      }
    })
    charWidth = goalSubs.innerWidth() === 0 ? 23 : goalSubs.innerWidth()
    console.log("Char Width: ", charWidth);
    sortGoals(subGoals.value)
    console.log(
      "Current Goal: ",
      currentGoal,
      "\nLast Completed: ",
      achievedGoal,
      "\nAll Future Goals: ",
      goalQueue,
      "\nCurrent Subs: ",
      currentSubs.value
    )
    displayGoals()
    can.width = goalEl.offsetWidth;
    can.height = goalEl.offsetHeight;
    // subGoals.on("change", (newVal) => {
    //   goalQueue = []
    //   doneGoals = []
    //   currentGoal = undefined
    //   achievedGoal = undefined
    //   $(".goal-goal.inactive").remove()
    //   sortGoals(newVal)
    // })
    nodecg.listenFor("refresh", (msg) => {
      var subs = currentSubs.value
      if (subs >= currentGoal.goal) {
        let completedGoal = goalQueue.shift()
        completedGoal.completed = true
        doneGoals.push(completedGoal)
        currentGoal = goalQueue[0]
        if (celebrate.playing)
          celebrate.end()
      }
    })
    if (!debug)
      currentSubs.on("change", onSubChange)
  })
function sortGoals(goals: SubGoals) {
  if (goals.length < 1) {
    goalQueue = []
    return
  }
  goalQueue = bubbleSortGoals(Array.from(goals))
  while (goalQueue.length > 0 && goalQueue[0].completed) {
    doneGoals.unshift(goalQueue.shift())
  }
  currentGoal = goalQueue[0]
  achievedGoal = doneGoals[0]
}

function displayGoals() {
  goalQueue.forEach(function (goal, i) {
    if (i == 0) {
      let percent = clamp(currentSubs.value / currentGoal.goal, 1)
      gsap.set(goalProgress, { "width": `${percent * 100}%` })
      gsap.set(goalSubs, { text: `${currentSubs.value}`, x: window.innerWidth * percent, y: 30 })

      goalName.text(goal.reward)
      goalGoal.text(goal.goal)
    } else {
      let futGoal = $(`
      <div class="goal-goal inactive">
        <h${i % 6}>${goal.reward}</h${i % 6}>
        <span>${goal.goal}</span>
      </div>
      `).css("opacity", 0.9 / i + 0.1)
      wrapper.append(futGoal)
    }
  })
}

function bubbleSortGoals(arr: SubGoals) {
  //Outer pass
  for (let i = 0; i < arr.length; i++) {
    //Inner pass
    for (let j = 0; j < arr.length - i - 1; j++) {
      //Value comparison using ascending order

      if (getGoal(arr[j + 1]) < getGoal(arr[j])) {
        //Swapping
        ;[arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
      }
    }
  }
  return arr
}

function getGoal(g: SubGoal): number {
  return g.goal
}

interface CelebrateFunction {
  playing: boolean
  end: () => void;
  (): void
}

function initDebug() {
  const debug = $("<div>").attr("id", "debug").addClass(["bg-base-100", "fixed", "bottom-0", "w-full", "h-48", "pt-8"]).appendTo("body")
  const debugText = $("<div>Debug</div>").addClass(["font-bold", "text-lg", "absolute", "top-2", "left-2"]).appendTo(debug)
  const debugSubs = $<HTMLInputElement>("<input type='range' step='1' min='0' max='100'>").addClass(["range"]).appendTo(debug).on("change", (e) => onSubChange(parseInt(e.target.value)))

  const confettiTog = $(`<button class="btn btn-primary">Confetti</button>`).on("click", () => celebrate.playing ? celebrate.end() : celebrate())

  const debugConfetti = $(`<div class='flex flex-row gap-2 p-2 rounded-lg bg-neutral-200'>`).append(confettiTog).appendTo(debug)
}