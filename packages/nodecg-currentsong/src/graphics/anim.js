import $ from "jquery"
import { gsap } from "gsap"
import { ExpoScaleEase, RoughEase, SlowMo } from "gsap/EasePack"
import { CSSRulePlugin } from "gsap/CSSRulePlugin"
import { TextPlugin } from "gsap/TextPlugin"
gsap.registerPlugin(CSSRulePlugin, TextPlugin, RoughEase, ExpoScaleEase, SlowMo)

// Animates the whole thing.
var anims
export default (duration) => {
  const titleText = $("#songTitle")
  const artistText = $("#songArtist")
  const msgText = $("#songMessage")

  const tweens = {
    albumCover: {
      closedToOpen: gsap.fromTo(
        "#musicalbum",
        {
          autoAlpha: 1,
          height: 0,
        },
        {
          autoAlpha: 1,
          height: 235,
          duration: 1.5,
        }
      ),
      toClosed: gsap.to("#musicalbum", {
        autoAlpha: 1,
        height: 0,
      }),
      imgZoom: gsap.fromTo(".coverimg", { autoAlpha: 1, zoom: 1.25 }, { autoAlpha: 1, zoom: 1, duration: duration }),
    },
    titleScroll: {
      in: gsap.fromTo(
        ".songInfo",
        {
          autoAlpha: 0,
          xPercent: 100,
        },
        {
          autoAlpha: 1,
          xPercent: 0,
          ease: "none",
          duration: 1,
        }
      ),
      toStart: gsap.to(".songInfo", {
        x: function (i, t) {
          return "-=" + (t.parentElement.clientWidth - t.clientWidth)
        },
        ease: "slow(0.5,0.7,false)",
        duration: duration - 1.25,
      }),
      final: gsap.to(".songInfo", { autoAlpha: 0, xPercent: "-=100", duration: 0.5, ease: "none" }),
    },
  }

  anims = {
    albumCover: gsap
      .timeline({ paused: true })
      .add(tweens.albumCover.closedToOpen)
      .add(tweens.albumCover.imgZoom, "<")
      .add(tweens.albumCover.toClosed),
    // Animates the titles (slow move similar to Super Smash Bros' "introducing ____")
    titleScroll: gsap
      .timeline({ paused: true })
      .add(tweens.titleScroll.in)
      .add(tweens.titleScroll.toStart, ">-0.25")
      .add(tweens.titleScroll.final),
  }

  console.log(duration)
  gsap.set(".popoutWrapper", { autoAlpha: 0 })
  return gsap
    .timeline({
      paused: true,
    })
    .set("#musicalbum", { height: 0, autoAlpha: 0 })
    .set("#songTitle", { fontSize: "24px" })
    .fromTo(
      ".popoutWrapper",
      { autoAlpha: 0, xPercent: 100 },
      { autoAlpha: 1, xPercent: 0, ease: "power4.out", duration: 1.5 }
    )
    .call(() => {
      var src = $("img.coverimg").attr("src")
      console.log("link to album cover: ", src)
      if (src && src !== "") anims.albumCover.play(0)
    })
    .call(() => {
      anims.titleScroll.play(0)
    })
    .fromTo(
      ".popoutWrapper",
      { autoAlpha: 1, xPercent: 0 },
      { autoAlpha: 0, xPercent: 100, ease: "power4.out", duration: 1.5 },
      `+=${duration + 1.5}`
    )
}

export { anims, gsap }
