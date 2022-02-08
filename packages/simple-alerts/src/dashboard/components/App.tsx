import React from "react"
import { useEffect } from "react"
import Select, { ActionMeta, GroupBase } from "react-select"
import { Alerts } from "twitch/global"
import { useReplicant } from "use-nodecg"
import AlertsWrap from "./AlertsWrap"

type Props = {}

interface SelectProps<
  Option = string,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> {}

export default function App({}: Props) {
  const [alerts, setAlerts] = useReplicant<Alerts.Alert[]>("alerts", [])
  const [assets, setAssets] = useReplicant<Alerts.Asset[]>("assets:media-graphics", [])
  useEffect(() => {
    console.log(alerts)
    if (selectedAlert !== null) setSelectedAlert(alerts.find((alert) => alert.name === selectedAlert.name))
  }, [alerts])

  const [selectedAlert, setSelectedAlert] = React.useState<Alerts.Alert | null>(null)

  const onSelect = (option: { value: string; label: string }, actionMeta: ActionMeta<string>) => {
    console.log(option, actionMeta)

    if (option !== null && actionMeta.action === "select-option")
      setSelectedAlert(alerts.find((a) => a.name === option.value))
    if (actionMeta.action === "deselect-option" || actionMeta.action === "clear") setSelectedAlert(null)
  }

  const setAlert = function (alert: Alerts.Alert, i: number): void {
    const newAlerts = []
    newAlerts.push(...alerts.slice(0, i), alert, ...alerts.slice(i + 1))
    setAlerts(newAlerts)
  }

  return (
    <div className={`${selectedAlert === null ? "mb-48" : "mb-12"}`}>
      <div className="flex flex-row w-full justify-center items-end gap-2 pb-4">
        <div className="form-control w-full max-w-xs p-0 ">
          <label className="label">
            <span className="label-text">Choose an Alert to edit</span>
          </label>
          {alerts?.length > 0 && (
            <Select<SelectProps>
              id="alertSelect"
              name="alertSelect"
              className="w-full max-w-xs"
              defaultValue={selectedAlert?.name}
              placeholder="Select an alert to edit"
              autoFocus
              onChange={onSelect}
              isSearchable
              isMulti={false}
              options={alerts.map((a) => ({
                value: a.name,
                label: a.name.slice(0, 1).toUpperCase() + a.name.slice(1),
              }))}
            />
          )}
        </div>

        <button id="newAlert" className="btn btn-background self-end">
          <span className="iconify" data-icon="fa-solid:plus" style={{ fontSize: "24px", color: "white" }}></span>
        </button>
        <button id="testAlert" className="btn btn-background self-end">
          <span>Test Alert</span>
        </button>
      </div>
      <AlertsWrap selectedAlert={selectedAlert} setAlert={setAlert} i={alerts.indexOf(selectedAlert)} />
    </div>
  )
}
