import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module";
import { tsTest } from "../../helpers/ts-test";

tsTest("GemElement: Discovers slots from '@slot'", t => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	 @customElement("my-element")
	 class MyElement extends GemElement {
	    @slot fooBar: string;
	 }
	 `);

	const { slots } = result.componentDefinitions[0].declaration!;

	t.is(slots.length, 1);
	t.is(slots[0].name, "foo-bar");
});
