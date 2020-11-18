import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module";
import { tsTest } from "../../helpers/ts-test";
import { assertHasMembers } from "../../helpers/util";

tsTest("GemElement: Discovers attributes from '@attribute'/'@numattribute'/'@boolattribute'", t => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(`
	 @customElement("my-element")
	 class MyElement extends HTMLElement {
	    @attribute myAttr1: string;
	    @numattribute myAttr2: number;
	    @boolattribute myAttr3: boolean;
	 }
	 `);

	const { members = [] } = result.componentDefinitions[0]?.declaration || {};

	assertHasMembers(
		members,
		[
			{
				kind: "attribute",
				propName: undefined,
				attrName: "my-attr1",
				jsDoc: undefined,
				default: "",
				typeHint: undefined,
				type: () => ({ kind: "STRING" }),
				visibility: undefined,
				reflect: undefined,
				deprecated: undefined,
				required: undefined
			},
			{
				kind: "attribute",
				propName: undefined,
				attrName: "my-attr2",
				jsDoc: undefined,
				default: 0,
				typeHint: undefined,
				type: () => ({ kind: "NUMBER" }),
				visibility: undefined,
				reflect: undefined,
				deprecated: undefined,
				required: undefined
			},
			{
				kind: "attribute",
				propName: undefined,
				attrName: "my-attr3",
				jsDoc: undefined,
				default: false,
				typeHint: undefined,
				type: () => ({ kind: "BOOLEAN" }),
				visibility: undefined,
				reflect: undefined,
				deprecated: undefined,
				required: undefined
			}
		],
		t,
		checker
	);
});

tsTest("GemElement: Discovers properties from '@property'", t => {
	const {
		results: [result],
		checker
	} = analyzeTextWithCurrentTsModule(`
	 @customElement("my-element")
	 class MyElement extends GemElement { 
	    /**
	     * This is a comment
	     */
	    @property myProp: string = "hello";
	 }
	 `);

	const { members = [] } = result.componentDefinitions[0]?.declaration || {};

	assertHasMembers(
		members,
		[
			{
				kind: "property",
				propName: "myProp",
				attrName: undefined,
				jsDoc: {
					description: "This is a comment"
				},
				default: "hello",
				type: () => ({ kind: "STRING" }),
				visibility: "public",
				deprecated: undefined,
				required: undefined,
				meta: {}
			}
		],
		t,
		checker
	);
});
