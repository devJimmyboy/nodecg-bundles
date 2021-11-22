import $ from "jquery"
import { Inputs } from "../dashboard/components/SubGoals"

type SubGoals = Inputs["subGoals"]
type SubGoal = SubGoals[0]

const subGoals = nodecg.Replicant<SubGoals>("subGoals")
const currentSubs = nodecg.Replicant<number>("currentSubs")
const currentFollowers = nodecg.Replicant<number>("currentFollowers")

let goalQueue: SubGoals = []
let doneGoals: SubGoals = []
let currentGoal: SubGoal
let achievedGoal: SubGoal

const wrapper = $("#wrapper")
const goalDiv = $("#goal")
const goalName = goalDiv.find(".goal-name")
const goalProgress = $(".goal-progress")
const goalGoal = $(".goal-goal.active")
const goalSubs = $(".current-subs")

$("html").css("background-color", "#e2e2e2")

NodeCG.waitForReplicants(subGoals, currentSubs)
  .then(() => $.ready)
  .then(() => {
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
    subGoals.on("change", (newVal) => {
      goalQueue = []
      doneGoals = []
      currentGoal = undefined
      achievedGoal = undefined
      $(".goal-goal.inactive").remove()
      sortGoals(newVal)
    })
    currentSubs.on("change", (newVal) => {
      if (newVal >= currentGoal.goal) {
        doneGoals.push(goalQueue.shift())
        currentGoal = goalQueue[0]
      }
      goalProgress.css("width", `${(newVal / currentGoal.goal) * 100}%`)
    })
  })
function sortGoals(goals: SubGoals) {
  if (goals.length < 1) {
    goalQueue = goals
    return
  }
  goalQueue = bubbleSortGoals(goals)
  while (goalQueue.length > 0 && goalQueue[0].goal < currentSubs.value) {
    doneGoals.unshift(goalQueue.shift())
  }
  currentGoal = goalQueue[0]
  achievedGoal = doneGoals[0]
}

function displayGoals() {
  goalQueue.forEach(function (goal, i) {
    if (i == 0) {
      goalProgress.css("width", `${(currentSubs.value / currentGoal.goal) * 100}%`)
      goalSubs
        .text(currentSubs.value)
        .css({ left: goalProgress.outerWidth() - goalSubs.outerWidth() / 2, top: goalProgress.height() })

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
