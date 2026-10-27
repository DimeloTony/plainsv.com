/** One section of a proposal document, as listed in the table */
export interface Section {
	/** Stable id, also used to keep a row's place while dragging */
	id: number;
	/** Section title */
	header: string;
	/** Kind of section, such as "Narrative" */
	type: string;
	/** Progress, such as "Done" or "In Process" */
	status: string;
	/** Target page count */
	target: string;
	/** Page limit */
	limit: string;
	/** Assigned reviewer, or "Assign reviewer" when nobody is assigned */
	reviewer: string;
}
