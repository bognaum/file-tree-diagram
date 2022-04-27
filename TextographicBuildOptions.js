export default class TextographicBuildOptions {
	constructor () {
		this.result = "";
		this.chProp = "ch";
	}
	addHeader (m) {
		this.result += `${ m.ch ? "(/)" : "━#━" } ${ m.name }`;
		if (m.comment) {
			const commentAlignLiner = "─".repeat((m.aLongestName - m.name.length) || 0);
			this.result += ` ${commentAlignLiner}─ ${m.comment}`;
		}
	}
	addBranchEl (type) {
		this.result += 
			type == "v" ? " ┃ " :
			type == "f" ? " ┣━" :
			type == "c" ? " ┗━" :
			type == "e" ? "   " :
				"ERR";
	}
	endOfRow (m) {this.result += "\n";}
}