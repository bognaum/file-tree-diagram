export default {
	getType,
	testHTML,
	get types    () {return types;   },
	get replaces () {return replaces;},
}

function getType(ext) {
	if (types.includes(ext))
		return ext;
	else 
		for (let i in replaces) 
			if (this.replaces[i].includes(ext))
				return i;
	return "default";
}

function testHTML(clPref="file-tree") {
	return types.map((v, i) => {
		return [
				`<div style="display: table-row;">`,
					`<span style="display: table-cell;text-align: right;">${i + 1}.</span>`,
					`<span style="display: table-cell;">`,
						` &nbsp;&nbsp;&nbsp;&nbsp; `,
						`<span `,
							`class="${clPref}-icon `,
								`${clPref}-icon_type-${v} `,
								`${clPref}-icon_style-colored`,
							`"`,
						`>&nbsp;&nbsp;&nbsp;</span>`,
						` &nbsp;&nbsp;&nbsp;&nbsp; `,
					`</span>`,
					`<span style="display: table-cell;">`,
						`<span `,
							`class="${clPref}-icon `,
								`${clPref}-icon_type-${v} `,
								`${clPref}-icon_style-mono`,
							`"`,
						`>&nbsp;&nbsp;&nbsp;</span>`,
						` &nbsp;&nbsp;&nbsp;&nbsp; ${v}`,
					`</span>`,
				`</div>`
			].join("");
			
	}).join("\n");
}

const replaces = {
	git: [
		"git", 
		"gitignore",
		"gitmodules"
	],
	archive: [
		"zip",
		"7z",
		"rar",
		"7zip",
		"tgz",
		"gz",
		"pzip",
		"tar",
		"wim",
	],
	excel: [
		"xls",
		"xlsx",
		"xlsm",
		"xlsb",
		"xlt",
	],
	image: [
		"avif",
		"emf",
		"jp2",
		"pnm",
		"ppm",
		"tga",
		"tif",
		"tiff",
		"webp",
		"xbm",
		"xpm",
	],
	powerpoint: [
		"ppt",
		"pptx",
		"pps",
		"ppsx",
	],
	word: [
		"doc",
		"docx",
		"docm",
		"docxml",
		"dotm",
		"dotx",
		"wri",
	],
	video: [
		"avi",
		"mp4",
		"wmv",
	],
	audio: [
		"mp3",
		"wav",
	]
};

const types = [
	"closed-folder",
	"opened-folder",
	
	"access",
	"actionscript",
	"ae",
	"ai",
	"angular",
	"applescript",
	"archive",
	"arduino",
	"audio",
	"babel",
	"binary",
	"blade",
	"bower",
	"c",
	"cad",
	"cf",
	"circleci",
	"clojure",
	"cmake",
	"coffeescript",
	"composer",
	"cpp",
	"crystal",
	"csharp",
	"css",
	"csv",
	"dart",
	"default",
	"dlang",
	"docker",
	"dotnet",
	"editorconfig",
	"ejs",
	"elm",
	"erlang",
	"eslint",
	"ex",
	"excel",
	"fixedform-fortran",
	"font",
	"git",
	"go",
	"gradle",
	"graphviz",
	"groovy",
	"gruntfile",
	"gulpfile",
	"haml",
	"haskell",
	"haxe",
	"html",
	"image",
	"imageunsupported",
	"indesign",
	"java",
	"js",
	"json",
	"jsp",
	"jsx",
	"julia",
	"kotlin",
	"less",
	"license",
	"liquid",
	"lisp",
	"lock",
	"log",
	"lsl",
	"lua",
	"markdown",
	"markup",
	"matlab",
	"maya",
	"mint",
	"modern-fortran",
	"mustache",
	"nginx",
	"nodejs",
	"note",
	"npm",
	"nsis",
	"ocaml",
	"onenote",
	"pcb",
	"pdf",
	"perl",
	"php",
	"plist",
	"postcss",
	"powerpoint",
	"powershell",
	"preferences",
	"premiere",
	"procfile",
	"psd",
	"pug",
	"puppet",
	"python",
	"r",
	"rails",
	"riot",
	"ruby",
	"rust",
	"sass",
	"scala",
	"scss",
	"settings",
	"shell",
	"sketch",
	"slim",
	"source",
	"sql",
	"stata",
	"stylelint",
	"stylus",
	"sublime",
	"svg",
	"swift",
	"tcl",
	"tern",
	"tex",
	"text",
	"textile",
	"todo",
	"twig",
	"typescript",
	"video",
	"vim",
	"vue",
	"webpack",
	"windows",
	"word",
	"xml",
	"yaml",
	"yarn",
];