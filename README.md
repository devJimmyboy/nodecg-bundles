# [devJimmyboy](https://twitch.tv/devJimmyboy)'s NodeCG Bundles

> Several packages that provide stream overlays for Jimmy's stream.

Most of these bundles are written in **TypeScript**, but there might still be some JavaScript source code from before I switched to my beautiful types :D

<center>
Pictures coming soon!
</center>

### Installing on your own

> Not recommended due to my very messy code. If you don't care, then do the following:

Either **clone the repo or use degit** to get this repo anywhere on your device _(NodeCG takes absolute paths so no matter what it'll be a long string in your config)_

```bash
git clone https://github.com/devJimmyboy/nodecg-bundles
```

Alternatively, you can use degit to get the repo:

```bash
npm i -g degit
degit devJimmyboy/nodecg-bundles ./nodecg-bundles
```

After cloning, install & build all of the bundles with **yarn/npm workspaces**

```bash
cd ./nodecg-bundles
yarn && yarn workspaces run build
```

Wait. This probably will take a while, I love my packages :)

Also try and use yarn otherwise a "conflict" will occur with [use-nodecg](https://github.com/hoishin/use-nodecg), you'd need to run `npm install --force`

Lastly, NodeCG needs to know you want my bundles to load. Go into the root of your Nodecg installation & open `config/nodecg.json` and add the **_ABSOLUTE_** path to the **/packages** folder of this repo (looks like `"C:\...\nodecg-bundles\packages"`)

Start up NodeCG, & hopefully you got everything up and running! ~woo~

---

## Bundles & Their Statuses

> In order of importance/features

### [Twitch](./packages/twitch)

Status: Unstable yet Important

Features:

- Animated Sub Goals Graphic
- Fully working emote parsing from **7tv, BetterTTV, & FrankerFaceZ**. You receive an HTML String upon calling

```ts
nodecg.sendMessageToBundle("parseEmotes", "twitch",
  {
    message: "LULW you're so dead KEK",
    options: {
      classListWords: ["text-sm", "text-white"]
      classListEmoteSpan: ["max-h-20"]
      classListEmoteImg: ["emote"]
    }
  })
  .then((res) => $(res).appendTo("#chatMessage"))
  // This is actually exploitable by chat so pls filter this or don't use chat lol
```

- A fully working Twitch Alert Listener w/ an Alert Handler to send alerts to `simple-alerts` bundle.
- **[Currently being Implemented]** A channel-points custom reward system that runs functions you write in the dashboard on redemption.

---

### [Simple Alerts](./packages/simple-alerts)

Status: Semi-Stable, needs some bug-fixing.

Known Issues:

- Sometimes the graphics don't play alerts on load.

---

### [Peepo Interactive](./packages/peepo-interactive)

Status: Stable

Animated little peepo that will run to places on screen that the viewer click (through [Heat](https://heat.j38.net/))

---

### [Stream Starting](./packages/stream-starting)

Status: Stable

Custom webm video background + a stinger transition when starting + a loading bar w/ custom time + a custom text-based message (no emotes... yet) while loading

---

### [Current Song](./packages/nodecg-currentsong)

Status: Stable

Connects to Last.fm API & polls it. When it see's a new song it alerts the graphics to slide out.

---

### [obs](./packages/obs)

Status: Stable

Upload a .webm & position it around the stream. I use it for a lil animated Logo I have. This also connects to your OBS instance and sends a nodecg message when you switch scenes **(scene-based layouts in graphics)**.

---

### [heat](./packages/heat)

Status: Stable

Connects to [Heat](https://heat.j38.net/)'s api & sends a nodecg message when someone clicks on the stream. Also will try to figure out who sent the click but they need to have given permission to the extension on Twitch.

---

### [Misc. Components](./packages/misc-components)

Status: <span style="color:red; font-weight:semi-bold;font-size: 2.5rem; position: absolute; top: -60%; left: 20%;"><strong>FUCKED</strong></span>

Do **NOT** use this unless you know how to finish it. I started on this for housing non-impactful HTML-based media, but quickly realized I could use something else.

---

### Acknowledgements:

- **tuxfoo's [Simple Alerts](https://github.com/tuxfoo/simple-alerts)** for providing the general structure for my **[TS Rewrite](https://github.com/devJimmyboy/nodecg-bundles/tree/main/packages/simple-alerts)**
- **codeoverflow-org's [Nodecg-io](https://github.com/codeoverflow-org/nodecg-io)** for being a great system for my bundles to attach to for easy api access.
- **Baker's [nodecg-nowplaying](https://github.com/Baker/nodecg-nowplaying)** for having a really nice-looking UI & giving me ideas for my **complete rewrite**
