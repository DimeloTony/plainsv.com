import fs from "node:fs/promises";
import path from "node:path";

/** Get all `.svx` files inside routes folder */
export async function getAllSvxFiles(directory = `${process.cwd()}/src/routes`, fileList: string[] = []) {
	const files = await fs.readdir(directory);
	for (const file of files) {
		const filePath = path.join(directory, file);
		const stat = await fs.stat(filePath);
		const isAFolder = stat.isDirectory();
		// if it's a directory
		if (isAFolder) await getAllSvxFiles(filePath, fileList);
		// else if if is not return folder only, add file to list
		else if (filePath.endsWith("+page.svx")) fileList.push(filePath);
	}
	return fileList;
}

/** Get frontmatter, script tag, and clean markdown from given file */
export function getFileData(fileData: string) {
	const frontmatter: Record<string, string> = {};
	const frontmatterMatch = fileData.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
	const searchableData = getSearchableData(fileData);
	const scriptMatch = searchableData.match(/<script\b[^>]*>([\s\S]*?)<\/script>/);
	const scriptRawTag = scriptMatch?.[0] ?? "";
	const scriptData = scriptMatch?.[1]?.trim() ?? "";
	const styleMatch = searchableData.match(/<style\b[^>]*>([\s\S]*?)<\/style>/);
	const styleRawTag = styleMatch?.[0] ?? "";
	const styleData = styleMatch?.[1]?.trim() ?? "";

	// Else loop all data as lines
	if (frontmatterMatch) {
		for (const line of frontmatterMatch[0].split("\n").filter(Boolean)) {
			const keyValueMatch = line.match(/^(\w+):\s*(.+)$/);
			// If not a valid key: continue/skip
			if (!keyValueMatch) continue;
			// Else handle key
			const key = keyValueMatch[1].trim().replace(/^['"]|['"]$/g, "");
			const value = keyValueMatch[2].trim().replace(/^['"]|['"]$/g, "");
			frontmatter[key] = value;
		}
	}

	// Get script tag and remove frontmatter tag and script tag from markdown
	const markdown = fileData.replace(frontmatterMatch![0], "").replace(scriptRawTag, "").replace(styleRawTag, "").trim();
	return { frontmatter, scriptData, styleData, markdown };
}

/** Mask standalone Markdown fences while preserving character positions. */
function getSearchableData(fileData: string) {
	// Track the active fence's character (` or ~) and opening length.
	let fence: { marker: string; length: number } | undefined;
	// Process each line, including its newline.
	return fileData.replace(/^.*(?:\r?\n|$)/gm, (line) => {
		// Recognize 3+ backticks or tildes, indented by up to 3 spaces.
		const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*?)(?:\r?\n)?$/);
		// Remember whether this line started inside a fenced block,
		// so the closing fence is masked too.
		const insideFence = Boolean(fence);
		if (match) {
			const [, markers, rest] = match;
			if (!fence) {
				// A backtick fence's trailing text cannot contain backticks.
				if (markers[0] !== "`" || !rest.includes("`")) {
					fence = { marker: markers[0], length: markers.length };
				}
			} else if (
				// Closing fences must use the same character,
				// be at least as long, and have only whitespace after them.
				markers[0] === fence.marker &&
				markers.length >= fence.length &&
				/^[ \t]*$/.test(rest)
			) {
				fence = undefined;
			}
		}
		// Mask the opening fence, its contents, and the closing fence.
		// Preserve newlines and string length so positions stay unchanged.
		return insideFence || fence ? line.replace(/[^\r\n]/g, " ") : line;
	});
}
