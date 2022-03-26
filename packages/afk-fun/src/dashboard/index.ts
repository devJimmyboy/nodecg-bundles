import $ from 'jquery'
const afkBtn = $<HTMLButtonElement>('#afk')
const afk = nodecg.Replicant('afk', {
  defaultValue: false,
  persistent: true
})
NodeCG.waitForReplicants(afk).then(() => {
  afk.on('change', newVal => {
    if (newVal) {
      afkBtn.addClass('active')
    } else {
      afkBtn.removeClass('active')
    }
  })
});