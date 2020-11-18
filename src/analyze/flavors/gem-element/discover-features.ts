import { Node } from "typescript";
import { ComponentMember } from "../../types/features/component-member";
import { getMemberVisibilityFromNode, getModifiersFromNode } from "../../util/ast-util";
import { getJsDoc } from "../../util/js-doc-util";
import { lazy } from "../../util/lazy";
import { resolveNodeValue } from "../../util/resolve-node-value";
import { camelToDashCase } from "../../util/text-util";
import { AnalyzerDeclarationVisitContext } from "../analyzer-flavor";
import { AnalyzerVisitContext } from "../../analyzer-visit-context";
import { JsDoc } from "../../types/js-doc";
import { ComponentEvent } from "../../types/features/component-event";
import { ComponentSlot } from "../../types/features/component-slot";
import { ComponentCssPart } from "../../types/features/component-css-part";

export function discoverMembers(node: Node, context: AnalyzerDeclarationVisitContext): ComponentMember[] | undefined {
	const metadata = parseNode(node, context);
	if (!metadata) return undefined;
	const { kind, propName, defaultValue, jsDoc } = metadata;
	if (!["property", "attribute", "numattribute", "boolattribute"].includes(kind)) return undefined;
	const { ts, checker } = context;
	if (kind === "property") {
		return [
			{
				priority: "high",
				kind: "property",
				propName,
				attrName: undefined,
				type: lazy(() => checker.getTypeAtLocation(node)),
				node,
				default: defaultValue,
				required: undefined,
				jsDoc,
				visibility: getMemberVisibilityFromNode(node, ts),
				reflect: "both",
				modifiers: getModifiersFromNode(node, ts)
			}
		];
	} else {
		return [
			{
				priority: "high",
				kind: "attribute",
				propName: undefined,
				attrName: camelToDashCase(propName),
				type: lazy(() => ({ kind: "STRING" })),
				node,
				default: defaultValue !== undefined ? defaultValue : kind === "attribute" ? "" : kind === "numattribute" ? 0 : false,
				required: undefined,
				jsDoc,
				visibility: undefined,
				reflect: undefined,
				deprecated: undefined
			}
		];
	}
}

export function discoverEvents(node: Node, context: AnalyzerDeclarationVisitContext): ComponentEvent[] | undefined {
	const metadata = parseNode(node, context);
	if (!metadata) return undefined;
	const { kind, propName, jsDoc } = metadata;
	if (kind !== "emitter") return undefined;
	return [
		{
			jsDoc,
			node,
			name: camelToDashCase(propName),
			type: lazy(() => context.checker.getTypeAtLocation(node))
		}
	];
}

export function discoverSlots(node: Node, context: AnalyzerDeclarationVisitContext): ComponentSlot[] | undefined {
	const metadata = parseNode(node, context);
	if (!metadata) return undefined;
	const { kind, propName, jsDoc, defaultValue } = metadata;
	if (kind !== "slot") return undefined;
	const name = typeof defaultValue === "string" ? defaultValue : propName;
	return [
		{
			jsDoc,
			name: name === "-" ? undefined : camelToDashCase(name),
			permittedTagNames: undefined
		}
	];
}

export function discoverCSSParts(node: Node, context: AnalyzerDeclarationVisitContext): ComponentCssPart[] | undefined {
	const metadata = parseNode(node, context);
	if (!metadata) return undefined;
	const { kind, propName, defaultValue, jsDoc } = metadata;
	if (kind !== "part") return undefined;
	return [
		{
			name: camelToDashCase(typeof defaultValue === "string" ? defaultValue : propName),
			jsDoc
		}
	];
}

interface MetaData {
	kind: GemElementDecoratorKind;
	propName: string;
	defaultValue: unknown;
	jsDoc?: JsDoc;
}

function parseNode(node: Node, context: AnalyzerDeclarationVisitContext): MetaData | undefined {
	const { ts } = context;

	// Never pick up members not declared directly on the declaration node being traversed
	if (node.parent !== context.declarationNode) {
		return undefined;
	} else if (ts.isSetAccessor(node) || ts.isGetAccessor(node) || ts.isPropertyDeclaration(node) || ts.isPropertySignature(node)) {
		const kind = getGemElementDecorator(node, context);

		if (kind) {
			const propName = node.name.getText();

			// Find the default value for this property
			const initializer = "initializer" in node ? node.initializer : undefined;
			const resolvedDefaultValue = initializer != null ? resolveNodeValue(initializer, context) : undefined;
			const defaultValue = resolvedDefaultValue != null ? resolvedDefaultValue.value : initializer?.getText();
			const jsDoc = getJsDoc(node, ts);

			return {
				kind,
				propName,
				defaultValue,
				jsDoc
			};
		}

		return undefined;
	}
}

type GemElementDecoratorKind = "property" | "attribute" | "numattribute" | "boolattribute" | "emitter" | "slot" | "part" | "state";

const GEM_ELEMENT_DECORATOR_KINDS: GemElementDecoratorKind[] = [
	"property",
	"attribute",
	"numattribute",
	"boolattribute",
	"emitter",
	"slot",
	"part",
	"state"
];

function getGemElementDecorator(node: Node, context: AnalyzerVisitContext): GemElementDecoratorKind | undefined {
	if (node.decorators == null) return undefined;
	const { ts } = context;

	for (const decorator of node.decorators) {
		const expression = decorator.expression;

		if (ts.isIdentifier(expression)) {
			const kind = expression.text as GemElementDecoratorKind;
			if (GEM_ELEMENT_DECORATOR_KINDS.includes(kind)) {
				return kind;
			}
		}
	}
}
