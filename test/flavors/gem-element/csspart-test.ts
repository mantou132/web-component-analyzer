import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module";
import { tsTest } from "../../helpers/ts-test";

tsTest("GemElement: Discovers parts from '@part'", t => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	 @customElement("my-element")
	 class MyElement extends GemElement {
	    @part fooBar: string;
	 }
	 `);

	const { cssParts } = result.componentDefinitions[0].declaration!;

	t.is(cssParts.length, 1);
	t.is(cssParts[0].name, "foo-bar");
});
