import { setContext, getContext } from "svelte";
import { toast } from "#lib/components/ui/toaster/index.js";
import type { Props, PromptInputData } from "./index.js";

const CONTEXT_ID = "prompt-input-context";
/** Image types the file picker and the drop zone accept by default */
export const PROMPT_INPUT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

class UseCompCtx {
	/** Prompt text */
	text = $state("");
	/** Attached files */
	files: File[] = $state([]);
	/** Whether the prompt is being sent */
	sending = $state(false);
	/** Extra condition for sending */
	canSubmit = $state(true);
	/** Characters the trimmed text needs before it can be sent */
	minLength = $state(1);
	/** Most files that can be attached */
	maxFiles = $state(5);
	/** File types the picker and drop zone accept */
	accept: string[] = $state(PROMPT_INPUT_IMAGE_TYPES);
	/** localStorage key for the draft, or empty when drafts are off */
	draftKey = $state("");
	/** Size shared by the parts */
	size: UiSize = $state("md");
	/** Corner radius of the box, shared by the parts */
	rounded: UiRounded = $state("3xl");
	/** Whether files are being dragged over the box */
	isDragging = $state(false);
	/** Hidden file input, opened by the files button */
	fileInputEl?: HTMLInputElement = $state();
	/** Called with the prompt when it is sent */
	onSubmit?: Props["onSubmit"];
	/** Called for a refused file */
	onFileReject?: Props["onFileReject"];
	/** Size of the buttons and select, one step smaller than the box so they sit inside its padding */
	controlSize = $derived(({ xs: "xs", sm: "xs", md: "sm", lg: "md" } as const)[this.size]);
	/** Radius of the buttons and select, one step below the box; at `2xl` and up they read as pills, and pills stay pills */
	controlRounded = $derived(({ xs: "xs", sm: "sm", md: "sm", lg: "md", xl: "lg", "2xl": "xl", "3xl": "2xl", "4xl": "3xl", pill: "pill" } as const)[this.rounded]);
	/** Whether the prompt can be sent now */
	isReady = $derived(!this.sending && this.canSubmit && this.text.trim().length >= this.minLength);
	/** Attached files with their id and preview, for the image chips */
	promptFiles = $derived(this.files.map((file) => ({ file, id: this.getFileId(file), title: file.name, preview: this.getPreview(file) })));
	/** Stable id of each file, kept across renames */
	fileIds = new Map<File, string>();
	/** Object URL of each file's preview, released when the file is removed */
	previews = new Map<File, string>();

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance (we do not use `Object.assign(this, props)` to ensure only setting props that exists)
		for (const [key, data] of Object.entries(props)) {
			// @ts-ignore
			if (this[key] !== undefined) this[key] = data;
		}
	}

	/** Returns the file's id, built from its original name, size, and modified time. */
	getFileId(file: File) {
		return this.fileIds.get(file) ?? `${file.name}-${file.size}-${file.lastModified}`;
	}

	/** Returns the file's preview URL, creating it the first time. */
	getPreview(file: File) {
		// If this runs on the server: there is no URL to create.
		if (typeof URL.createObjectURL !== "function") return "";
		let preview = this.previews.get(file);
		if (!preview) this.previews.set(file, (preview = URL.createObjectURL(file)));
		return preview;
	}

	/** Releases the previews of files that are no longer attached. */
	releasePreviews() {
		for (const [file, preview] of this.previews) {
			if (this.files.includes(file)) continue;
			URL.revokeObjectURL(preview);
			this.previews.delete(file);
			this.fileIds.delete(file);
		}
	}

	/** Sends the prompt to `onSubmit`; it clears once that resolves, and stays when it throws so it can be sent again. */
	async submit(event: SubmitEvent) {
		const data: PromptInputData = { text: this.text, files: this.files, event };
		this.sending = true;
		try {
			await this.onSubmit?.(data);
			this.clear();
		} finally {
			this.sending = false;
		}
	}

	/** Copies the attached files into the hidden file input, so a native form submit posts them. */
	syncFileInput() {
		// If the files part is not mounted or this runs on the server: there is no input to fill.
		if (!this.fileInputEl || typeof DataTransfer === "undefined") return;
		const dataTransfer = new DataTransfer();
		for (const file of this.files) dataTransfer.items.add(file);
		this.fileInputEl.files = dataTransfer.files;
	}

	/** Attaches dropped or picked files, refusing unsupported types, files over the limit, and duplicates. */
	addFiles(files: Iterable<File>) {
		const nextFiles = [...this.files];
		for (const file of files) {
			// If the file type is not accepted: refuse it.
			if (!this.accept.includes(file.type)) {
				this.rejectFile(file, "type");
				continue;
			}
			// If the prompt already has the most files: refuse it and the rest.
			if (nextFiles.length >= this.maxFiles) {
				this.rejectFile(file, "limit");
				break;
			}
			// If the same file is already attached: skip it.
			const id = this.getFileId(file);
			if (nextFiles.some((nextFile) => this.getFileId(nextFile) === id)) continue;
			nextFiles.push(file);
		}
		this.files = nextFiles;
	}

	/** Reports a refused file to the callback, or in a toast when there is none. */
	rejectFile(file: File, reason: "type" | "limit") {
		if (this.onFileReject) return this.onFileReject(file, reason);
		toast.error(reason === "type" ? `The file type of "${file.name}" is not allowed` : `You can add up to ${this.maxFiles} files`);
	}

	/** Detaches a file. */
	removeFile(id: string) {
		this.files = this.files.filter((file) => this.getFileId(file) !== id);
	}

	/** Renames a file, so the sent file uses the new name; it keeps its id and preview. */
	renameFile(id: string, newTitle: string) {
		const file = this.files.find((other) => this.getFileId(other) === id);
		// If the file is gone or the name is empty: keep the current name.
		if (!file || !newTitle) return;
		const renamedFile = new File([file], newTitle, { type: file.type, lastModified: file.lastModified });
		this.fileIds.set(renamedFile, id);
		this.previews.set(renamedFile, this.getPreview(file));
		// Drop the old entries without releasing the preview the renamed file now uses.
		this.previews.delete(file);
		this.fileIds.delete(file);
		this.files = this.files.map((other) => (other === file ? renamedFile : other));
	}

	/** Saves the text as a draft, or removes the draft when the text is empty. */
	saveDraft() {
		// If drafts are off: there is nothing to save.
		if (!this.draftKey) return;
		const text = this.text.trim();
		if (text) localStorage.setItem(this.draftKey, text);
		else localStorage.removeItem(this.draftKey);
	}

	/** Clears the text, files, and draft. */
	clear() {
		this.text = "";
		this.files = [];
		if (this.draftKey) localStorage.removeItem(this.draftKey);
	}
}

export type CompCtxProps = Pick<InstanceType<typeof UseCompCtx>, "text" | "files" | "sending" | "canSubmit" | "minLength" | "maxFiles" | "accept" | "draftKey" | "size" | "rounded" | "onSubmit" | "onFileReject">;

export const setCompCtx = (props: CompCtxProps) => setContext(CONTEXT_ID, new UseCompCtx(props));

export const useCompCtx = () => getContext<ReturnType<typeof setCompCtx>>(CONTEXT_ID);
