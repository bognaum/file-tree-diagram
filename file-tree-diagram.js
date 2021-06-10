import BuildOptions from "./BuildOptions.js";
import assemblyTree from "./draw-data-tree.js";
import JsonErrHl    from "./json-err-hl/json-err-hl.js";
import setStyle     from "./set-style.js";
import iconManager  from "./icon-manager.js";

export default class FileTree {
	constructor (classPrefix = "file-tree-diagram") {
		this.classPrefix = classPrefix;
		setStyle(classPrefix);
	}

	build (elem, templ) {
		const {object :ob, error :jsonError} = this.tryParseJSON(templ);
		if (ob) {
			elem.innerHTML = assemblyTree(
				ob, 
				new BuildOptions(this.classPrefix)
			).result;
			// console.log(`ob`, ob);
		} else if (jsonError) {
			const jsonHl = new JsonErrHl(`${ this.classPrefix }-json-err-hl`);
			elem.classList.add(`${ this.classPrefix }-json-err-hl`, "calm-clarified-theme");
			jsonHl.highlightTextContent(elem);
			jsonHl.scrollToFirstError(elem);
			console.error(`(!)`, jsonError);
		} else {
			throw new Error();
		}
	}

	tryParseJSON (json) {
		try {
			return {
				object: JSON.parse(json)
			};
		} catch (err) {
			return {
				text: json,
				error: err,
			}
		}
	}

	static testHTML = iconManager.testHTML
}
