import $ from "jquery"
import { Inputs } from "../dashboard/components/SubGoals"
const subGoals = nodecg.Replicant<Inputs["subGoals"]>("subGoals")

const currentSubs = nodecg.Replicant<number>("currentSubs", { defaultValue: 0, persistent: true })

const root = $("#root")

NodeCG.waitForReplicants(subGoals, currentSubs).then(() => {
  populateSubGoal(subGoals.value)
  subGoals.on("change", populateSubGoal)
  currentSubs.on("change", (newVal) => {})
})
const populateSubGoal = (goals: Inputs["subGoals"]) => {
  root.empty()
  goals.forEach((goal) => {
    const goalDiv = $("<div>").addClass("goal")
    const goalName = $("<h2>").text(goal.reward).addClass("goal-name")
    const goalProgress = $("<div>")
      .addClass("goal-progress")
      .css("width", `${(currentSubs.value / goal.goal) * 100}%`)
    const goalGoal = $("<div>").text(goal.goal).addClass("goal-goal")
    goalDiv.append(goalName, goalGoal)
    root.append(goalDiv)
  })
}

setInterval(async () => {
  currentSubs.value = await nodecg.sendMessage("getData", "subs")
}, 15000)
