import { AnalyzerVisitContext } from "../../analyzer-visit-context";
import { ComponentMethod } from "../../types/features/component-method";
import { AnalyzerFlavor } from "../analyzer-flavor";

const GEM_ELEMENT_PROTECTED_METHODS = ["effect", "update", "setState", "willMount", "render", "mounted", "shouldUpdate", "updated", "unmounted"];

export const refineFeature: AnalyzerFlavor["refineFeature"] = {
	method: (method: ComponentMethod, context: AnalyzerVisitContext): ComponentMethod | undefined => {
		if (GEM_ELEMENT_PROTECTED_METHODS.includes(method.name)) {
			return {
				...method,
				visibility: "protected"
			};
		}

		return method;
	}
};
