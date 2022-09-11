"use strict";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getAugmentedNamespace(n) {
  var f = n.default;
  if (typeof f == "function") {
    var a = function() {
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var dist = {};
var tag = {};
var base = {};
var request = {};
var querystring = {};
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var decode = function(qs, sep, eq, options) {
  sep = sep || "&";
  eq = eq || "=";
  var obj = {};
  if (typeof qs !== "string" || qs.length === 0) {
    return obj;
  }
  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1e3;
  if (options && typeof options.maxKeys === "number") {
    maxKeys = options.maxKeys;
  }
  var len = qs.length;
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }
  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = "";
    }
    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);
    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }
  return obj;
};
var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case "string":
      return v;
    case "boolean":
      return v ? "true" : "false";
    case "number":
      return isFinite(v) ? v : "";
    default:
      return "";
  }
};
var encode = function(obj, sep, eq, name) {
  sep = sep || "&";
  eq = eq || "=";
  if (obj === null) {
    obj = void 0;
  }
  if (typeof obj === "object") {
    return Object.keys(obj).map(function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }
  if (!name)
    return "";
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
};
querystring.decode = querystring.parse = decode;
querystring.encode = querystring.stringify = encode;
const __viteBrowserExternal_crypto = new Proxy({}, {
  get(_, key) {
    throw new Error(`Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code.`);
  }
});
const __viteBrowserExternal_crypto$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal_crypto
}, Symbol.toStringTag, { value: "Module" }));
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal_crypto$1);
var caster = {};
(function(exports2) {
  Object.defineProperty(exports2, "__esModule", { value: true });
  exports2.convertString = exports2.addConditionals = exports2.convertExtendedMeta = exports2.convertBasicMetaTag = exports2.joinArray = exports2.convertGetRecentTracks = exports2.setDate = exports2.convertEntryArray = exports2.convertEntry = exports2.convertImageArray = exports2.convertImage = exports2.convertSearchWithQuery = exports2.convertSearch = exports2.convertMeta = exports2.toArray = exports2.toBool = exports2.boolToInt = exports2.toInt = void 0;
  function toInt(num) {
    if (typeof num === "number") {
      return num;
    }
    const res = parseInt(num, 10);
    return isNaN(res) ? null : res;
  }
  exports2.toInt = toInt;
  const boolToInt = (bool) => Number(bool);
  exports2.boolToInt = boolToInt;
  const toBool = (bool) => bool !== 0 && bool && bool !== "0";
  exports2.toBool = toBool;
  function toArray(arr) {
    if (arr instanceof Array) {
      return arr;
    }
    if (!arr) {
      return [];
    }
    return [arr];
  }
  exports2.toArray = toArray;
  function convertMeta(meta) {
    for (let key of ["page", "perPage", "total", "totalPages", "from", "to", "index", "accepted", "ignored"]) {
      if (meta.hasOwnProperty(key)) {
        meta[key] = toInt(meta[key]);
      }
    }
    for (let key of ["artistcorrected", "trackcorrected"]) {
      if (meta.hasOwnProperty(key)) {
        meta[key] = (0, exports2.toBool)(meta[key]);
      }
    }
    return meta;
  }
  exports2.convertMeta = convertMeta;
  function convertSearch(res) {
    var _a;
    if (!res.meta) {
      res.meta = {};
    }
    delete res["opensearch:Query"]["#text"];
    res.meta.itemsPerPage = toInt(res["opensearch:itemsPerPage"]);
    delete res["opensearch:itemsPerPage"];
    res.meta.startIndex = toInt(res["opensearch:startIndex"]);
    delete res["opensearch:startIndex"];
    res.meta.totalResults = toInt(res["opensearch:totalResults"]);
    delete res["opensearch:totalResults"];
    res.meta.query = { ...res.meta.query, ...res["opensearch:Query"] };
    delete res["opensearch:Query"];
    if ((_a = res.meta.query) === null || _a === void 0 ? void 0 : _a.startPage) {
      res.meta.query.startPage = toInt(res.meta.query.startPage);
    }
    return res;
  }
  exports2.convertSearch = convertSearch;
  function convertSearchWithQuery(res) {
    res.meta;
    res.meta = res["@attr"];
    delete res["@attr"];
    res.meta.query = { for: res.meta.for };
    delete res.meta.for;
    return convertSearch(res);
  }
  exports2.convertSearchWithQuery = convertSearchWithQuery;
  function convertImage(img) {
    img.url = img["#text"];
    delete img["#text"];
    return img;
  }
  exports2.convertImage = convertImage;
  const convertImageArray = (img) => toArray(img).map(convertImage);
  exports2.convertImageArray = convertImageArray;
  function entryIntConverter(e) {
    var _a;
    for (let key of ["playcount", "listeners", "tagcount", "userplaycount", "rank", "duration", "taggings", "reach", "bootstrap", "age", "count", "match"]) {
      if (e.hasOwnProperty(key)) {
        e[key] = toInt(e[key]);
        continue;
      }
      if ((_a = e["@attr"]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(key)) {
        e[key] = toInt(e["@attr"][key]);
        delete e["@attr"];
      }
    }
    return e;
  }
  function entryStreamableConverter(e) {
    var _a, _b;
    if (e.hasOwnProperty("streamable")) {
      if (e.streamable.hasOwnProperty("fulltrack")) {
        e.streamable.isStreamable = (0, exports2.toBool)(e.streamable["#text"]);
        delete e.streamable["#text"];
        e.streamable.fulltrack = (0, exports2.toBool)(e.streamable.fulltrack);
      } else {
        e.streamable = (0, exports2.toBool)((_b = (_a = e.streamable) === null || _a === void 0 ? void 0 : _a["#text"]) !== null && _b !== void 0 ? _b : e.streamable);
      }
    }
    return e;
  }
  function convertEntry(e) {
    e = entryIntConverter(e);
    for (let key of ["ontour", "userloved", "subscriber", "loved"]) {
      if (e.hasOwnProperty(key)) {
        e[key] = (0, exports2.toBool)(e[key]);
      }
    }
    e = entryStreamableConverter(e);
    if (e.hasOwnProperty("image")) {
      e.image = (0, exports2.convertImageArray)(e.image);
    }
    return e;
  }
  exports2.convertEntry = convertEntry;
  const convertEntryArray = (e) => toArray(e).map(convertEntry);
  exports2.convertEntryArray = convertEntryArray;
  function setName(e) {
    var _a;
    if (!e.artist.hasOwnProperty("name")) {
      e.artist.name = e.artist["#text"];
      delete e.artist["#text"];
    }
    if (e.hasOwnProperty("album")) {
      (_a = e.album).name || (_a.name = e.album["#text"]);
      delete e.album["#text"];
    }
    return e;
  }
  function setDate(e, prop) {
    var _a;
    if (e.hasOwnProperty(prop)) {
      e[prop].datetime = e[prop]["#text"];
      delete e[prop]["#text"];
      e[prop].uts = toInt((_a = e[prop].uts) !== null && _a !== void 0 ? _a : e[prop].unixtime);
      delete e[prop].unixtime;
    }
    return e;
  }
  exports2.setDate = setDate;
  function convertGetRecentTracksEntry(e) {
    var _a;
    e = setName(e);
    e = setDate(e, "date");
    if ((_a = e === null || e === void 0 ? void 0 : e["@attr"]) === null || _a === void 0 ? void 0 : _a.hasOwnProperty("nowplaying")) {
      e.nowplaying = (0, exports2.toBool)(e["@attr"].nowplaying);
      delete e["@attr"];
    } else {
      e.nowplaying = false;
    }
    return convertEntry(e);
  }
  const convertGetRecentTracks = (e) => toArray(e).map(convertGetRecentTracksEntry);
  exports2.convertGetRecentTracks = convertGetRecentTracks;
  const joinArray = (e) => Array.isArray(e) ? e.join(",") : e;
  exports2.joinArray = joinArray;
  function convertBasicMetaTag(res) {
    res.meta = res["@attr"];
    delete res["@attr"];
    res.tags = toArray(res.tag);
    delete res.tag;
    return res;
  }
  exports2.convertBasicMetaTag = convertBasicMetaTag;
  function convertExtendedMeta(res, type) {
    res.meta = convertMeta(res["@attr"]);
    delete res["@attr"];
    res[`${type}s`] = (0, exports2.convertEntryArray)(res[type]);
    delete res[type];
    return res;
  }
  exports2.convertExtendedMeta = convertExtendedMeta;
  function addConditionals(req, props) {
    for (let [key, value] of Object.entries(props)) {
      if (value !== void 0) {
        req[key] = value;
      }
    }
    return req;
  }
  exports2.addConditionals = addConditionals;
  function convertString(str, name, props) {
    if (typeof str !== "string") {
      return str;
    }
    let obj = {};
    obj[name] = str;
    return addConditionals(obj, props);
  }
  exports2.convertString = convertString;
})(caster);
var browserPonyfill = { exports: {} };
(function(module2, exports2) {
  var global2 = typeof self !== "undefined" ? self : commonjsGlobal;
  var __self__ = function() {
    function F() {
      this.fetch = false;
      this.DOMException = global2.DOMException;
    }
    F.prototype = global2;
    return new F();
  }();
  (function(self2) {
    (function(exports3) {
      var support = {
        searchParams: "URLSearchParams" in self2,
        iterable: "Symbol" in self2 && "iterator" in Symbol,
        blob: "FileReader" in self2 && "Blob" in self2 && function() {
          try {
            new Blob();
            return true;
          } catch (e) {
            return false;
          }
        }(),
        formData: "FormData" in self2,
        arrayBuffer: "ArrayBuffer" in self2
      };
      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj);
      }
      if (support.arrayBuffer) {
        var viewClasses = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ];
        var isArrayBufferView = ArrayBuffer.isView || function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
        };
      }
      function normalizeName(name) {
        if (typeof name !== "string") {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError("Invalid character in header field name");
        }
        return name.toLowerCase();
      }
      function normalizeValue(value) {
        if (typeof value !== "string") {
          value = String(value);
        }
        return value;
      }
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return { done: value === void 0, value };
          }
        };
        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }
        return iterator;
      }
      function Headers(headers) {
        this.map = {};
        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }
      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ", " + value : value;
      };
      Headers.prototype["delete"] = function(name) {
        delete this.map[normalizeName(name)];
      };
      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
      };
      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name));
      };
      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };
      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };
      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items);
      };
      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items);
      };
      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items);
      };
      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }
      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError("Already read"));
        }
        body.bodyUsed = true;
      }
      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        });
      }
      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
      }
      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise;
      }
      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);
        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join("");
      }
      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0);
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer;
        }
      }
      function Body() {
        this.bodyUsed = false;
        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = "";
          } else if (typeof body === "string") {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }
          if (!this.headers.get("content-type")) {
            if (typeof body === "string") {
              this.headers.set("content-type", "text/plain;charset=UTF-8");
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set("content-type", this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
            }
          }
        };
        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as blob");
            } else {
              return Promise.resolve(new Blob([this._bodyText]));
            }
          };
          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
            } else {
              return this.blob().then(readBlobAsArrayBuffer);
            }
          };
        }
        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }
          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob);
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
          } else if (this._bodyFormData) {
            throw new Error("could not read FormData body as text");
          } else {
            return Promise.resolve(this._bodyText);
          }
        };
        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode2);
          };
        }
        this.json = function() {
          return this.text().then(JSON.parse);
        };
        return this;
      }
      var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method;
      }
      function Request(input, options) {
        options = options || {};
        var body = options.body;
        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError("Already read");
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }
        this.credentials = options.credentials || this.credentials || "same-origin";
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || "GET");
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;
        if ((this.method === "GET" || this.method === "HEAD") && body) {
          throw new TypeError("Body not allowed for GET or HEAD requests");
        }
        this._initBody(body);
      }
      Request.prototype.clone = function() {
        return new Request(this, { body: this._bodyInit });
      };
      function decode2(body) {
        var form = new FormData();
        body.trim().split("&").forEach(function(bytes) {
          if (bytes) {
            var split = bytes.split("=");
            var name = split.shift().replace(/\+/g, " ");
            var value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        });
        return form;
      }
      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(":");
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(":").trim();
            headers.append(key, value);
          }
        });
        return headers;
      }
      Body.call(Request.prototype);
      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }
        this.type = "default";
        this.status = options.status === void 0 ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = "statusText" in options ? options.statusText : "OK";
        this.headers = new Headers(options.headers);
        this.url = options.url || "";
        this._initBody(bodyInit);
      }
      Body.call(Response.prototype);
      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        });
      };
      Response.error = function() {
        var response = new Response(null, { status: 0, statusText: "" });
        response.type = "error";
        return response;
      };
      var redirectStatuses = [301, 302, 303, 307, 308];
      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError("Invalid status code");
        }
        return new Response(null, { status, headers: { location: url } });
      };
      exports3.DOMException = self2.DOMException;
      try {
        new exports3.DOMException();
      } catch (err) {
        exports3.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports3.DOMException.prototype = Object.create(Error.prototype);
        exports3.DOMException.prototype.constructor = exports3.DOMException;
      }
      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request2 = new Request(input, init);
          if (request2.signal && request2.signal.aborted) {
            return reject(new exports3.DOMException("Aborted", "AbortError"));
          }
          var xhr = new XMLHttpRequest();
          function abortXhr() {
            xhr.abort();
          }
          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || "")
            };
            options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
            var body = "response" in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };
          xhr.onerror = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.ontimeout = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.onabort = function() {
            reject(new exports3.DOMException("Aborted", "AbortError"));
          };
          xhr.open(request2.method, request2.url, true);
          if (request2.credentials === "include") {
            xhr.withCredentials = true;
          } else if (request2.credentials === "omit") {
            xhr.withCredentials = false;
          }
          if ("responseType" in xhr && support.blob) {
            xhr.responseType = "blob";
          }
          request2.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });
          if (request2.signal) {
            request2.signal.addEventListener("abort", abortXhr);
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                request2.signal.removeEventListener("abort", abortXhr);
              }
            };
          }
          xhr.send(typeof request2._bodyInit === "undefined" ? null : request2._bodyInit);
        });
      }
      fetch.polyfill = true;
      if (!self2.fetch) {
        self2.fetch = fetch;
        self2.Headers = Headers;
        self2.Request = Request;
        self2.Response = Response;
      }
      exports3.Headers = Headers;
      exports3.Request = Request;
      exports3.Response = Response;
      exports3.fetch = fetch;
      Object.defineProperty(exports3, "__esModule", { value: true });
      return exports3;
    })({});
  })(__self__);
  __self__.fetch.ponyfill = true;
  delete __self__.fetch.polyfill;
  var ctx = __self__;
  exports2 = ctx.fetch;
  exports2.default = ctx.fetch;
  exports2.fetch = ctx.fetch;
  exports2.Headers = ctx.Headers;
  exports2.Request = ctx.Request;
  exports2.Response = ctx.Response;
  module2.exports = exports2;
})(browserPonyfill, browserPonyfill.exports);
var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  Object.defineProperty(o, k2, { enumerable: true, get: function() {
    return m[k];
  } });
} : function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
};
var __importDefault$a = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(request, "__esModule", { value: true });
request.LFMRequest = void 0;
const querystring_1 = querystring;
const crypto = __importStar(require$$1);
const caster_1$a = caster;
const cross_fetch_1 = __importDefault$a(browserPonyfill.exports);
class LFMRequest {
  constructor(info, userAgent, secureConnection, params) {
    var _a, _b;
    this.key = info.key;
    this.params = Object.fromEntries(Object.entries(params).filter((e) => e[1] !== void 0 && e[1] !== null));
    this.secret = info.secret;
    this.userAgent = userAgent;
    this.connectionType = secureConnection ? "https" : "http";
    this.context = info.context;
    this.startTime = Date.now();
    if (this.params.hasOwnProperty("autocorrect")) {
      this.params.autocorrect = (0, caster_1$a.boolToInt)((_a = this.params.autocorrect) !== null && _a !== void 0 ? _a : true);
    }
    if (this.params.hasOwnProperty("recenttracks")) {
      this.params.recenttracks = (0, caster_1$a.boolToInt)((_b = this.params.recenttracks) !== null && _b !== void 0 ? _b : true);
    }
    if (this.params.hasOwnProperty("usernameOrSessionKey")) {
      this.params.user = this.params.usernameOrSessionKey;
      delete this.params.usernameOrSessionKey;
    }
  }
  async execute() {
    const isPostRequest = this.isPostRequest();
    this.context.logger.emitRequest(this.params, isPostRequest ? "POST" : "GET");
    if (isPostRequest) {
      if (this.secret === "") {
        throw new SyntaxError("Please enter an api secret key to use post requests with session key.");
      }
      this.startTime = Date.now();
      this.response = await this.post();
    } else {
      this.startTime = Date.now();
      this.response = await this.get();
    }
    return {
      res: await this.checkStatus(),
      time: Date.now() - this.startTime
    };
  }
  async checkStatus() {
    if (!this.response.ok) {
      const response = await this.response.json();
      if (typeof response === "object" && response !== null && response.hasOwnProperty("error") && response.hasOwnProperty("message")) {
        throw {
          code: response.error,
          message: response.message
        };
      } else {
        throw {
          message: this.response.statusText,
          response
        };
      }
    }
    try {
      this.response = await this.response.json();
    } catch (err) {
      throw new Error("Returned invalid json! Most likely a Last.FM issue.");
    }
    if (this.response.hasOwnProperty("error")) {
      let error = {
        message: this.response.message,
        code: this.response.error
      };
      throw error;
    }
    return this.response;
  }
  async post() {
    if (this.params.hasOwnProperty("user")) {
      this.params.sk = this.params.user;
      delete this.params.user;
    }
    if (this.params.hasOwnProperty("username")) {
      this.params.sk = this.params.username;
      delete this.params.username;
    }
    const api_sig = this.getSignature();
    const requestParam = {
      ...this.params,
      api_key: this.key,
      format: "json",
      api_sig
    };
    const paramString = (0, querystring_1.stringify)(requestParam);
    return await (0, cross_fetch_1.default)(`${this.connectionType}://ws.audioscrobbler.com/2.0/`, {
      method: "POST",
      headers: {
        "Content-Length": Buffer.byteLength(paramString).toString(),
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.userAgent
      },
      body: paramString
    });
  }
  async get() {
    const params = {
      api_key: this.key,
      format: "json",
      ...this.params
    };
    return await (0, cross_fetch_1.default)(`${this.connectionType}://ws.audioscrobbler.com/2.0?${(0, querystring_1.stringify)(params)}`, {
      method: "GET",
      headers: {
        "User-Agent": this.userAgent
      }
    });
  }
  getSignature() {
    const paramObj = {
      ...this.params,
      api_key: this.key
    };
    const args = Object.keys(paramObj).sort().map((e) => [e, paramObj[e]]);
    let sig = args.reduce((acc, cur) => `${acc}${cur[0]}${cur[1]}`, "");
    sig = crypto.createHash("md5").update(sig + this.secret).digest("hex");
    return sig;
  }
  isPostRequest() {
    var _a, _b;
    return ((_a = this.params.user) === null || _a === void 0 ? void 0 : _a.length) === 32 || ((_b = this.params.username) === null || _b === void 0 ? void 0 : _b.length) === 32 || this.params.hasOwnProperty("sk") || this.params.hasOwnProperty("token") || this.params.hasOwnProperty("password");
  }
}
request.LFMRequest = LFMRequest;
Object.defineProperty(base, "__esModule", { value: true });
const request_1 = request;
class LFMBase {
  constructor(apiKey, lastfm, apiSecret = "", userAgent = "lastfm-typed-npm", secureConnection = false) {
    this.key = apiKey;
    this.secret = apiSecret;
    this.userAgent = userAgent;
    this.secureConnection = secureConnection;
    this.info = lastfm.info;
  }
  checkLimit(limit, maxLimit) {
    if (typeof limit !== "undefined" && (limit > maxLimit || limit < 1)) {
      throw { message: `Limit out of bounds (1-${maxLimit}), ${limit} passed`, code: 6 };
    }
  }
  checkScrobbleCount(scrobbleCount, maxScrobbleCount) {
    if (typeof scrobbleCount === "undefined" || (scrobbleCount > maxScrobbleCount || scrobbleCount < 1)) {
      throw { message: `Scrobble count out of bounds (1-${maxScrobbleCount}), ${scrobbleCount} passed`, code: 6 };
    }
  }
  convertNumRes(params) {
    let newParams = {
      num_res: 50,
      offset: 0
    };
    newParams.num_res = (params === null || params === void 0 ? void 0 : params.limit) || 50;
    newParams.offset = (((params === null || params === void 0 ? void 0 : params.page) || 1) - 1) * newParams.num_res;
    return newParams;
  }
  convertGetTags(res) {
    if ((res === null || res === void 0 ? void 0 : res["#text"]) === " ") {
      res.tag = [];
      delete res["#text"];
    }
    return res;
  }
  async sendRequest(params) {
    const res = await new request_1.LFMRequest(this.info, this.userAgent, this.secureConnection, params).execute();
    this.info.context.logger.emitRequestComplete(params, res.time, res.res);
    return res.res;
  }
}
base.default = LFMBase;
var __importDefault$9 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(tag, "__esModule", { value: true });
const base_1$8 = __importDefault$9(base);
const caster_1$9 = caster;
class TagClass extends base_1$8.default {
  async getInfo(firstInput, params) {
    firstInput = (0, caster_1$9.convertString)(firstInput, "tag", params !== null && params !== void 0 ? params : {});
    return (await this.sendRequest({ method: "tag.getInfo", ...firstInput, ...params })).tag;
  }
  async getTopAlbums(firstInput, params) {
    firstInput = (0, caster_1$9.convertString)(firstInput, "tag", params !== null && params !== void 0 ? params : {});
    let res = (await this.getTop("tag.getTopAlbums", firstInput, params)).albums;
    return (0, caster_1$9.convertExtendedMeta)(res, "album");
  }
  async getTopArtists(firstInput, params) {
    firstInput = (0, caster_1$9.convertString)(firstInput, "tag", params !== null && params !== void 0 ? params : {});
    let res = (await this.getTop("tag.getTopArtists", firstInput, params)).topartists;
    return (0, caster_1$9.convertExtendedMeta)(res, "artist");
  }
  async getTopTags(params) {
    const newParams = this.convertNumRes(params);
    let res = (await this.getTop("tag.getTopTags", {}, newParams)).toptags;
    const total = (0, caster_1$9.toInt)(res["@attr"].total);
    if (total === null) {
      throw "Total is not a number";
    }
    let attr = {
      total,
      page: newParams.offset / newParams.num_res + 1,
      perPage: newParams.num_res,
      totalPages: Math.ceil(total) / newParams.num_res
    };
    res.meta = attr;
    delete res["@attr"];
    res.tags = (0, caster_1$9.convertEntryArray)(res.tag);
    delete res.tag;
    return res;
  }
  async getTopTracks(firstInput, params) {
    firstInput = (0, caster_1$9.convertString)(firstInput, "tag", params !== null && params !== void 0 ? params : {});
    let res = (await this.getTop("tag.getTopTracks", firstInput, params)).tracks;
    return (0, caster_1$9.convertExtendedMeta)(res, "track");
  }
  async getTop(method, firstInput, params) {
    var _a, _b;
    this.checkLimit(((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput === null || firstInput === void 0 ? void 0 : firstInput.limit) || ((_b = params === null || params === void 0 ? void 0 : params.num_res) !== null && _b !== void 0 ? _b : firstInput === null || firstInput === void 0 ? void 0 : firstInput.num_res), 1e3);
    return await this.sendRequest({ method, ...firstInput, ...params });
  }
}
tag.default = TagClass;
var chart = {};
var __importDefault$8 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(chart, "__esModule", { value: true });
const base_1$7 = __importDefault$8(base);
const caster_1$8 = caster;
class ChartClass extends base_1$7.default {
  async getTopArtists(params) {
    let res = (await this.getTop("chart.getTopArtists", params)).artists;
    return (0, caster_1$8.convertExtendedMeta)(res, "artist");
  }
  async getTopTags(params) {
    let res = (await this.getTop("chart.getTopTags", params)).tags;
    return (0, caster_1$8.convertExtendedMeta)(res, "tag");
  }
  async getTopTracks(params) {
    let res = (await this.getTop("chart.getTopTracks", params)).tracks;
    return (0, caster_1$8.convertExtendedMeta)(res, "track");
  }
  async getTop(method, params) {
    this.checkLimit(params === null || params === void 0 ? void 0 : params.limit, 1e3);
    return await this.sendRequest({ method, ...params });
  }
}
chart.default = ChartClass;
var auth = {};
var __importDefault$7 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(auth, "__esModule", { value: true });
const base_1$6 = __importDefault$7(base);
const caster_1$7 = caster;
class AuthClass extends base_1$6.default {
  async getToken(firstInput) {
    const token = await this.sendRequest({ method: "auth.getToken" });
    if (typeof token.token === "undefined") {
      throw Error("Something went wrong while getting the token. Probably because of Last.FM");
    }
    return token.token;
  }
  async getSession(firstInput) {
    firstInput = (0, caster_1$7.convertString)(firstInput, "token", {});
    const res = (await this.sendRequest({ method: "auth.getSession", ...firstInput })).session;
    res.subscriber = (0, caster_1$7.toBool)(res.subscriber);
    return res;
  }
  async getMobileSession(firstInput, password, token) {
    firstInput = (0, caster_1$7.convertString)(firstInput, "username", { password, token });
    return (await this.sendRequest({ method: "auth.getMobileSession", ...firstInput })).session;
  }
}
auth.default = AuthClass;
var album = {};
var __importDefault$6 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(album, "__esModule", { value: true });
const base_1$5 = __importDefault$6(base);
const caster_1$6 = caster;
class AlbumClass extends base_1$5.default {
  async addTags(firstInput, album2, tags, sk) {
    firstInput = (0, caster_1$6.convertString)(firstInput, "artist", { album: album2, tags, sk });
    firstInput.tags = (0, caster_1$6.joinArray)(firstInput.tags);
    return await this.sendRequest({ method: "album.addTags", ...firstInput });
  }
  async getInfo(firstInput, params) {
    var _a, _b;
    let res = (await this.sendRequest({ method: "album.getInfo", ...firstInput, ...params })).album;
    res = (0, caster_1$6.convertEntry)(res);
    res.tracks = (0, caster_1$6.convertEntryArray)((_a = res.tracks) === null || _a === void 0 ? void 0 : _a.track);
    res.tags = (0, caster_1$6.convertEntryArray)((_b = res.tags) === null || _b === void 0 ? void 0 : _b.tag);
    return res;
  }
  async getTags(firstInput, usernameOrSessionKey, params) {
    let req = (0, caster_1$6.addConditionals)({ ...firstInput, ...params }, { user: usernameOrSessionKey });
    let res = this.convertGetTags((await this.sendRequest({ method: "album.getTags", ...req })).tags);
    return (0, caster_1$6.convertBasicMetaTag)(res);
  }
  async getTopTags(firstInput, params) {
    let res = (await this.sendRequest({ method: "album.getTopTags", ...firstInput, ...params })).toptags;
    return (0, caster_1$6.convertBasicMetaTag)(res);
  }
  async removeTag(firstInput, album2, tag2, sk) {
    firstInput = (0, caster_1$6.convertString)(firstInput, "artist", { album: album2, tag: tag2, sk });
    return await this.sendRequest({ method: "album.removeTag", ...firstInput });
  }
  async search(firstInput, params) {
    var _a;
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput.limit, 1e3);
    firstInput = (0, caster_1$6.convertString)(firstInput, "album", {});
    let res = (await this.sendRequest({ method: "album.search", ...firstInput, ...params })).results;
    res = (0, caster_1$6.convertSearchWithQuery)(res);
    res.albumMatches = (0, caster_1$6.convertEntryArray)(res.albummatches.album);
    delete res.albummatches;
    return res;
  }
}
album.default = AlbumClass;
var artist = {};
var __importDefault$5 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(artist, "__esModule", { value: true });
const base_1$4 = __importDefault$5(base);
const caster_1$5 = caster;
class ArtistClass extends base_1$4.default {
  async addTags(firstInput, tags, sk) {
    firstInput = (0, caster_1$5.convertString)(firstInput, "artist", { tags, sk });
    firstInput.tags = (0, caster_1$5.joinArray)(firstInput.tags);
    return await this.sendRequest({ method: "artist.addTags", ...firstInput });
  }
  async getCorrection(artist2) {
    var _a, _b;
    artist2 = (0, caster_1$5.convertString)(artist2, "artist", {});
    let res = ((_b = (_a = await this.sendRequest({ method: "artist.getCorrection", ...artist2 })) === null || _a === void 0 ? void 0 : _a.corrections) === null || _b === void 0 ? void 0 : _b.correction) || {};
    if (Object.keys(res).length) {
      res.index = (0, caster_1$5.toInt)(res["@attr"].index);
      delete res["@attr"];
    }
    return res;
  }
  async getInfo(firstInput, params) {
    var _a, _b, _c;
    let res = (await this.sendRequest({ method: "artist.getInfo", ...firstInput, ...params })).artist;
    res.similarArtists = (0, caster_1$5.toArray)((_a = res.similar) === null || _a === void 0 ? void 0 : _a.artist);
    delete res.similar;
    res.tags = (0, caster_1$5.toArray)((_b = res.tags) === null || _b === void 0 ? void 0 : _b.tag);
    if (res.bio) {
      res.bio.link = (_c = res.bio.links) === null || _c === void 0 ? void 0 : _c.link;
      delete res.bio.links;
    }
    res = (0, caster_1$5.convertEntry)(res);
    res.stats = (0, caster_1$5.convertEntry)(res.stats);
    return res;
  }
  async getSimilar(firstInput, params) {
    var _a;
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput.limit, 1e3);
    let res = (await this.sendRequest({ method: "artist.getSimilar", ...firstInput, ...params })).similarartists;
    res.meta = res["@attr"];
    delete res["@attr"];
    res.artists = (0, caster_1$5.convertEntryArray)(res.artist);
    delete res.artist;
    return res;
  }
  async getTags(firstInput, usernameOrSessionKey, params) {
    let req = (0, caster_1$5.addConditionals)({ ...firstInput, ...params }, { user: usernameOrSessionKey });
    let res = this.convertGetTags((await this.sendRequest({ method: "artist.getTags", ...req })).tags);
    return (0, caster_1$5.convertBasicMetaTag)(res);
  }
  async getTopAlbums(firstInput, params) {
    var _a;
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput.limit, 1e3);
    let res = (await this.sendRequest({ method: "artist.getTopAlbums", ...firstInput, ...params })).topalbums;
    res.albums = (0, caster_1$5.toArray)(res.album).filter((e) => e.name !== "(null)").map(caster_1$5.convertEntry);
    delete res.album;
    res.meta = (0, caster_1$5.convertMeta)(res["@attr"]);
    delete res["@attr"];
    return res;
  }
  async getTopTags(firstInput, params) {
    let res = (await this.sendRequest({ method: "artist.getTopTags", ...firstInput, ...params })).toptags;
    return (0, caster_1$5.convertBasicMetaTag)(res);
  }
  async getTopTracks(firstInput, params) {
    var _a;
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput.limit, 1e3);
    let res = (await this.sendRequest({ method: "artist.getTopTracks", ...firstInput, ...params })).toptracks;
    res.tracks = (0, caster_1$5.convertEntryArray)(res.track);
    delete res.track;
    res.meta = (0, caster_1$5.convertMeta)(res["@attr"]);
    delete res["@attr"];
    return res;
  }
  async removeTag(firstInput, tag2, sk) {
    firstInput = (0, caster_1$5.convertString)(firstInput, "artist", { tag: tag2, sk });
    firstInput.tag = (0, caster_1$5.joinArray)(firstInput.tag);
    return await this.sendRequest({ method: "artist.removeTag", ...firstInput });
  }
  async search(firstInput, params) {
    var _a;
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput === null || firstInput === void 0 ? void 0 : firstInput.limit, 1e3);
    if (typeof firstInput === "string") {
      firstInput = { artist: firstInput };
    }
    let res = (await this.sendRequest({ method: "artist.search", ...firstInput, ...params })).results;
    res = (0, caster_1$5.convertSearchWithQuery)(res);
    res.artistMatches = (0, caster_1$5.convertEntryArray)(res.artistmatches.artist);
    delete res.artistmatches;
    return res;
  }
}
artist.default = ArtistClass;
var library = {};
var __importDefault$4 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(library, "__esModule", { value: true });
const base_1$3 = __importDefault$4(base);
const caster_1$4 = caster;
class LibraryClass extends base_1$3.default {
  async getArtists(firstInput, params) {
    var _a;
    firstInput = (0, caster_1$4.convertString)(firstInput, "user", {});
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput === null || firstInput === void 0 ? void 0 : firstInput.limit, 1e3);
    let res = (await this.sendRequest({ method: "library.getArtists", ...firstInput, ...params })).artists;
    return (0, caster_1$4.convertExtendedMeta)(res, "artist");
  }
}
library.default = LibraryClass;
var track = {};
var __importDefault$3 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(track, "__esModule", { value: true });
const base_1$2 = __importDefault$3(base);
const caster_1$3 = caster;
class TrackClass extends base_1$2.default {
  async addTags(artist2, track2, tags, sk) {
    artist2 = (0, caster_1$3.convertString)(artist2, "artist", { track: track2, tags, sk });
    artist2.tags = (0, caster_1$3.joinArray)(artist2.tags);
    return await this.sendRequest({ method: "track.addTags", ...artist2 });
  }
  async getCorrection(artist2, track2) {
    var _a, _b;
    artist2 = (0, caster_1$3.convertString)(artist2, "artist", { track: track2 });
    let res = ((_b = (_a = await this.sendRequest({ method: "track.getCorrection", ...artist2 })) === null || _a === void 0 ? void 0 : _a.corrections) === null || _b === void 0 ? void 0 : _b.correction) || {};
    if (!res.track.hasOwnProperty("name")) {
      res = {};
    }
    if (Object.keys(res).length) {
      res.meta = (0, caster_1$3.convertMeta)(res["@attr"]);
      delete res["@attr"];
    }
    return res;
  }
  async getInfo(track2, params) {
    var _a, _b;
    let res = (await this.sendRequest({ method: "track.getInfo", ...track2, ...params })).track;
    res.toptags = (0, caster_1$3.toArray)((_a = res.toptags) === null || _a === void 0 ? void 0 : _a.tag);
    res = (0, caster_1$3.convertEntry)(res);
    if (res.album) {
      if (res.album["@attr"]) {
        res.album.position = (0, caster_1$3.toInt)((_b = res.album["@attr"]) === null || _b === void 0 ? void 0 : _b.position);
        delete res.album["@attr"];
      }
      res.album.image = (0, caster_1$3.convertImageArray)(res.album.image);
    }
    return res;
  }
  async getSimilar(track2, params) {
    var _a;
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : track2 === null || track2 === void 0 ? void 0 : track2.limit, 1e3);
    let res = (await this.sendRequest({ method: "track.getSimilar", ...track2, ...params })).similartracks;
    return (0, caster_1$3.convertExtendedMeta)(res, "track");
  }
  async getTags(track2, username, params) {
    track2 = (0, caster_1$3.addConditionals)(track2, { username });
    let res = this.convertGetTags((await this.sendRequest({ method: "track.getTags", ...track2, ...params })).tags);
    return (0, caster_1$3.convertBasicMetaTag)(res);
  }
  async getTopTags(track2, params) {
    let res = (await this.sendRequest({ method: "track.getTopTags", ...track2, ...params })).toptags;
    return (0, caster_1$3.convertBasicMetaTag)(res);
  }
  async love(artist2, track2, sk) {
    artist2 = (0, caster_1$3.convertString)(artist2, "artist", { track: track2, sk });
    return await this.sendRequest({ method: "track.love", ...artist2 });
  }
  async removeTag(artist2, track2, tag2, sk) {
    artist2 = (0, caster_1$3.convertString)(artist2, "artist", { track: track2, sk, tag: tag2 });
    return await this.sendRequest({ method: "track.removeTag", ...artist2 });
  }
  async scrobble(firstInput, scrobbles) {
    firstInput = (0, caster_1$3.convertString)(firstInput, "sk", { scrobbles });
    this.checkScrobbleCount(firstInput.scrobbles.length, 50);
    let params = {};
    for (let [index, scrobble] of firstInput.scrobbles.entries()) {
      for (let [key, value] of Object.entries(scrobble)) {
        if (value === void 0) {
          continue;
        }
        if (key === "chosenByUser") {
          params[`${key}[${index}]`] = (0, caster_1$3.boolToInt)(value);
        } else {
          params[`${key}[${index}]`] = value;
        }
      }
    }
    let res = (await this.sendRequest({ method: "track.scrobble", ...params, sk: firstInput.sk })).scrobbles;
    res.meta = (0, caster_1$3.convertMeta)(res["@attr"]);
    delete res["@attr"];
    res.scrobbles = (0, caster_1$3.toArray)(res.scrobble).map((e) => {
      e.ignoredMessage.message = e.ignoredMessage["#text"];
      delete e.ignoredMessage["#text"];
      if (e.artist["#text"]) {
        e.artist.name = e.artist["#text"];
        delete e.artist["#text"];
      }
      if (e.album["#text"]) {
        e.album.name = e.album["#text"];
        delete e.album["#text"];
      }
      if (e.track["#text"]) {
        e.track.name = e.track["#text"];
        delete e.track["#text"];
      }
      if (e.albumArtist["#text"]) {
        e.albumArtist.name = e.albumArtist["#text"];
        delete e.albumArtist["#text"];
      }
      e.artist.corrected = (0, caster_1$3.toBool)(e.artist.corrected);
      e.album.corrected = (0, caster_1$3.toBool)(e.album.corrected);
      e.albumArtist.corrected = (0, caster_1$3.toBool)(e.albumArtist.corrected);
      e.track.corrected = (0, caster_1$3.toBool)(e.track.corrected);
      e.ignoredMessage.code = (0, caster_1$3.toInt)(e.ignoredMessage.code);
      e.timestamp = (0, caster_1$3.toInt)(e.timestamp);
      return e;
    });
    delete res.scrobble;
    return res;
  }
  async search(track2, params) {
    var _a;
    track2 = (0, caster_1$3.convertString)(track2, "track", {});
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : track2 === null || track2 === void 0 ? void 0 : track2.limit, 1e3);
    let res = (await this.sendRequest({ method: "track.search", ...track2, ...params })).results;
    res = (0, caster_1$3.convertSearch)(res);
    res.trackMatches = (0, caster_1$3.convertEntryArray)(res.trackmatches.track);
    delete res.trackmatches;
    return res;
  }
  async unlove(artist2, track2, sk) {
    artist2 = (0, caster_1$3.convertString)(artist2, "artist", { track: track2, sk });
    return await this.sendRequest({ method: "track.unlove", ...artist2 });
  }
  async updateNowPlaying(artist2, track2, sk, params) {
    artist2 = (0, caster_1$3.convertString)(artist2, "artist", { track: track2, sk });
    return await this.sendRequest({ method: "track.updateNowPlaying", ...artist2, ...params });
  }
}
track.default = TrackClass;
var user = {};
var __importDefault$2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(user, "__esModule", { value: true });
const base_1$1 = __importDefault$2(base);
const caster_1$2 = caster;
class UserClass extends base_1$1.default {
  async getFriends(firstInput, params) {
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    let res = (await this.sendRequest({ method: "user.getFriends", ...firstInput, ...params })).friends;
    res.users = (0, caster_1$2.toArray)(res.user).map((e) => {
      e = (0, caster_1$2.setDate)(e, "registered");
      e = (0, caster_1$2.convertEntry)(e);
      return e;
    });
    delete res.user;
    res.meta = (0, caster_1$2.convertMeta)(res["@attr"]);
    delete res["@attr"];
    return res;
  }
  async getInfo(firstInput, params) {
    firstInput = (0, caster_1$2.convertString)(firstInput, "user", {});
    let res = (await this.sendRequest({ method: "user.getInfo", ...firstInput, ...params })).user;
    res.registered = (0, caster_1$2.toInt)(res.registered.unixtime);
    res = (0, caster_1$2.convertEntry)(res);
    return res;
  }
  async getLovedTracks(firstInput, params) {
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    let res = (await this.sendRequest({ method: "user.getLovedTracks", ...firstInput, ...params })).lovedtracks;
    res.meta = (0, caster_1$2.convertMeta)(res["@attr"]);
    delete res["@attr"];
    res.tracks = (0, caster_1$2.toArray)(res.track).map((e) => {
      e = (0, caster_1$2.setDate)(e, "date");
      e = (0, caster_1$2.convertEntry)(e);
      return e;
    });
    delete res.track;
    return res;
  }
  async getPersonalTags(firstInput, tag2, taggingType, params) {
    var _a;
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput === null || firstInput === void 0 ? void 0 : firstInput.limit, 1e3);
    firstInput = (0, caster_1$2.convertString)(firstInput, "user", { tag: tag2, taggingType });
    let res = (await this.sendRequest({ method: "user.getPersonalTags", ...firstInput, ...params })).taggings;
    if (res.hasOwnProperty("artists")) {
      res.artists = (0, caster_1$2.convertEntryArray)(res.artists.artist);
    } else if (res.hasOwnProperty("albums")) {
      res.albums = (0, caster_1$2.convertEntryArray)(res.albums.album);
    } else if (res.hasOwnProperty("tracks")) {
      res.tracks = (0, caster_1$2.convertEntryArray)(res.tracks.track);
    }
    res.meta = (0, caster_1$2.convertMeta)(res["@attr"]);
    delete res["@attr"];
    return res;
  }
  async getRecentTracks(firstInput, params) {
    var _a;
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    if (params === null || params === void 0 ? void 0 : params.hasOwnProperty("extended")) {
      params.extended = (_a = (0, caster_1$2.toInt)(params.extended)) !== null && _a !== void 0 ? _a : 0;
    } else if (firstInput === null || firstInput === void 0 ? void 0 : firstInput.hasOwnProperty("extended")) {
      firstInput.extended = (0, caster_1$2.toInt)(firstInput.extended);
    }
    let res = (await this.sendRequest({ method: "user.getRecentTracks", ...firstInput, ...params })).recenttracks;
    res.meta = (0, caster_1$2.convertMeta)(res["@attr"]);
    delete res["@attr"];
    res.tracks = (0, caster_1$2.convertGetRecentTracks)(res.track);
    delete res.track;
    return res;
  }
  async getTopAlbums(firstInput, params) {
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    let res = (await this.sendRequest({ method: "user.getTopAlbums", ...firstInput, ...params })).topalbums;
    return (0, caster_1$2.convertExtendedMeta)(res, "album");
  }
  async getTopArtists(firstInput, params) {
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    let res = (await this.sendRequest({ method: "user.getTopArtists", ...firstInput, ...params })).topartists;
    return (0, caster_1$2.convertExtendedMeta)(res, "artist");
  }
  async getTopTags(firstInput, params) {
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    let res = (await this.sendRequest({ method: "user.getTopTags", ...firstInput, ...params })).toptags;
    return (0, caster_1$2.convertExtendedMeta)(res, "tag");
  }
  async getTopTracks(firstInput, params) {
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    let res = (await this.sendRequest({ method: "user.getTopTracks", ...firstInput, ...params })).toptracks;
    return (0, caster_1$2.convertExtendedMeta)(res, "track");
  }
  async getWeeklyAlbumChart(firstInput, params) {
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    let res = (await this.sendRequest({ method: "user.getWeeklyAlbumChart", ...firstInput, ...params })).weeklyalbumchart;
    res.meta = (0, caster_1$2.convertMeta)(res["@attr"]);
    delete res["@attr"];
    res.albums = (0, caster_1$2.toArray)(res.album).map((e) => {
      e.artist.name = e.artist["#text"];
      delete e.artist["#text"];
      e = (0, caster_1$2.convertEntry)(e);
      return e;
    });
    delete res.album;
    return res;
  }
  async getWeeklyArtistChart(firstInput, params) {
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    let res = (await this.sendRequest({ method: "user.getWeeklyArtistChart", ...firstInput, ...params })).weeklyartistchart;
    return (0, caster_1$2.convertExtendedMeta)(res, "artist");
  }
  async getWeeklyChartList(input) {
    let res = (await this.sendRequest({ method: "user.getWeeklyChartList" })).weeklychartlist;
    res.charts = (0, caster_1$2.toArray)(res.chart).map(caster_1$2.convertMeta);
    delete res.chart;
    return res;
  }
  async getWeeklyTrackChart(firstInput, params) {
    firstInput = this.checkLimitAndConvertString(firstInput, params);
    let res = (await this.sendRequest({ method: "user.getWeeklyTrackChart", ...firstInput, ...params })).weeklytrackchart;
    res.meta = (0, caster_1$2.convertMeta)(res["@attr"]);
    delete res["@attr"];
    res.tracks = (0, caster_1$2.toArray)(res.track).map((e) => {
      e.artist.name = e.artist["#text"];
      delete e.artist["#text"];
      e = (0, caster_1$2.convertEntry)(e);
      return e;
    });
    delete res.track;
    return res;
  }
  checkLimitAndConvertString(firstInput, params) {
    var _a;
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput === null || firstInput === void 0 ? void 0 : firstInput.limit, 1e3);
    return (0, caster_1$2.convertString)(firstInput, "user", {});
  }
}
user.default = UserClass;
var helper = {};
const __viteBrowserExternal_events = new Proxy({}, {
  get(_, key) {
    throw new Error(`Module "events" has been externalized for browser compatibility. Cannot access "events.${key}" in client code.`);
  }
});
const __viteBrowserExternal_events$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal_events
}, Symbol.toStringTag, { value: "Module" }));
const require$$10 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal_events$1);
Object.defineProperty(helper, "__esModule", { value: true });
const events_1$1 = require$$10;
const caster_1$1 = caster;
class HelperClass {
  constructor(lastfm) {
    this.ArtistFromMBID = (mbid) => ({ mbid });
    this.ArtistFromName = (artist2) => ({ artist: artist2 });
    this.AlbumFromMBID = (mbid) => ({ mbid });
    this.AlbumFromName = (artist2, album2) => ({ artist: artist2, album: album2 });
    this.TrackFromMBID = (mbid) => ({ mbid });
    this.TrackFromName = (artist2, track2) => ({ artist: artist2, track: track2 });
    this.lastfm = lastfm;
  }
  async getCombo(firstInput, limit) {
    var _a;
    firstInput = (0, caster_1$1.convertString)(firstInput, "user", { limit: Math.min(1e3, limit !== null && limit !== void 0 ? limit : 200) });
    let combo = [true, true, true];
    let comboData = [["", 0], ["", 0], ["", 0]];
    let page = 0;
    let nowplaying = false;
    let trueLimit = 1e3;
    let image = [];
    while (firstInput.limit > 0 && combo[0] === combo[1] && combo[1] === combo[2] && combo[2] === true) {
      if (firstInput.limit < 1e3 && page > 0) {
        trueLimit = firstInput.limit;
        limit = 1e3;
      } else if (page === 0 && firstInput.limit <= 1e3) {
        trueLimit = firstInput.limit;
      }
      page++;
      let res = await this.lastfm.user.getRecentTracks({ ...firstInput, page });
      if (page === 1) {
        comboData[0][0] = res.tracks[0].artist.name;
        comboData[1][0] = res.tracks[0].album.name;
        comboData[2][0] = res.tracks[0].name;
        image = res.tracks[0].image;
        if (comboData[1][0] === "") {
          combo[1] = false;
        }
      }
      if ((_a = res.tracks[0]) === null || _a === void 0 ? void 0 : _a.nowplaying) {
        nowplaying = true;
        res.tracks = res.tracks.slice(1);
      }
      for (let i = 0; i < trueLimit; i++) {
        if (!combo[0] && !combo[1] && !combo[2]) {
          break;
        }
        if (combo[0]) {
          if (comboData[0][0] === res.tracks[Number(i)].artist.name) {
            comboData[0][1]++;
          } else {
            combo[0] = false;
          }
        }
        if (combo[1]) {
          if (comboData[1][0] === res.tracks[Number(i)].album.name) {
            comboData[1][1]++;
          } else {
            combo[1] = false;
          }
        }
        if (combo[2]) {
          if (comboData[2][0] === res.tracks[Number(i)].name) {
            comboData[2][1]++;
          } else {
            combo[2] = false;
          }
        }
      }
    }
    return {
      artist: {
        name: comboData[0][0],
        combo: comboData[0][1]
      },
      album: {
        name: comboData[1][0],
        combo: comboData[1][1]
      },
      track: {
        name: comboData[2][0],
        combo: comboData[2][1]
      },
      nowplaying,
      image
    };
  }
  async getNowPlaying(firstInput, detailTypes = [], params = { extended: true }) {
    var _a;
    firstInput = (0, caster_1$1.convertString)(firstInput, "user", { detailTypes, ...params });
    firstInput = this.homogenizeUserInput(firstInput);
    const curr = await this.lastfm.user.getRecentTracks(firstInput.user, { limit: 1, extended: firstInput.extended });
    const currTrack = curr.tracks[0];
    const artist2 = currTrack.artist.name;
    const track2 = currTrack.name;
    const image = currTrack.image;
    const album2 = (_a = currTrack.album) === null || _a === void 0 ? void 0 : _a.name;
    const url = currTrack.url;
    const username = curr.meta.user;
    const nowplaying = currTrack === null || currTrack === void 0 ? void 0 : currTrack.nowplaying;
    const details = {
      recent: {
        data: curr
      },
      artist: {
        successful: false
      },
      album: {
        successful: false
      },
      track: {
        successful: false
      }
    };
    if (firstInput.detailTypes) {
      const res = await this.fetchDetails(firstInput.user, firstInput.detailTypes, artist2, album2, track2);
      const exists = res.map((e) => typeof e !== "undefined" && typeof e.error === "undefined");
      let i = 0;
      if (firstInput.detailTypes.includes("artist")) {
        details.artist.data = res[i];
        details.artist.successful = exists[i];
        i++;
      }
      if (firstInput.detailTypes.includes("album") && album2) {
        details.album.data = res[i];
        details.album.successful = exists[i];
        i++;
      }
      if (firstInput.detailTypes.includes("track")) {
        details.track.data = res[i];
        details.track.successful = exists[i];
        i++;
      }
      return {
        recent: {
          artist: artist2,
          album: album2,
          track: track2,
          image,
          url,
          username,
          nowplaying
        },
        details
      };
    }
    return {
      recent: {
        artist: artist2,
        album: album2,
        track: track2,
        image,
        url,
        username,
        nowplaying
      },
      details: {
        recent: {
          data: curr
        },
        artist: {
          successful: false
        },
        album: {
          successful: false
        },
        track: {
          successful: false
        }
      }
    };
  }
  async getMatchingArtists(firstInput, user2, limit, period) {
    firstInput = (0, caster_1$1.convertString)(firstInput, "user1", { user2, limit, period });
    this.checkLimit(firstInput.limit, 1e3);
    let request2 = [
      this.lastfm.user.getTopArtists(firstInput.user1, { limit: firstInput.limit, period: firstInput.period }),
      this.lastfm.user.getTopArtists(firstInput.user2, { limit: firstInput.limit, period: firstInput.period })
    ];
    const res = await Promise.all(request2);
    return this.getIntersection(res[0].artists, res[1].artists);
  }
  cacheScrobbles(user2, params) {
    params !== null && params !== void 0 ? params : params = {};
    if (typeof user2 !== "string") {
      params.previouslyCached = user2.previouslyCached;
      params.parallelCaches = user2.parallelCaches;
      params.rateLimitTimeout = user2.rateLimitTimeout;
      user2 = user2.user;
    }
    let scrobbleEmitter = new events_1$1.EventEmitter();
    this.handleCaching(user2, scrobbleEmitter, params);
    return scrobbleEmitter;
  }
  async handleCaching(user2, scrobbleEmitter, params) {
    let count;
    try {
      count = (await this.lastfm.user.getRecentTracks(user2, { limit: 1 })).meta.total;
    } catch {
      let rateLimitInterval = setInterval(() => {
        try {
          this.handleCaching(user2, scrobbleEmitter, params);
          clearInterval(rateLimitInterval);
        } catch (err) {
        }
      });
      return;
    }
    let newCount = count - ((params === null || params === void 0 ? void 0 : params.previouslyCached) || 0);
    let totalPages = Math.ceil(newCount / 1e3);
    let rateLimited = false;
    let limitTime = (params === null || params === void 0 ? void 0 : params.rateLimitTimeout) || 3e5;
    scrobbleEmitter.emit("start", { totalPages, count: newCount });
    let pages = Array(totalPages).fill("").map((_, i) => i + 1);
    let active = Math.min((params === null || params === void 0 ? void 0 : params.parallelCaches) || 1, totalPages);
    let complete = 0;
    this.attemptClose(active, scrobbleEmitter);
    for (let currPage = 1; currPage <= active; currPage++) {
      pages.shift();
      this.handleCacheInstance(user2, scrobbleEmitter, currPage, newCount);
    }
    scrobbleEmitter.on("internalDontUse", (data) => {
      if (typeof data !== "number") {
        complete++;
        let data2 = data;
        if (data2.meta.page === totalPages) {
          data2.tracks = data2.tracks.slice(0, newCount % 1e3);
        }
        scrobbleEmitter.emit("data", { data: data2, completedPages: complete, totalPages, progress: complete / totalPages });
        if (pages.length) {
          if (!rateLimited) {
            this.handleCacheInstance(user2, scrobbleEmitter, pages[0], newCount);
            pages.shift();
          } else {
            let rateLimitInterval = setInterval(() => {
              if (!rateLimited) {
                this.handleCacheInstance(user2, scrobbleEmitter, pages[0], newCount);
                pages.shift();
                clearInterval(rateLimitInterval);
              }
            });
          }
        } else {
          active--;
          this.attemptClose(active, scrobbleEmitter);
        }
      } else {
        if (!rateLimited) {
          this.handleCacheInstance(user2, scrobbleEmitter, data, newCount);
        } else {
          let rateLimitInterval = setInterval(() => {
            if (!rateLimited) {
              this.handleCacheInstance(user2, scrobbleEmitter, data, newCount);
              clearInterval(rateLimitInterval);
            }
          });
        }
      }
    });
    scrobbleEmitter.on("error", (err, page) => {
      if ((0, caster_1$1.toInt)(err.code) === 29) {
        rateLimited = true;
        setTimeout(() => {
          rateLimited = false;
        }, limitTime);
      }
      scrobbleEmitter.emit("internalDontUse", page);
    });
  }
  attemptClose(active, scrobbleEmitter) {
    if (active === 0) {
      scrobbleEmitter.emit("close");
      scrobbleEmitter.removeAllListeners();
    }
  }
  async handleCacheInstance(user2, scrobbleEmitter, page, count) {
    var _a;
    try {
      let res = await this.lastfm.user.getRecentTracks(user2, { limit: 1e3, page });
      if (res.tracks[0].nowplaying) {
        (_a = res === null || res === void 0 ? void 0 : res.tracks) === null || _a === void 0 ? void 0 : _a.shift();
      }
      scrobbleEmitter.emit("internalDontUse", res);
    } catch (err) {
      if (typeof err === "object" && err !== null && err.hasOwnProperty("code") && err.hasOwnProperty("message")) {
        scrobbleEmitter.emit("error", {
          code: Number(err.code),
          message: err.message
        }, page);
      } else {
        scrobbleEmitter.emit("error", {
          code: 41,
          message: `An unknown error occurred. Details: ${err}`
        }, page);
      }
    }
  }
  getIntersection(arr1, arr2) {
    const aSort = arr1.sort((a, b) => a.name.localeCompare(b.name));
    const bSort = arr2.sort((a, b) => a.name.localeCompare(b.name));
    let i1 = 0;
    let i2 = 0;
    let common = [];
    while (i1 < aSort.length && i2 < bSort.length) {
      const compare = aSort[i1].name.localeCompare(bSort[i2].name);
      if (compare === 0) {
        common.push({
          name: aSort[i1].name,
          url: aSort[i1].url,
          playcount: [aSort[i1].playcount, bSort[i2].playcount]
        });
        i1++;
        i2++;
      } else {
        i1 += +(compare < 0);
        i2 += +(compare > 0);
      }
    }
    return common;
  }
  checkLimit(limit, maxLimit) {
    if (typeof limit !== "undefined" && (limit > maxLimit || limit < 1)) {
      throw new Error(`Limit out of bounds (1-${maxLimit}), ${limit} passed`);
    }
  }
  async fetchDetails(username, detailTypes, artist2, album2, track2, params) {
    let promises = [];
    let options = {
      username
    };
    if (params === null || params === void 0 ? void 0 : params.sk) {
      options.sk = params.sk;
    }
    if (detailTypes === null || detailTypes === void 0 ? void 0 : detailTypes.includes("artist")) {
      promises.push(this.lastfm.artist.getInfo({ artist: artist2 }, options).catch((err) => {
      }));
    }
    if ((detailTypes === null || detailTypes === void 0 ? void 0 : detailTypes.includes("album")) && album2) {
      promises.push(this.lastfm.album.getInfo({ artist: artist2, album: album2 }, options).catch((err) => {
      }));
    }
    if (detailTypes === null || detailTypes === void 0 ? void 0 : detailTypes.includes("track")) {
      promises.push(this.lastfm.track.getInfo({ artist: artist2, track: track2 }, options).catch((err) => {
      }));
    }
    return await Promise.all(promises);
  }
  homogenizeUserInput(input) {
    if (input.hasOwnProperty("user")) {
      return input;
    }
    for (let userInput of ["username", "sk", "usernameOrSessionKey"]) {
      if (input.hasOwnProperty(userInput)) {
        input.user = input[userInput];
        delete input[userInput];
      }
    }
    throw "No valid user input";
  }
}
helper.default = HelperClass;
var logger = {};
Object.defineProperty(logger, "__esModule", { value: true });
class LoggerClass {
  constructor(lastfm) {
    this.lastfm = lastfm;
  }
  emitRequest(args, HTTPMethod) {
    this.lastfm.emit("requestStart", args, HTTPMethod);
  }
  emitRequestComplete(args, time, res) {
    this.lastfm.emit("requestComplete", args, time, res);
  }
}
logger.default = LoggerClass;
var geo = {};
var __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(geo, "__esModule", { value: true });
const base_1 = __importDefault$1(base);
const caster_1 = caster;
class GeoClass extends base_1.default {
  async getTopArtists(firstInput, params) {
    firstInput = (0, caster_1.convertString)(firstInput, "country", {});
    let res = (await this.getTop("geo.getTopArtists", firstInput, params)).topartists;
    return (0, caster_1.convertExtendedMeta)(res, "artist");
  }
  async getTopTracks(firstInput, params) {
    firstInput = (0, caster_1.convertString)(firstInput, "country", {});
    let res = (await this.getTop("geo.getTopTracks", firstInput, params)).tracks;
    return (0, caster_1.convertExtendedMeta)(res, "track");
  }
  async getTop(method, firstInput, params) {
    var _a;
    this.checkLimit((_a = params === null || params === void 0 ? void 0 : params.limit) !== null && _a !== void 0 ? _a : firstInput === null || firstInput === void 0 ? void 0 : firstInput.limit, 1e3);
    return await this.sendRequest({ method, ...firstInput, ...params });
  }
}
geo.default = GeoClass;
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(dist, "__esModule", { value: true });
const tag_1 = __importDefault(tag);
const chart_1 = __importDefault(chart);
const auth_1 = __importDefault(auth);
const album_1 = __importDefault(album);
const artist_1 = __importDefault(artist);
const library_1 = __importDefault(library);
const track_1 = __importDefault(track);
const user_1 = __importDefault(user);
const helper_1 = __importDefault(helper);
const logger_1 = __importDefault(logger);
const events_1 = require$$10;
const geo_1 = __importDefault(geo);
class LastFM extends events_1.EventEmitter {
  constructor(apiKey, options) {
    var _a, _b, _c;
    super();
    if (!options) {
      options = {};
    }
    (_a = options.apiSecret) !== null && _a !== void 0 ? _a : options.apiSecret = "";
    (_b = options.userAgent) !== null && _b !== void 0 ? _b : options.userAgent = "lastfm-typed-npm";
    (_c = options.secureConnection) !== null && _c !== void 0 ? _c : options.secureConnection = true;
    let { apiSecret, userAgent, secureConnection } = options;
    this.info = {
      key: apiKey,
      secret: apiSecret,
      context: this
    };
    this.tag = new tag_1.default(apiKey, this, apiSecret, userAgent, secureConnection);
    this.chart = new chart_1.default(apiKey, this, apiSecret, userAgent, secureConnection);
    this.geo = new geo_1.default(apiKey, this, apiSecret, userAgent, secureConnection);
    this.auth = new auth_1.default(apiKey, this, apiSecret, userAgent, secureConnection);
    this.album = new album_1.default(apiKey, this, apiSecret, userAgent, secureConnection);
    this.artist = new artist_1.default(apiKey, this, apiSecret, userAgent, secureConnection);
    this.library = new library_1.default(apiKey, this, apiSecret, userAgent, secureConnection);
    this.track = new track_1.default(apiKey, this, apiSecret, userAgent, secureConnection);
    this.user = new user_1.default(apiKey, this, apiSecret, userAgent, secureConnection);
    this.helper = new helper_1.default(this);
    this.logger = new logger_1.default(this);
  }
}
var _default = dist.default = LastFM;
var eventemitter3 = { exports: {} };
(function(module2) {
  var has = Object.prototype.hasOwnProperty, prefix = "~";
  function Events() {
  }
  if (Object.create) {
    Events.prototype = /* @__PURE__ */ Object.create(null);
    if (!new Events().__proto__)
      prefix = false;
  }
  function EE(fn, context, once) {
    this.fn = fn;
    this.context = context;
    this.once = once || false;
  }
  function addListener(emitter, event, fn, context, once) {
    if (typeof fn !== "function") {
      throw new TypeError("The listener must be a function");
    }
    var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
    if (!emitter._events[evt])
      emitter._events[evt] = listener, emitter._eventsCount++;
    else if (!emitter._events[evt].fn)
      emitter._events[evt].push(listener);
    else
      emitter._events[evt] = [emitter._events[evt], listener];
    return emitter;
  }
  function clearEvent(emitter, evt) {
    if (--emitter._eventsCount === 0)
      emitter._events = new Events();
    else
      delete emitter._events[evt];
  }
  function EventEmitter2() {
    this._events = new Events();
    this._eventsCount = 0;
  }
  EventEmitter2.prototype.eventNames = function eventNames() {
    var names = [], events, name;
    if (this._eventsCount === 0)
      return names;
    for (name in events = this._events) {
      if (has.call(events, name))
        names.push(prefix ? name.slice(1) : name);
    }
    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }
    return names;
  };
  EventEmitter2.prototype.listeners = function listeners(event) {
    var evt = prefix ? prefix + event : event, handlers = this._events[evt];
    if (!handlers)
      return [];
    if (handlers.fn)
      return [handlers.fn];
    for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
      ee[i] = handlers[i].fn;
    }
    return ee;
  };
  EventEmitter2.prototype.listenerCount = function listenerCount(event) {
    var evt = prefix ? prefix + event : event, listeners = this._events[evt];
    if (!listeners)
      return 0;
    if (listeners.fn)
      return 1;
    return listeners.length;
  };
  EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return false;
    var listeners = this._events[evt], len = arguments.length, args, i;
    if (listeners.fn) {
      if (listeners.once)
        this.removeListener(event, listeners.fn, void 0, true);
      switch (len) {
        case 1:
          return listeners.fn.call(listeners.context), true;
        case 2:
          return listeners.fn.call(listeners.context, a1), true;
        case 3:
          return listeners.fn.call(listeners.context, a1, a2), true;
        case 4:
          return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6:
          return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }
      for (i = 1, args = new Array(len - 1); i < len; i++) {
        args[i - 1] = arguments[i];
      }
      listeners.fn.apply(listeners.context, args);
    } else {
      var length = listeners.length, j;
      for (i = 0; i < length; i++) {
        if (listeners[i].once)
          this.removeListener(event, listeners[i].fn, void 0, true);
        switch (len) {
          case 1:
            listeners[i].fn.call(listeners[i].context);
            break;
          case 2:
            listeners[i].fn.call(listeners[i].context, a1);
            break;
          case 3:
            listeners[i].fn.call(listeners[i].context, a1, a2);
            break;
          case 4:
            listeners[i].fn.call(listeners[i].context, a1, a2, a3);
            break;
          default:
            if (!args)
              for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }
    return true;
  };
  EventEmitter2.prototype.on = function on(event, fn, context) {
    return addListener(this, event, fn, context, false);
  };
  EventEmitter2.prototype.once = function once(event, fn, context) {
    return addListener(this, event, fn, context, true);
  };
  EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
    var evt = prefix ? prefix + event : event;
    if (!this._events[evt])
      return this;
    if (!fn) {
      clearEvent(this, evt);
      return this;
    }
    var listeners = this._events[evt];
    if (listeners.fn) {
      if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
        clearEvent(this, evt);
      }
    } else {
      for (var i = 0, events = [], length = listeners.length; i < length; i++) {
        if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
          events.push(listeners[i]);
        }
      }
      if (events.length)
        this._events[evt] = events.length === 1 ? events[0] : events;
      else
        clearEvent(this, evt);
    }
    return this;
  };
  EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
    var evt;
    if (event) {
      evt = prefix ? prefix + event : event;
      if (this._events[evt])
        clearEvent(this, evt);
    } else {
      this._events = new Events();
      this._eventsCount = 0;
    }
    return this;
  };
  EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
  EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
  EventEmitter2.prefixed = prefix;
  EventEmitter2.EventEmitter = EventEmitter2;
  {
    module2.exports = EventEmitter2;
  }
})(eventemitter3);
const EventEmitter = eventemitter3.exports;
const LastFMNowPlaying = (config) => new LastFMNowPlaying$1(config);
class LastFMNowPlaying$1 extends EventEmitter {
  constructor(config) {
    super();
    let { api_key, user: user2, poll_time, nowplaying_only, user_agent } = config;
    this.api_key = api_key;
    this.lastFm = new _default(api_key);
    this.user = user2;
    this.poll_time = poll_time ? poll_time : 1e4;
    this.nowplaying_only = nowplaying_only ? nowplaying_only : false;
    this.user_agent = user_agent ? user_agent : "BarryCarlyon/1.0.0 https://github.com/BarryCarlyon/LastFMNowPlaying";
    this.start();
  }
  tock() {
    return;
  }
  start() {
    this.stop();
    this.tick = setInterval(() => {
      this.tock();
    }, this.poll_time);
    this.tock();
  }
  stop() {
    clearInterval(this.tick);
  }
}
module.exports = function(nodecg) {
  const log = nodecg.log;
  log.info("current song bundle started.");
  const config = nodecg.bundleConfig;
  var last = LastFMNowPlaying({
    api_key: config.apikey,
    user: config.music.lastfmUser,
    user_agent: config.user_agent
  });
  var currentSong = nodecg.Replicant("currentSong", {
    defaultValue: {
      title: "Loading...",
      artist: "Overlay by devJimmyboy",
      albumArt: ""
    },
    persistent: true,
    persistenceInterval: 500
  });
  nodecg.Replicant("popoutTop", {
    defaultValue: "5%",
    persistent: true
  });
  last.on("error", function(e) {
    console.error(e);
  }).on("song", (res) => {
    log.debug(
      "Successfully received data from Last.fm:\n",
      res.name,
      "by",
      res.artist.name,
      "from",
      res.album.name,
      "\n",
      res.image[0].url
    );
    var data = {
      artist: res.artist.name,
      title: res.name,
      albumArt: res.image.reduceRight(
        (best, img) => img.size >= best.size ? img : best
      ).url
    };
    if (currentSong.value.title !== res.name && currentSong.value.artist !== res.artist.name) {
      currentSong.value = data;
    }
  });
};
//# sourceMappingURL=index.js.map
