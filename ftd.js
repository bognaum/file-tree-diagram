import BuildOptions from "./BuildOptions.js";
import assemblyTree from "./draw-data-tree.js";
import JsonErrHl    from "./json-err-hl/json-err-hl.js";
import setStyle     from "./set-style.js";
import iconManager  from "./icon-manager.js";

const version = "2.0.0";

export default class FileTree {
	constructor (classPrefix = "file-tree-diagram") {
		this.classPrefix = classPrefix;
		setStyle(classPrefix);
	}

	build (elem, templ) {

		if (! (elem instanceof HTMLElement))
			throw new Error([
				"(!) build(). Argument #1 must be a HTMLElement.",
				"",
				elem + " given.",
				""
			].join("\n"));

		if (["executing", "executed", "exec-error"].some((v) => elem.classList.contains(v)))
			throw new Error([
				"(!) File tree diagram. Already handled.", 
				"",
				elem
			].join("\n"));
		
		elem.dataset.fileTreeDiagramVersion = version;
		elem.classList.add(this.classPrefix);
		elem.classList.add("executing");
		elem.innerHTML = "";

		if (typeof templ != "string")
			throw new Error([
				"(!) build(). Argument #2 must be a string.",
				"",
				templ + " given.",
				""
			].join("\n"));

		const {object :ob, error :jsonError} = this.tryParseJSON(templ);
		if (ob) {
			elem.innerHTML = assemblyTree(
				ob, 
				new BuildOptions(this.classPrefix)
			).result;
			elem.classList.remove("executing", "executed", "exec-error");
			elem.classList.add("executed");
		} else if (jsonError) {
			const jsonHl = new JsonErrHl(`${ this.classPrefix }-json-err-hl`);
			elem.innerHTML = "";
			const 
				firstLN = getFirstLineNum(elem),
				errorCodeField = jsonHl.getHighlighted(templ, firstLN);
			elem.appendChild(errorCodeField);
			jsonHl.scrollToFirstError(errorCodeField);
			elem.classList.remove("executing", "executed", "exec-error");
			elem.classList.add("exec-error");
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

function getFirstLineNum(el) {
	const dln = parseInt(el.dataset.lineNum);
	if (! dln)
		return 1;
	else if (el.nodeName == "PRE")
		return dln + 1;
	else 
		return dln;
}
