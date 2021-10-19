var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class EmoteProvider {
  constructor(_options) {
    __publicField(this, "baseUrl", "");
  }
}
class BetterTTV extends EmoteProvider {
  constructor() {
    super(...arguments);
    __publicField(this, "baseURL", "");
  }
}
class Chatterino extends EmoteProvider {
  constructor() {
    super(...arguments);
    __publicField(this, "baseURL", "");
  }
}
class FrankerFZ extends EmoteProvider {
}
class SevenTV extends EmoteProvider {
}
class TwitchTV extends EmoteProvider {
}
export { BetterTTV, Chatterino, EmoteProvider, FrankerFZ, SevenTV, TwitchTV };
