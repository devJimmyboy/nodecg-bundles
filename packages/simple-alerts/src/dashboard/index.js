"use strict";
exports.__esModule = true;
///<reference types="nodecg-types/types/browser"/>
require("./index.css");
var jscolor_1 = require("@eastdesire/jscolor");
var iconify_1 = require("@iconify/iconify");
iconify_1["default"].scan();
var alerts = nodecg.Replicant("alerts");
var art = nodecg.Replicant("assets:media-graphics");
var sound = nodecg.Replicant("assets:media-sounds");
NodeCG.waitForReplicants(alerts, art, sound).then(function () {
    alerts.value.forEach(showPanels);
    jscolor_1["default"].install();
});
function showPanels(value, index, array) {
    var fonts = [
        "Arial, sans-serif",
        "'Times New Roman', serif",
        "'Courier New', monospace",
        "'Brush Script MT', cursive",
        "Palanquin",
        "'Aclonica'",
        "'Aladin'",
        "'Amita'",
        "''Audiowide'",
        "'Balsamiq Sans'",
        "'Bebas Neue'",
        "'Fontdiner Swanky'",
    ];
    var alertHide = document.createElement("button");
    alertHide.setAttribute("id", "alertHide" + index);
    var alertHideLabel = document.createTextNode("Show/Hide Alert " + index);
    alertHide.appendChild(alertHideLabel);
    var alertWrap = document.createElement("div");
    alertWrap.setAttribute("style", "display: none");
    alertWrap.setAttribute("id", "alertWrap" + index);
    var alreadyExists = document.getElementById("alert" + index);
    var div = document.getElementById("alerts-wrap");
    var form = document.createElement("form");
    form.setAttribute("id", "alert" + index);
    var name = document.createElement("label");
    name.setAttribute("for", "alert" + index + "Name");
    var nameLabel = document.createTextNode("Alert Name: ");
    name.appendChild(nameLabel);
    var nameInput = document.createElement("input");
    nameInput.setAttribute("id", "alert" + index + "Name");
    var alertSubmit = document.createElement("button");
    alertSubmit.setAttribute("type", "submit");
    alertSubmit.setAttribute("id", "submitBtn" + index);
    var buttonLabel = document.createTextNode("Submit");
    alertSubmit.appendChild(buttonLabel);
    var alertDelete = document.createElement("button");
    var deleteWrap = document.createElement("div");
    alertDelete.setAttribute("id", "deleteBtn" + index);
    var deleteLabel = document.createTextNode("DELETE");
    alertDelete.appendChild(deleteLabel);
    var durationLabel = document.createElement("label");
    durationLabel.setAttribute("for", "duration" + index);
    durationLabel.appendChild(document.createTextNode("Duration of Alert in seconds: "));
    var duration = document.createElement("input");
    duration.setAttribute("size", "4");
    duration.setAttribute("id", "duration" + index);
    var keywordColourLabel = document.createElement("label");
    keywordColourLabel.setAttribute("for", "keywordColour" + index);
    keywordColourLabel.appendChild(document.createTextNode("Keyword Colour: "));
    var keywordColour = document.createElement("input");
    keywordColour.setAttribute("id", "keywordColour" + index);
    keywordColour.setAttribute("data-jscolor", '{preset:"dark large"}');
    keywordColour.setAttribute("size", "4");
    var fontColourLabel = document.createElement("label");
    fontColourLabel.setAttribute("for", "fontColour" + index);
    fontColourLabel.appendChild(document.createTextNode("Font Colour: "));
    var fontColour = document.createElement("input");
    fontColour.setAttribute("id", "fontColour" + index);
    fontColour.setAttribute("data-jscolor", '{preset:"dark large"}');
    fontColour.setAttribute("size", "6");
    var fontLabel = document.createElement("label");
    fontLabel.setAttribute("for", "font");
    fontLabel.appendChild(document.createTextNode("Font: "));
    var font = document.createElement("select");
    font.setAttribute("id", "font" + index);
    fonts.forEach(populateFontList);
    var fontSizeLabel = document.createElement("label");
    fontSizeLabel.setAttribute("for", "fontSize");
    fontSizeLabel.appendChild(document.createTextNode("Font Size: "));
    var fontSize = document.createElement("input");
    fontSize.setAttribute("size", "4");
    fontSize.setAttribute("id", "fontSize" + index);
    var fontWeightLabel = document.createElement("label");
    fontWeightLabel.setAttribute("for", "fontWeight");
    fontWeightLabel.appendChild(document.createTextNode("Font Weight: "));
    var fontWeight = document.createElement("input");
    fontWeight.setAttribute("size", "4");
    fontWeight.setAttribute("id", "fontWeight" + index);
    var customCSSLabel = document.createElement("label");
    customCSSLabel.setAttribute("for", "customCSS" + index);
    customCSSLabel.appendChild(document.createTextNode("Custom CSS: "));
    var customCSS = document.createElement("textarea");
    customCSS.setAttribute("id", "customCSS" + index);
    // None Option for drop down menu's
    var noneOption = document.createElement("option");
    noneOption.setAttribute("value", "none");
    var noneLabel = document.createTextNode("None");
    noneOption.appendChild(noneLabel);
    // Menu for graphics
    var select = document.createElement("select");
    select.setAttribute("id", "select" + index);
    var selectLabel = document.createElement("label");
    selectLabel.setAttribute("for", "select" + index);
    selectLabel.appendChild(document.createTextNode("Media: "));
    select.appendChild(noneOption.cloneNode(true));
    art.on("change", function (v) {
        removeAllChildren(select);
        select.appendChild(noneOption.cloneNode(true));
        v.forEach(populateList);
        if (document.body.contains(select)) {
            document.getElementById("select" + index).value = value.media;
        }
    });
    // Menu for sounds
    var selectSound = document.createElement("select");
    selectSound.setAttribute("id", "select-sound" + index);
    var selectSoundLabel = document.createElement("label");
    selectSoundLabel.setAttribute("for", "select-sound" + index);
    selectSoundLabel.appendChild(document.createTextNode("Sound: "));
    selectSound.appendChild(noneOption.cloneNode(true));
    sound.on("change", function (v) {
        removeAllChildren(selectSound);
        selectSound.appendChild(noneOption.cloneNode(true));
        v.forEach(populateSoundList);
        if (document.body.contains(selectSound)) {
            document.getElementById("select-sound" + index).value = value.sound;
        }
    });
    var volumeLabel = document.createElement("label");
    volumeLabel.setAttribute("for", "volume" + index);
    volumeLabel.appendChild(document.createTextNode("/100 (Volume)"));
    var volume = document.createElement("input");
    volume.setAttribute("size", "4");
    volume.setAttribute("id", "volume" + index);
    // Menu for layouts
    var selectLayout = document.createElement("select");
    selectLayout.setAttribute("id", "selectLayout" + index);
    var selectLayoutLabel = document.createElement("label");
    selectLayoutLabel.setAttribute("for", "selectLayout" + index);
    selectLayoutLabel.appendChild(document.createTextNode("Layout: "));
    // Layout options
    var layoutOption = document.createElement("option");
    layoutOption.setAttribute("value", "banner");
    var layoutOptionLabel = document.createTextNode("banner");
    layoutOption.appendChild(layoutOptionLabel);
    selectLayout.appendChild(layoutOption);
    layoutOption = document.createElement("option");
    layoutOption.setAttribute("value", "side");
    layoutOptionLabel = document.createTextNode("side");
    layoutOption.appendChild(layoutOptionLabel);
    selectLayout.appendChild(layoutOption);
    layoutOption = document.createElement("option");
    layoutOption.setAttribute("value", "above");
    layoutOptionLabel = document.createTextNode("above");
    layoutOption.appendChild(layoutOptionLabel);
    selectLayout.appendChild(layoutOption);
    // Create form for alert
    form.appendChild(name);
    form.appendChild(nameInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(selectLabel);
    form.appendChild(select);
    form.appendChild(document.createElement("br"));
    form.appendChild(durationLabel);
    form.appendChild(duration);
    form.appendChild(document.createElement("br"));
    form.appendChild(selectLayoutLabel);
    form.appendChild(selectLayout);
    form.appendChild(document.createElement("br"));
    form.appendChild(selectSoundLabel);
    form.appendChild(selectSound);
    form.appendChild(volume);
    form.appendChild(volumeLabel);
    form.appendChild(document.createElement("br"));
    form.appendChild(keywordColourLabel);
    form.appendChild(keywordColour);
    form.appendChild(fontColourLabel);
    form.appendChild(fontColour);
    form.appendChild(document.createElement("br"));
    form.appendChild(fontLabel);
    form.appendChild(font);
    form.appendChild(document.createElement("br"));
    form.appendChild(fontSizeLabel);
    form.appendChild(fontSize);
    form.appendChild(fontWeightLabel);
    form.appendChild(fontWeight);
    form.appendChild(document.createElement("br"));
    form.appendChild(customCSSLabel);
    form.appendChild(document.createElement("br"));
    form.appendChild(customCSS);
    form.appendChild(document.createElement("br"));
    form.appendChild(alertSubmit);
    form.appendChild(alertDelete);
    alertWrap.appendChild(form);
    div.appendChild(alertHide);
    div.appendChild(alertWrap);
    // Load the saved settings
    document.getElementById("alert" + index + "Name").value = value.name;
    document.getElementById("duration" + index).value = toSeconds(value.duration);
    document.getElementById("select" + index).value = value.media;
    document.getElementById("selectLayout" + index).value = value.layout;
    document.getElementById("select-sound" + index).value = value.sound;
    document.getElementById("volume" + index).value = value.volume;
    document.getElementById("keywordColour" + index).value = value.keywordColour;
    document.getElementById("fontColour" + index).value = value.fontColour;
    document.getElementById("customCSS" + index).value = value.customCSS;
    document.getElementById("font" + index).value = value.font;
    document.getElementById("fontSize" + index).value = value.fontSize;
    document.getElementById("fontWeight" + index).value = value.fontWeight;
    // Delete alert
    document.getElementById("deleteBtn" + index).addEventListener("click", function (e) {
        alerts.value.splice(index, 1);
    });
    // show/hide alert
    document.getElementById("alertHide" + index).addEventListener("click", function (e) {
        var showHide = document.getElementById("alertWrap" + index);
        if (showHide.style.display == "none") {
            showHide.setAttribute("style", "display: block");
        }
        else {
            showHide.setAttribute("style", "display: none");
        }
    });
    // Save changes
    document.getElementById("submitBtn" + index).addEventListener("click", function (e) {
        e.preventDefault();
        console.log("Submit alert " + index);
        value.name = document.getElementById("alert" + index + "Name").value;
        value.duration = toMS(document.getElementById("duration" + index).value);
        value.media = document.getElementById("select" + index).value;
        value.layout = document.getElementById("selectLayout" + index).value;
        value.sound = document.getElementById("select-sound" + index).value;
        value.volume = document.getElementById("volume" + index).value;
        value.keywordColour = document.getElementById("keywordColour" + index).value;
        value.fontColour = document.getElementById("fontColour" + index).value;
        value.customCSS = document.getElementById("customCSS" + index).value;
        value.font = document.getElementById("font" + index).value;
        value.fontSize = document.getElementById("fontSize" + index).value;
        value.fontWeight = document.getElementById("fontWeight" + index).value;
    });
    // Populate the graphic asset menu
    function populateList(value, index, array) {
        var option = document.createElement("option");
        option.setAttribute("value", index);
        var optionLabel = document.createTextNode(value.base);
        option.appendChild(optionLabel);
        select.appendChild(option);
    }
    // I should combine this with graphic menu and make it work for all select menu's.
    // Populate the sound asset menu
    function populateSoundList(value, index, array) {
        if (value.base) {
            var option = document.createElement("option");
            option.setAttribute("value", index);
            var optionLabel = document.createTextNode(value.base);
            option.appendChild(optionLabel);
            selectSound.appendChild(option);
        }
    }
    // Populate the font menu
    function populateFontList(value, index, array) {
        var option = document.createElement("option");
        option.setAttribute("value", value);
        var optionLabel = document.createTextNode(value);
        option.appendChild(optionLabel);
        font.appendChild(option);
    }
    function removeAllChildren(parent) {
        while (parent.lastElementChild) {
            parent.removeChild(parent.lastElementChild);
        }
    }
    // Conversions
    function toSeconds(ms) {
        return ms / 1000;
    }
    function toMS(seconds) {
        return seconds * 1000;
    }
}
// Create a new alert.
document.getElementById("newAlert").addEventListener("click", function (e) {
    alerts.value.push({
        name: "Alert1",
        message: "(name) just tipped (amount) (currency)",
        duration: 5000,
        sound: "none",
        media: "none",
        keywordColour: "#4FE639",
        fontColour: "#FFFFFF",
        layout: "banner",
        volume: 80,
        customCSS: "",
        font: "Palanquin",
        fontWeight: "800",
        fontSize: "64"
    });
});
