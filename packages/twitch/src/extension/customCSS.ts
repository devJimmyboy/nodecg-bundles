import { NodeCG } from "nodecg-types/types/server";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { TailwindConfig } from "tailwindcss/tailwind-config";
import tailwindConfig from "./tailwind.config"
const config = {
  plugins: [require("postcss-import"), require("postcss-url"), require("tailwindcss/nesting")("postcss-nesting"), tailwindcss(tailwindConfig as TailwindConfig), require("autoprefixer")]
}

const pCss = postcss(config.plugins)

export default function (nodecg: NodeCG) {
  const customCSS = nodecg.Replicant<{ css: string; enabled: boolean }>("customCss");
  nodecg.listenFor("parseCss", (msg: string) => {
    pCss.process(msg).then((result) => {
      if (result.css.length > 500)
        nodecg.log.info("Parsed CSS", result.css)
      customCSS.value.css = result.css;
      nodecg.sendMessage("parseCssFinished", false)
    }).catch((err) => {
      nodecg.log.error(err);
      nodecg.sendMessage("parseCssFinished", true)
    });
  })

}