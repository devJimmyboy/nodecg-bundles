import { NodeCGStaticServer } from "nodecg-types/types/lib/nodecg-static";
import { NodeCGStatic } from "nodecg-types/types/server";

declare global {
	declare const NodeCG: NodeCGStatic;
}
