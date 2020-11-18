import { Node } from "typescript";
import { AnalyzerVisitContext } from "../../analyzer-visit-context";
import { getNodeName } from "../../util/ast-util";

export function excludeNode(node: Node, context: AnalyzerVisitContext): boolean | undefined {
	if (context.config.analyzeDependencies) {
		return undefined;
	}

	const declName = getNodeName(node, context);
	if (declName != null) {
		return declName === "GemElement";
	} else {
		const fileName = node.getSourceFile().fileName;

		return fileName.includes("@mantou/gem");
	}
}
