// import 'nodecg-types/types/browser'
import "./index.css"
import $ from "jquery"
const components = nodecg.Replicant("components")

NodeCG.waitForReplicants(components).then(() => {
  let selector = $(`<select> 
    ${components.value.map((component) => `<option value="${component.name}">${component.name}</option>`).join("")}
  </select>`)
  $("body").append(selector)
})
