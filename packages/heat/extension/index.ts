// const io = require("socket.io-client");
import { Heat } from "./Heat";
import { NodeCG } from "nodecg-types/types/server";

module.exports = function (nodecg: NodeCG) {
	// let client: TwitchApiServiceClient | null = null;
	let channel = nodecg.Replicant<string>("channel", {
		defaultValue: "47019739",
		persistent: true,
	}); //648196501 - bot 47019739 - Main Channel
	if (nodecg.bundleConfig?.channel)
		channel.value = nodecg.bundleConfig.channel;
	else {
		nodecg.log.info(
			`No channel specified, using previous value or default: ${channel.value}`
		);
	}
	if (!channel.value || typeof channel.value !== "string") {
		channel.value = "47019739";
	}
	var heat: Heat;
	heat = new Heat(channel.value, nodecg);
	heat.on("click", async (data: ClickData) => {
		const clickData = {
			x: data.x,
			y: data.y,
			id: data.id,
			user: await heat.getUserById(data.id),
		};

		// Finally, use the click coordinates to create your experience.
		nodecg.log.info(
			"Someone fucking clicked the stream: ",
			clickData.x,
			clickData.y
		);
		nodecg.sendMessage("click", clickData);
	});

	nodecg.listenFor("restartHeat", heatReset);
	interface ClickData {
		id: string;
		user: { display_name: string };
		x: number;
		y: number;
	}

	nodecg.log.info("heat bundle started.");
	function heatReset() {
		heat.channelId = channel.value;
		heat.refreshConnection();
	}
};
