import BuildOptions from "./BuildOptions.js";
import assemblyTree from "./draw-data-tree.js";
import JsonErrHl    from "./json-err-hl/json-err-hl.js";
import setStyle     from "./set-style.js";
import iconManager  from "./icon-manager.js";

const version = "0.0.0";

export default class FileTree {
	constructor (classPrefix = "file-tree-diagram") {
		this.classPrefix = classPrefix;
		setStyle(classPrefix);
	}

	build (elem, templ) {
		elem.dataset.version = version;
		elem.classList.add(this.classPrefix);

		if (["executing", "executed", "exec-error"].some((v) => elem.classList.contains(v)))
			throw new Error("(!) Highlighter. Already handled.", elem);
		// elem.classList.add("executing");

		const {object :ob, error :jsonError} = this.tryParseJSON(templ);
		if (ob) {
			elem.innerHTML = assemblyTree(
				ob, 
				new BuildOptions(this.classPrefix)
			).result;
			// elem.classList.remove("executing", "executed", "exec-error");
			// elem.classList.add("executed");
		} else if (jsonError) {
			const jsonHl = new JsonErrHl(`${ this.classPrefix }-json-err-hl`);
			elem.classList.add(`${ this.classPrefix }-json-err-hl`, "calm-clarified-theme");
			jsonHl.highlightTextContent(elem);
			jsonHl.scrollToFirstError(elem);
			// elem.classList.remove("executing", "executed", "exec-error");
			// elem.classList.add("exec-error");
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

	testHTML () {
		return iconManager.testHTML(this.classPrefix);
	}
}
