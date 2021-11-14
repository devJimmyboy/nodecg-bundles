import $ from "jquery"
import { PositionConfig } from "../../global"

var position = nodecg.Replicant<PositionConfig>("posLogo")

$("#refreshBtn").on("click", () => nodecg.sendMessage("refreshClient"))

var selectPos =
  $("select[name='position']").length > 0
    ? $("select[name='position']")
    : $(`<select name='position'>
  <option value='top-left'>Top Left</option>
  <option value='top-right'>Top Right</option>
  <option value='top-center'>Top Middle</option>
  <option value='bottom-center'>Bottom Middle</option>
  <option value='bottom-left'>Bottom Left</option>
  <option value='bottom-right'>Bottom Right</option>
</select>`).appendTo("body")

NodeCG.waitForReplicants(position).then(() => {
  selectPos.on("change", (e) => {
    let selected = $(e.target).find("option:selected").val() as string
    let final = [0, 0] as PositionConfig
    selected.split("-").forEach((pos) => {
      switch (pos) {
        case "top":
          final[0] = 0
          break
        case "bottom":
          final[0] = 1
          break
        case "left":
          final[1] = 0
          break
        case "right":
          final[1] = 1
          break
        case "center":
          final[1] = 0.5
          break
      }
    })
    position.value = final
  })
})
