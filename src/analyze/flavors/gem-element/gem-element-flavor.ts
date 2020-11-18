import { discoverDefinitions } from "../lit-element/discover-definitions";
import { AnalyzerFlavor } from "../analyzer-flavor";
import { discoverMembers, discoverEvents, discoverSlots, discoverCSSParts } from "./discover-features";
import { excludeNode } from "./exclude-node";
import { refineFeature } from "./refine-feature";

export class GemElementFlavor implements AnalyzerFlavor {
	excludeNode = excludeNode;

	discoverDefinitions = discoverDefinitions;

	discoverFeatures = {
		// member: discoverMembers,
		event: discoverEvents,
		slot: discoverSlots,
		csspart: discoverCSSParts
	};

	refineFeature = refineFeature;
}
