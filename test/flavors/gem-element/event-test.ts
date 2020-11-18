import { analyzeTextWithCurrentTsModule } from "../../helpers/analyze-text-with-current-ts-module";
import { tsTest } from "../../helpers/ts-test";

tsTest("GemElement: Discovers events from '@emitter'", t => {
	const {
		results: [result]
	} = analyzeTextWithCurrentTsModule(`
	 @customElement("my-element")
	 class MyElement extends GemElement {
	    @emitter fooBar: Emitter;
	 }
	 `);

	const { events } = result.componentDefinitions[0].declaration!;

	t.is(events.length, 1);
	t.is(events[0].name, "foo-bar");
});
