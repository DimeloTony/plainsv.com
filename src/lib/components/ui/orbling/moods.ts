/** What the assistant is doing, shown by the orb's face and motion */
export type Mood = "idle" | "thinking" | "reading" | "typing" | "working" | "asking" | "waiting" | "watching" | "surprised" | "sleepy" | "error";

/** One animation the orb plays; each mood loops through one or more acts */
export type Act = "idle" | "spin" | "ponder" | "read" | "dots" | "gear" | "wonder" | "stamp" | "down" | "watch" | "surprise" | "sleep" | "shake";

/** Status label and act loop of one mood */
interface MoodSpec {
	/** Text shown by `OrblingStatus` */
	label: string;
	/** Acts played in order, then repeated */
	loop: Act[];
	/** Act played once before the loop starts */
	intro?: Act;
}

/** Every mood with its label and acts */
export const MOODS: Record<Mood, MoodSpec> = {
	idle: { label: "Idle", loop: ["idle"] },
	thinking: { label: "Thinking…", intro: "spin", loop: ["ponder"] },
	reading: { label: "Reading…", loop: ["read"] },
	typing: { label: "Typing…", loop: ["dots"] },
	working: { label: "Working…", loop: ["gear"] },
	asking: { label: "Asking…", loop: ["wonder", "stamp"] },
	waiting: { label: "Waiting…", loop: ["down"] },
	watching: { label: "Watching", loop: ["watch"] },
	surprised: { label: "Surprised", loop: ["surprise"] },
	sleepy: { label: "Sleepy", loop: ["sleep"] },
	error: { label: "Error", loop: ["shake"] },
};

/** Mood names in display order */
export const MOOD_NAMES: Mood[] = ["idle", "thinking", "reading", "typing", "working", "asking", "waiting", "watching", "surprised", "sleepy", "error"];

/** Returns the act a mood plays at a given step, counting its intro as step 0. */
export function actAt(mood: Mood, step: number) {
	const { intro, loop } = MOODS[mood];
	// If the mood has an intro and nothing has played yet: start with the intro.
	if (intro && step === 0) return intro;
	return loop[(intro ? step - 1 : step) % loop.length];
}
