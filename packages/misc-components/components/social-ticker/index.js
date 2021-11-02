// This widget contains content from @lx who made the Top Events Rotator
// (https://github.com/StreamElements/widgets/blob/master/TopEventsRotator/widget.js)
// which was an inspiration for this widget.
// Thank you very much @lx for helping me developing this widget.

let elements = [
	{
		name: nodecg.bundleConfig.e,
		icon: "{{el1Icon}}",
		link: "{{el1IconLink}}",
		color: "{{el1Color}}",
		showImage: "{{el1IconShow}}",
		order: "{{icon1SocialOrder}}",
	},
	{
		name: "{{el2Name}}",
		icon: "{{el2Icon}}",
		link: "{{el2IconLink}}",
		color: "{{el2Color}}",
		showImage: "{{el2IconShow}}",
		order: "{{icon2SocialOrder}}",
	},
	{
		name: "{{el3Name}}",
		icon: "{{el3Icon}}",
		link: "{{el3IconLink}}",
		color: "{{el3Color}}",
		showImage: "{{el3IconShow}}",
		order: "{{icon3SocialOrder}}",
	},
	{
		name: "{{el4Name}}",
		icon: "{{el4Icon}}",
		link: "{{el4IconLink}}",
		color: "{{el4Color}}",
		showImage: "{{el4IconShow}}",
		order: "{{icon4SocialOrder}}",
	},
	/*				// To use more than 4 icons copy this example
  {
    name: "exampleName",
    icon: "discord",
    link: "https://uc45c92bdd0662d16394d3c6af22.previews.dropboxusercontent.com/p/thumb/AAbkIz3hWBqFshHVDB6EJGzzjkB4c1qXytULt6Q_ptoZ_KJQ5oxLXOgwuDZxHtMuGSbRmby2wAgiKWGBH727ZJS5lZmUsMFEt0oObn-BwVWR8cDYyC80QgjAq58K6pYdswGqqWooE0AkF5mV4nVkaXuxzTyZ_CJaCL_hIf8JTIWkBSLoQlv8Cn93TwdQx7UG7tEJ8gO_-IybOm0hlyq3-SJwP8MbL3VqWFv4P9w1yR-s4I9H99m09gZXkzDtm8fgRFni2XapqtNimJ15JRo8bZ2x4hbp8Jfv6BInCj9-wNNhNevQkKQPMHQZXRQeuUFojqguDKcPytXyI6I4oR-dKbkh/p.png?fv_content=true&size_mode=5",
    color: "#7289DA",
    showImage: "fontawesome", //none, fontawesome, url
    order: "iconfirst" //iconfirst, socialfirst
  },
  	*/
];

let next = 0;
let amount = 0;
let box;
let animationIn = "bounceIn";
let animationOut = "bounceOut";
let timeIn = 400;
let timeDisplay = 4000;
let timeOut = 400;
let timeInBetween = 400;
let timeDelay = 400;

window.addEventListener("onWidgetLoad", function (obj) {
	const fieldData = obj.detail.fieldData;
	animationIn = fieldData["animationIn"];
	animationOut = fieldData["animationOut"];
	timeIn = fieldData["timeIn"];
	timeDisplay = fieldData["timeDisplay"];
	timeOut = fieldData["timeOut"];
	timeInBetween = fieldData["timeInBetween"];
	timeDelay = fieldData["timeDelay"];
	slideTime = timeIn + timeDisplay + timeOut + timeInBetween;

	for (element of elements) {
		if (element.order == "iconfirst") {
			s = `<div class="mySlides">
          <div>
		${
			element.showImage === "url"
				? `<span class="imgcontainer"> <img class="image" src="` +
				  element.link +
				  `"></img></span>`
				: ""
		}
		${
			element.showImage === "fontawesome"
				? `<span style="color:` +
				  element.color +
				  `" class="fab fa-${element.icon}"></span>`
				: ""
		}
      	<span id=username>${element.name}</span>
          </div>
        </div>`;
		} else if (element.order == "socialfirst") {
			s = `<div class="mySlides">
          <div>
		<span id=username>${element.name}</span>
		${
			element.showImage === "url"
				? `<span class="imgcontainer"> <img class="image" src="` +
				  element.link +
				  `"></img></span>`
				: ""
		}
		${
			element.showImage === "fontawesome"
				? `<span style="color:` +
				  element.color +
				  `" class="fab fa-${element.icon}"></span>`
				: ""
		}
          </div>
        </div>`;
		}
		$(".container").append(s);
	}

	box = $(".mySlides");
	amount = box.length;
	showSlide(next);

	function showSlide(i) {
		$(box[i])
			.addClass(animationIn + " animated", timeIn)
			.show(0, timeIn)
			.delay(timeDisplay)
			.removeClass(animationIn, timeDisplay)
			.addClass(animationOut, timeOut)
			.removeClass(animationOut + " animated", timeOut)
			.hide(0, timeOut);
		next++;
		if (next >= amount) {
			next = 0;
			setTimeout(function () {
				showSlide(next);
			}, slideTime + timeDelay - timeInBetween);
		} else {
			setTimeout(function () {
				showSlide(next);
			}, slideTime);
		}
	}
});
