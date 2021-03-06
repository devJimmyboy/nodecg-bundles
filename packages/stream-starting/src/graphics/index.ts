/// <reference types="nodecg-types/types/browser"/>
import "./index.css";
import * as PIXI from "pixi.js";
import Matter, { Composite } from "matter-js";
import { GodrayFilter } from "@pixi/filter-godray";
import { ZoomBlurFilter } from "@pixi/filter-zoom-blur";
import { BulgePinchFilter } from "@pixi/filter-bulge-pinch";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import $ from "jquery";
import { gsap } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
import { PixiPlugin } from "gsap/PixiPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { getAudioData } from "./audioVisual";
import { ChatUser, ChatClient, PrivateMessage } from "@twurple/chat";
import type { HelixUserData } from "@twurple/api";
// import * as MatterWrap from "matter-wrap";
import circSrc from "./circle.png";
PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(CSSRulePlugin, PixiPlugin, TextPlugin);
var chat = new ChatClient({
  channels: ["#devjimmyboy", "#devjimmybot"],
});

// Matter.use(MatterWrap);

declare global {
  // var PIXI: typeof PIXI;
  interface Window {
    __PIXI_INSPECTOR_GLOBAL_HOOK__: { register: Function };
    PIXI: typeof PIXI;
    PIXIapp: PIXI.Application;
    reps: typeof reps;
  }
}

interface ChatMessageResponse {
  channel: string;
  user: string;
  message: string;
  _msg: PrivateMessage;
  userInfo: PrivateMessage["userInfo"];
}

window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: window.PIXI });

interface Asset {
  // Generated by https://quicktype.io
  sum: string;
  base: string;
  ext: string;
  name: string;
  namespace: string;
  category: string;
  url: string;
}
let config: StreamStartingState;
const appRoot = document.getElementById("canvas") as HTMLDivElement;
const appWidth = window.innerWidth;
const appHeight = window.innerHeight;
let appPrevWidth = window.innerWidth;
let appPrevHeight = window.innerHeight;

let app = new PIXI.Application({
  width: appWidth,
  height: appHeight,
  antialias: true,
  resizeTo: appRoot,
  backgroundAlpha: 0,
  resolution: 1,
  sharedLoader: true,
});

appRoot.appendChild(app.view);
if (!window.obsstudio) {
  window.PIXIapp = app;
}

// Progress Bar Shiz
let progressBarBorder = new PIXI.Graphics();
let progressBar = new PIXI.Graphics();
const xPos = appWidth / 2; // X Position of lower third
const yPos = appHeight / 2; // Initial Y position (out of frame)
const rWidth = 1200;
const rHeight = 175;
var playPromise: Promise<void>;

const currentScene = nodecg.Replicant<string>("currentScene", "obs");

// Filters to look cool
let zoomBlurFilter = new ZoomBlurFilter({
  strength: 0,
  center: new PIXI.Point(appWidth / 2, appHeight / 2),
  maxKernelSize: 32,
  innerRadius: 20,
});

let fisheyeFilter = new BulgePinchFilter({
  center: [0.5, 0.5],
  strength: 0,
  radius: -1,
});
let dropShadowFilter = new DropShadowFilter({
  alpha: 0.5,
  distance: 10,
  blur: 4,
  color: 0x000000,
});
let godRays = new GodrayFilter({ alpha: 0, angle: Math.PI / 2 });
godRays.blendMode = PIXI.BLEND_MODES.ADD;
class Chatter {
  chats: PIXI.Text[] = [];
  noPicture: boolean = false;
  avatar: string;
  initialPosition: { x: number; y: number };
  radius: number;
  color: string;
  body?: Matter.Body;
  root: PIXI.Container;
  sprite?: PIXI.Sprite;
  text: PIXI.Text;
  name: string;
  constructor(chatter: ChatUser | Partial<ChatUser>, avatar?: string) {
    this.avatar = avatar ?? circSrc;
    if (!avatar) {
      this.noPicture = true;
    }
    console.log("Adding Chatter: ", chatter);
    this.name = chatter?.displayName || "unknown";
    this.color = chatter?.color;
    this.radius = Math.floor(Math.random() * 50 + 50);
    this.initialPosition = {
      x: Math.floor(Math.random() * appWidth),
      y: -this.radius,
    };
    this.root = new PIXI.Container();
    // this.root.pivot.set(0.5);
    this.root.x = this.initialPosition.x;
    this.root.y = this.initialPosition.y;

    this.text = new PIXI.Text(this.name, {
      dropShadow: true,
      dropShadowAlpha: 0.25,
      dropShadowBlur: 3,
      dropShadowDistance: 4,
      fill: this.noPicture ? 0xffffff : Number(this.color.replace("#", "0x")),
      ...(this.noPicture ? { stroke: 0x000000, strokeThickness: 2 } : {}),
      fontFamily: "Lilita One",
      fontSize: 24,
      fontWeight: "800",
    });

    this.text.anchor.set(0.5);
    this.root.addChild(this.text);
  }
  update() {}

  addMessage(message: string) {
    let chatText = new PIXI.Text(message, {
      dropShadow: true,
      dropShadowAlpha: 0.25,
      dropShadowBlur: 3,
      dropShadowDistance: 2,
      fill: 0xffffff,
      fontFamily: "Segoe UI",
      fontSize: 20,
      fontWeight: "600",
      stroke: 0x000000,
      strokeThickness: 2,
    });
    // chatText.pivot.copyFrom(this.sprite.pivot);
    chatText.anchor.set(0.5);

    this.chats.unshift(chatText);
    this.chats.forEach((chatTxt, i) => {
      if (i === 0) {
        chatTxt.y = -this.radius * 1;
      }
      gsap.to(chatTxt, {
        pixi: {
          y: -this.radius - 30 * (i + 1),
        },
        duration: 0.25,
      });
    });
    this.root.addChild(chatText);
    setTimeout(() => {
      gsap.to(chatText, {
        pixi: { autoAlpha: 0 },
        duration: 0.5,
        onComplete: () => {
          chatText.destroy();
          this.chats.pop();
        },
      });
    }, 6000);
  }
  addToStage(stage: PIXI.Container) {
    stage.addChild(this.text);
  }
}
const chatters: Chatter[] = [];
interface StreamStartingState {
  loadingText: string;
  video: string;
  length: number;
}
interface States {
  starting: StreamStartingState;
  brb: StreamStartingState;
  ending: StreamStartingState;
  custom: StreamStartingState;
}
const reps = {
  progress: nodecg.Replicant<number>("streamStartProgress"),
  states: nodecg.Replicant<States>("streamStartStates"),
  currentState: nodecg.Replicant<string>("streamStartCurrentState"),
};
window.reps = reps;
const videos = nodecg.Replicant<Asset[]>("assets:starting-videos");
const tVideos = nodecg.Replicant<Asset[]>("assets:transition-videos");

const eVideoPreview = $(
  `<video id="video" loop width="100%" muted></video>`
).appendTo("#videoContainer");

let loadText = new PIXI.Text("Loading", {
    dropShadow: true,
    dropShadowDistance: 2,
    dropShadowAngle: 45,
    dropShadowBlur: 1,
    fontFamily: "Lilita One",
    fill: 0xffffff,
    fontSize: "10em",
  }),
  myFont,
  incInterval;
let msPerPercent = 5000,
  easing = 0.05,
  // ellipses = new PIXI.Text("", loadText.style),
  currWidth = 0,
  targetWidth = 0,
  doneLoading = false,
  frameCount = 0,
  progressBarContainer = new PIXI.Container(),
  chatterContainer = new PIXI.Container();
$(function () {
  const Engine = Matter.Engine;
  const World = Matter.World;
  const Body = Matter.Body;
  const Bodies = Matter.Bodies;
  const Mouse = Matter.Mouse;
  const MouseConstraint = Matter.MouseConstraint;
  const engine = Engine.create();
  const chatterMap: Map<string, Chatter> = new Map();

  chat.onMessage(async (channel, user, message, msg) => {
    if (chatterMap.has(user)) {
      const chatter = chatterMap.get(user);
      chatter.addMessage(message);
      Matter.Body.setVelocity(chatter.body, { x: 0, y: -10 });
      return;
    }
    if (import.meta.env.DEV) {
      console.log(
        "A NEW MESSAGE FROM A NEW PERSON!",
        user,
        "in",
        channel,
        "with message",
        message
      );
    }
    nodecg.sendMessage(
      "getUserAvatar",
      msg.userInfo.userName,
      (err: Error, avatar: string) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Received User Pfp:", avatar);
        const chatter = new Chatter(msg.userInfo, avatar);
        chatterMap.set(user, chatter);
        chatter.addMessage(message);
        addChatter(chatter);
      }
    );
  });

  function preload() {}
  const mainContainer = new PIXI.Container();
  mainContainer.position.set(0, 0);
  PIXI.Loader.shared.load(setup);
  function setup() {
    worldSetup();
    mainContainer.filterArea = new PIXI.Rectangle(0, 0, appWidth, appHeight);
    //@ts-ignore
    mainContainer.filters = [dropShadowFilter, zoomBlurFilter, fisheyeFilter];
    app.stage.filters = [godRays];
    fisheyeFilter.center = new PIXI.Point(xPos, yPos);
    fisheyeFilter.radius = 400;
    drawLoading();
    app.stage.filterArea = new PIXI.Rectangle(0, 0, appWidth, appHeight);
    app.ticker.autoStart = true;

    // Set up the canvas
    // setInterval(updateEllipses, 500) // Update the ellipses every 500ms
    progressBarContainer.addChild(progressBarBorder, progressBar);

    mainContainer.addChild(progressBarContainer, loadText);
    app.stage.addChild(mainContainer);
    app.stage.addChildAt(chatterContainer, 0);

    app.ticker.add(draw);
    app.ticker.add(visualize);
    console.log("Running Matter.js Engine");
    Matter.Runner.run(engine);
    chat.connect();
  }
  let targetAlpha = 1,
    currAlpha = 1;
  let elapsed = 0;
  function draw(deltaTime: number) {
    elapsed += deltaTime;
    let dW = targetWidth - currWidth;
    currWidth += dW * easing;
    progressBar.scale.set(currWidth, 1);

    let dA = targetAlpha - currAlpha;
    currAlpha += dA * easing;
    progressBarContainer.alpha = currAlpha;
  }
  /*--------------------------
  Pixi Frame Updates
  --------------------------*/

  app.ticker.add((dt) => {
    chatters.forEach((object) => {
      // Make all pixi sprites follow the position and rotation of their body.
      object.root.position.x = object.body.position.x;
      object.root.position.y = object.body.position.y;
      object.sprite.rotation = object.body.angle;

      if (object.root.position.y > appHeight + 500) {
        Body.setPosition(object.body, { x: appWidth / 2, y: appHeight / 2 });
        object.addMessage("I'm back!");
      }
      object.update();
    });
  });
  // This function is called when the video loads
  async function loadVideo(source: string) {
    return await NodeCG.waitForReplicants(
      videos,
      tVideos,
      reps.states,
      reps.progress,
      reps.currentState
    ).then(() => {
      const video = document.getElementById("video") as HTMLVideoElement;
      console.log("loading video %d", source);
      if (video.src === source) return;
      video.src = source;
      video.addEventListener("canplaythrough", (e) => {
        playPromise = video.play();
      });
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            console.log("Video %c%d playing", "color: #00ff00;", source);
            // Video playback started ;)
          })
          .catch((e) => {
            console.error("Video %d failed playing: %d", source, e);
            // Video playback failed ;(
          });
      }
      return playPromise;
    });
  }

  // Draw the loading bar
  function drawLoading() {
    progressBarContainer.position.set(xPos - rWidth / 2, yPos - rHeight / 2);
    progressBarBorder.lineStyle(10, 0xffffff);
    progressBarBorder.drawRoundedRect(0, 0, rWidth, rHeight, 6);
    // ellipses.text = ""

    progressBar
      .beginFill(0xffffff, 1)
      .drawRect(
        0,
        0,
        rWidth, // Size to text
        rHeight
      )
      .endFill();
    progressBar.scale.set(0, 1);
    //   progressBar.mask = new PIXI.Graphics().drawRect(xPos - rWidth / 2, yPos - rHeight / 2, rWidth, rHeight)

    loadText.anchor.set(0.5);
    loadText.setTransform(xPos, yPos - rHeight - 100, 1, 1);
    // ellipses.anchor.set(0, 0.5)
    // ellipses.position.set(loadText.width / 2 + 40, 0)
  }

  // function updateEllipses() {
  //   if (ellipses.text.length === 3) ellipses.text = ""
  //   else ellipses.text += "."
  // }

  function endLoading() {
    targetAlpha = 0;
    doneLoading = true;
    gsap.to(godRays, { alpha: 0.75, duration: 2.5 });
    gsap.to(loadText, {
      pixi: { y: yPos - loadText.height / 2, scale: 1.2 },
      duration: 1,
      ease: "power2.inOut",
    });
  }

  function unEndLoading() {
    targetAlpha = 1;
    doneLoading = false;
    gsap.to(godRays, { alpha: 0, duration: 0.5 });
    gsap.to(loadText, {
      pixi: { y: yPos - rHeight - 100, scale: 1 },
      duration: 1,
      ease: "power2.inOut",
    });
  }

  function worldSetup() {
    // const wallTop = Bodies.rectangle(appWidth / 2, 0, appWidth, 10, {
    //   isStatic: true,
    // });
    const wallBottom = Bodies.rectangle(
      appWidth / 2,
      appHeight + 2.5,
      appWidth + 400,
      10,
      {
        isStatic: true,
        frictionStatic: 0.6,
      }
    );
    const wallRight = Bodies.rectangle(appWidth, appHeight / 2, 10, appHeight, {
      isStatic: true,
      frictionStatic: 0.6,
    });
    const wallLeft = Bodies.rectangle(0, appHeight / 2, 10, appHeight, {
      isStatic: true,
      frictionStatic: 0.6,
    });
    // Add Matter walls to the world. This will keep the bodies within certain parameters.
    World.add(engine.world, [wallBottom, wallLeft, wallRight]);
  }

  /*--------------------------
  Create Scene Object
  --------------------------*/

  const mockNames: Partial<ChatUser>[] = [
    { displayName: "PlanetWasTaken", color: "#44ff88" },
    { displayName: "devJimmybot", color: "#84ffff" },
    { displayName: "Keamuu", color: "#ffcccc" },
    { displayName: "Zingaro", color: "#ffcc00" },
  ];

  // Testing purposes
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const name = mockNames[Math.floor(Math.random() * mockNames.length)];
    addChatter(new Chatter(name));
  });

  async function addChatter(chatter: Chatter) {
    // Matter Body
    chatter.body = Bodies.circle(
      chatter.initialPosition.x,
      chatter.initialPosition.y + 1,
      chatter.radius,
      {
        restitution: 0.85,
        velocity: { x: Math.random() * 20 - 10, y: 5 },
      }
    );
    // chatter.body.plugin.wrap = {
    //   min: { x: -chatter.radius, y: -chatter.radius },
    //   max: { x: appWidth + chatter.radius, y: appHeight + chatter.radius },
    // };
    Composite.add(engine.world, chatter.body);

    // Pixi Sprite
    // The sprite can be anything from the Pixi api. Video, image, make it into a circle, mask it, etc. You just need to make sure the proper anchor point is set, its added to the stage and that it follows the body in our pixi app ticker.
    console.debug("Adding Chatter", chatter);
    chatter.sprite = PIXI.Sprite.from(chatter.avatar);
    chatter.sprite.width = chatter.radius * 2;
    chatter.sprite.height = chatter.radius * 2;
    if (chatter.noPicture)
      chatter.sprite.tint = Number(chatter.color.replace("#", "0x"));
    const mask = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawCircle(0, 0, chatter.radius)
      .endFill();
    mask.renderable = false;
    // mask.pivot.set(0.5);
    chatter.root.addChild(mask);
    chatter.sprite.mask = mask;

    chatter.sprite.blendMode = PIXI.BLEND_MODES.ADD;
    chatter.sprite.anchor.set(0.5, 0.5);
    chatter.root.addChildAt(chatter.sprite, 0);
    chatters.push(chatter);
    chatterContainer.addChild(chatter.root);

    // Add the complete scene object (body and sprite) to our array of objects. We'll track those objects in the pixi frame updates (see app.ticker below).
  }

  function beginStream(video: string) {
    console.log("beginning stream");

    gsap.to("canvas, video", {
      autoAlpha: 0,
      duration: 1,
      onComplete: () => {
        $("#video")
          .removeAttr("loop")
          .on("ended", () =>
            nodecg.sendMessageToBundle("switchScene", "obs", "Full Cam")
          );

        loadVideo(tVideos.value.find((v) => v.name === video).url);
        playPromise.then(() => {
          gsap.set("video", { autoAlpha: 1 });
          let vid = document.getElementById("video") as HTMLVideoElement;
          vid.muted = false;
        });
      },
      ease: "power2",
    });
  }
  nodecg.listenFor("beginStream", beginStream);
  NodeCG.waitForReplicants(
    reps.currentState,
    reps.progress,
    reps.states,
    videos,
    tVideos
  ).then(() => {
    config = reps.states.value[reps.currentState.value];

    var prog = reps.progress.value;
    currWidth = prog;
    if (config.video && config.video !== "") {
      const video =
        videos.value.find((v) => v.name === config.video) || videos.value[0];
      console.log(video);
      loadVideo(video.url);
    }
    // Var instatiations

    loadText.text = config.loadingText;

    reps.progress.on("change", (newVal) => {
      let progress = Math.round(newVal * 100) / 100;
      console.log("progress changed to ", progress, "%");
      if (progress < 1) {
        targetWidth = progress;
      } else {
        targetWidth = 1;
        endLoading();
      }
      if (doneLoading && progress !== 1) {
        unEndLoading();
      }
    });
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: Mouse.create(app.view),
      // @ts-ignore
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(engine.world, mouseConstraint);

    function stateChange(newVal, oldVal) {
      config = newVal[reps.currentState.value];
      if (!config) return;
      // let newText = config?.loadingText && nodecg.sendMessageToBundle("parseEmotes", "twitch", config?.loadingText, (e, newStr) => {

      // })
      if (config.loadingText) {
        loadText.text = config.loadingText;
        loadText.updateText(true);
      }
      msPerPercent = (config.length || 5) * 6000;

      if (config.video && config.video !== "") {
        const video =
          videos.value.find((v) => v.name === config.video) || videos.value[0];
        console.log(video);
        loadVideo(video.url);
      }
    }
    reps.states.on("change", stateChange);
    reps.currentState.on("change", stateChange);
  });

  // Audio Visualization
  function visualize(delta: number) {
    var frequencyData: Uint8Array = getAudioData();
    if (!frequencyData) {
      // console.log("no frequency data");
      return;
    }
    // console.group("Visualization");
    // console.log(frequencyData);
    let avg = 0;
    for (let i = 0; i < frequencyData.length / 15; i++) {
      avg += normalizeFQ(frequencyData[i]);
    }
    avg /= frequencyData.length / 15;
    if (reps.progress.value == 1)
      godRays.time = (godRays.time + delta / 1000) % 3;
    fisheyeFilter.strength = avg;
    zoomBlurFilter.strength = avg / 10;
    loadText.scale.set(avg / 4 + 1);
  }

  const normalizeFQ = (val: number) => {
    return val / 255;
  };
});
