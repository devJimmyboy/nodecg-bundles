import "source-map-support/register";
import cloneDeep from "lodash/cloneDeep";
import { NodeCG } from "nodecg-types/types/server";

import { Alerts } from "../../global";
import initTTS from "./tts";
module.exports = function (nodecg: NodeCG) {
  const fy = initTTS(nodecg);
  // An array of alerts and their settings
  nodecg.Replicant<Alerts.Alert[]>("alerts", {
    defaultValue: [
      {
        name: "Default Alert",
        message: "",
        duration: 5000,
        media: [],
        sound: "none",
        layout: "banner",
        volume: 80,
        keywordColour: "#4FE639",
        fontColour: "#FFFFFF",
        customCSS: "",
        font: '"Palanquin"',
        fontWeight: "800",
        fontSize: "64",
      },
    ],
    persistent: true,
  });
  // The currently active aleart, changed via the API
  nodecg.Replicant<number | undefined>("activeAlert", {
    defaultValue: 0,
    persistent: false,
  });
  // Will use an array to queue up alerts
  nodecg.Replicant<Alerts.Alert[] | []>("alertQueue", {
    defaultValue: [],
    persistent: true,
  });
  // Will use this to prevent alerts overlapping
  nodecg.Replicant<boolean>("isAlertPlaying", {
    defaultValue: false,
    persistent: false,
  });
  // Current alert message is stored here
  nodecg.Replicant<Alerts.ActivateAlert>("activateAlert", {
    defaultValue: { activate: false, message: "", alert: 0, event: undefined },
    persistent: false,
  });

  const router = nodecg.Router();
  const alerts = nodecg.Replicant<Alerts.Alert[]>("alerts");
  const alertQueue = nodecg.Replicant<Alerts.Alert[]>("alertQueue");
  const activeAlert = nodecg.Replicant<number | undefined>("activeAlert");
  const isAlertPlaying = nodecg.Replicant<boolean>("isAlertPlaying");

  const onAlert = (req: { body: any }, res: any) => {
    const alertName = req.body.name as string;
    const message = req.body.message as string;
    if (alertName === "shoutout") {
      alertQueue.value.push({
        message: message,
        attachMsg: req.body.attachMsg,
        alert: -1,
        event: req.body.event,
      });
    } else {
      alerts.value.forEach(findAlert);
    }
    if (res)
      res.send(`Alert ${JSON.stringify(req.body)} will be added to queue`);
    function findAlert(
      value: Alerts.Alert,
      index: number,
      array: Alerts.Alert[]
    ) {
      if (value.name === alertName) {
        console.log(value.message);
        // Add message to Queue
        if (req.body.attachMsg) {
          alertQueue.value.push({
            message: message,
            attachMsg: req.body.attachMsg,
            alert: index,
            event: req.body.event,
          });
        } else {
          alertQueue.value.push({
            message: message,
            alert: index,
            event: req.body.event,
          });
        }
      }
    }
  };
  router.use((req, res, next) => {
    try {
      nodecg.log.info("received alert ", req.body.name, req.body.message);
    } catch (e) {
      nodecg.log.error(e);
    }
    next();
  });
  router.post("/alert", onAlert);
  nodecg.listenFor("alert", "twitch", (data: any) =>
    onAlert({ body: data }, undefined)
  );

  nodecg.mount("/alerts", router); // The route '/alerts/{routerRoute}` is now available

  function activateAlert(message: Alerts.Alert) {
    const activate = nodecg.Replicant<Alerts.ActivateAlert>("activateAlert");
    const activeAlert = nodecg.Replicant<number | undefined>("activeAlert");
    var change = false;
    // Bool always changes, in case messages are the same.
    change = !activate.value.activate;
    activeAlert.value = message.alert;
    const event =
      typeof message.event === "object"
        ? cloneDeep(message.event)
        : message.event;
    if (message.attachMsg) {
      activate.value = {
        message: message.message,
        attachedMsg: message.attachMsg,
        alert: message.alert,
        activate: change,
        event,
      };
    } else {
      activate.value = {
        message: message.message,
        alert: message.alert,
        activate: change,
        event,
      };
    }
  }

  alertQueue.on("change", (value: any) => {
    console.log(alertQueue.value);
    if (!isAlertPlaying.value && alertQueue.value.length > 0) {
      activateAlert(alertQueue.value[0]);
      //The graphics module sets this back to false when it is finished.
      // isAlertPlaying.value = true
    }
  });
};
