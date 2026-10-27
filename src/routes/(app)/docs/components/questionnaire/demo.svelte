<script lang="ts">
	import { Questionnaire, QuestionnaireProgress, QuestionnaireItem, QuestionnaireTitle, QuestionnaireDescription, QuestionnaireChoices, QuestionnaireChoice, QuestionnaireChoiceDescription, QuestionnaireInput, QuestionnaireError, QuestionnaireActions, QuestionnairePrevious, QuestionnaireSkip, QuestionnaireNext, QuestionnaireSubmit } from "#lib/components/ui/questionnaire/index.js";
	import { Card, CardContent, CardFooter, CardHeader } from "#lib/components/ui/card/index.js";
	import { Switch } from "#lib/components/ui/switch/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { toast } from "#lib/components/ui/toaster/index.js";

	const { section = "preview" }: Props = $props();
	const sizes = ["sm", "md", "lg"] as const;
	const roundedValues = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"] as const;
	let activeItem = $state("role");
	let hasTeam = $state(true);
	let username = $state("");

	/** Shows the submitted answers in a toast instead of sending them. */
	const handleSubmit = (e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const answers = [...new Set(data.keys())].map((key) => `${key}: ${data.getAll(key).join(", ")}`);
		toast.success("Answers submitted", { description: answers.join(" · ") || "Every question was skipped." });
	};

	/** Live preview for one section of the questionnaire docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "card" | "controlled" | "conditional" | "validation" | "sizes" | "rounded";
	}
</script>

<!-- Previous, Skip, Next, and Submit, reused by every example. -->
{#snippet navigation()}
	<QuestionnaireActions>
		<QuestionnairePrevious />
		<QuestionnaireSkip />
		<QuestionnaireNext />
		<QuestionnaireSubmit />
	</QuestionnaireActions>
{/snippet}

<!-- The three questions of the main example. -->
{#snippet questions()}
	<QuestionnaireItem name="direction" required>
		<QuestionnaireTitle>What should we prototype next?</QuestionnaireTitle>
		<QuestionnaireDescription>Choose one direction or write another answer.</QuestionnaireDescription>
		<QuestionnaireChoices>
			<QuestionnaireChoice value="delegation">
				<strong>Sub-agent delegation</strong>
				<QuestionnaireChoiceDescription>Show when work is delegated and what comes back.</QuestionnaireChoiceDescription>
			</QuestionnaireChoice>
			<QuestionnaireChoice value="questions">
				<strong>Question prompts</strong>
				<QuestionnaireChoiceDescription>Show choices while the agent waits for input.</QuestionnaireChoiceDescription>
			</QuestionnaireChoice>
			<QuestionnaireChoice value="both">
				<strong>Both together</strong>
				<QuestionnaireChoiceDescription>Explore one unified interaction pattern.</QuestionnaireChoiceDescription>
			</QuestionnaireChoice>
			<QuestionnaireInput aria-label="Another direction" placeholder="Type another direction…" />
		</QuestionnaireChoices>
		<QuestionnaireError />
	</QuestionnaireItem>
	<QuestionnaireItem name="signals" multiple>
		<QuestionnaireTitle>What should every progress update include?</QuestionnaireTitle>
		<QuestionnaireDescription>Select all that apply, or skip this question.</QuestionnaireDescription>
		<QuestionnaireChoices>
			<QuestionnaireChoice value="progress">Progress</QuestionnaireChoice>
			<QuestionnaireChoice value="decisions">Decisions</QuestionnaireChoice>
			<QuestionnaireChoice value="risks">Risks</QuestionnaireChoice>
		</QuestionnaireChoices>
		<QuestionnaireError />
	</QuestionnaireItem>
	<QuestionnaireItem name="timing" required>
		<QuestionnaireTitle>When should this be revisited?</QuestionnaireTitle>
		<QuestionnaireChoices>
			<QuestionnaireChoice value="week">This week</QuestionnaireChoice>
			<QuestionnaireChoice value="cycle">Next cycle</QuestionnaireChoice>
			<QuestionnaireChoice value="later">Revisit later</QuestionnaireChoice>
		</QuestionnaireChoices>
		<QuestionnaireError />
	</QuestionnaireItem>
{/snippet}

<div class="demo">
	{#if section === "preview"}
		<!-- Three questions with letter shortcuts, a freeform answer, and an optional question. -->
		<Questionnaire class="demoFrame" shortcuts="letters" onsubmit={handleSubmit}>
			<QuestionnaireProgress />
			{@render questions()}
			{@render navigation()}
		</Questionnaire>
	{:else if section === "card"}
		<!-- One question laid out in a card. -->
		<Card class="demoFrame">
			<Questionnaire shortcuts="numbers" onsubmit={handleSubmit}>
				<!-- The title is not the fieldset's first child here, so it names the question by id. -->
				<QuestionnaireItem name="plan" required aria-labelledby="demo-plan-title">
					<CardHeader>
						<QuestionnaireTitle id="demo-plan-title">Choose a plan</QuestionnaireTitle>
						<QuestionnaireDescription>Enterprise is not available on your account.</QuestionnaireDescription>
					</CardHeader>
					<CardContent>
						<QuestionnaireChoices>
							<QuestionnaireChoice value="plus">
								<strong>Plus</strong>
								<QuestionnaireChoiceDescription>For individuals and small teams</QuestionnaireChoiceDescription>
							</QuestionnaireChoice>
							<QuestionnaireChoice value="pro">
								<strong>Pro</strong>
								<QuestionnaireChoiceDescription>For growing businesses</QuestionnaireChoiceDescription>
							</QuestionnaireChoice>
							<QuestionnaireChoice value="enterprise" disabled>
								<strong>Enterprise</strong>
								<QuestionnaireChoiceDescription>For large teams and enterprises</QuestionnaireChoiceDescription>
							</QuestionnaireChoice>
						</QuestionnaireChoices>
						<QuestionnaireError />
					</CardContent>
				</QuestionnaireItem>
				<CardFooter>{@render navigation()}</CardFooter>
			</Questionnaire>
		</Card>
	{:else if section === "controlled"}
		<!-- Active question bound to buttons outside the form. -->
		<div class="demoTabs">
			{#each ["role", "experience", "goal"] as name (name)}
				<button type="button" class="demoTab" aria-current={activeItem === name || undefined} onclick={() => (activeItem = name)}>{name}</button>
			{/each}
		</div>
		<Questionnaire class="demoFrame" bind:item={activeItem} onsubmit={handleSubmit}>
			<QuestionnaireItem name="role">
				<QuestionnaireTitle>What is your role?</QuestionnaireTitle>
				<QuestionnaireChoices>
					<QuestionnaireChoice value="design">Design</QuestionnaireChoice>
					<QuestionnaireChoice value="engineering">Engineering</QuestionnaireChoice>
				</QuestionnaireChoices>
				<QuestionnaireError />
			</QuestionnaireItem>
			<QuestionnaireItem name="experience">
				<QuestionnaireTitle>How long have you used Svelte?</QuestionnaireTitle>
				<QuestionnaireChoices>
					<QuestionnaireChoice value="new">Just starting</QuestionnaireChoice>
					<QuestionnaireChoice value="years">Years</QuestionnaireChoice>
				</QuestionnaireChoices>
				<QuestionnaireError />
			</QuestionnaireItem>
			<QuestionnaireItem name="goal">
				<QuestionnaireTitle>What are you building?</QuestionnaireTitle>
				<QuestionnaireChoices>
					<QuestionnaireInput aria-label="What you are building" placeholder="A dashboard, a chat app…" />
				</QuestionnaireChoices>
				<QuestionnaireError />
			</QuestionnaireItem>
			{@render navigation()}
		</Questionnaire>
	{:else if section === "conditional"}
		<!-- A disabled question leaves the progress, navigation, and submission. -->
		<div class="demoOption">
			<Switch id="demo-has-team" bind:checked={hasTeam} />
			<Label for="demo-has-team">Ask about the team</Label>
		</div>
		<Questionnaire class="demoFrame" onsubmit={handleSubmit}>
			<QuestionnaireProgress />
			<QuestionnaireItem name="workspace" required>
				<QuestionnaireTitle>Who is the workspace for?</QuestionnaireTitle>
				<QuestionnaireChoices>
					<QuestionnaireChoice value="me">Just me</QuestionnaireChoice>
					<QuestionnaireChoice value="team">My team</QuestionnaireChoice>
				</QuestionnaireChoices>
				<QuestionnaireError />
			</QuestionnaireItem>
			<QuestionnaireItem name="size" required disabled={!hasTeam}>
				<QuestionnaireTitle>How big is the team?</QuestionnaireTitle>
				<QuestionnaireChoices>
					<QuestionnaireChoice value="small">2 to 10</QuestionnaireChoice>
					<QuestionnaireChoice value="large">More than 10</QuestionnaireChoice>
				</QuestionnaireChoices>
				<QuestionnaireError />
			</QuestionnaireItem>
			<QuestionnaireItem name="start" required>
				<QuestionnaireTitle>When do you want to start?</QuestionnaireTitle>
				<QuestionnaireChoices>
					<QuestionnaireChoice value="now">Today</QuestionnaireChoice>
					<QuestionnaireChoice value="later">Later this month</QuestionnaireChoice>
				</QuestionnaireChoices>
				<QuestionnaireError />
			</QuestionnaireItem>
			{@render navigation()}
		</Questionnaire>
	{:else if section === "validation"}
		<!-- Custom rule on a freeform answer, shown in the error message. -->
		<Questionnaire class="demoFrame" onsubmit={handleSubmit}>
			<QuestionnaireItem name="username" required invalid={username.length > 0 && username.length < 3}>
				<QuestionnaireTitle>Pick a username</QuestionnaireTitle>
				<QuestionnaireDescription>At least 3 characters.</QuestionnaireDescription>
				<QuestionnaireInput aria-label="Username" placeholder="ada" bind:value={username} />
				<QuestionnaireError>
					{username.length > 0 && username.length < 3 ? "Use at least 3 characters." : "Enter a username to continue."}
				</QuestionnaireError>
			</QuestionnaireItem>
			{@render navigation()}
		</Questionnaire>
	{:else if section === "sizes"}
		<!-- One question per size. -->
		{#each sizes as size (size)}
			<Questionnaire class="demoFrame" {size} onsubmit={handleSubmit}>
				<QuestionnaireItem name="size-{size}" required>
					<QuestionnaireTitle>Size {size}</QuestionnaireTitle>
					<QuestionnaireChoices>
						<QuestionnaireChoice value="yes">Looks good</QuestionnaireChoice>
						<QuestionnaireChoice value="no">Needs work</QuestionnaireChoice>
					</QuestionnaireChoices>
					<QuestionnaireError />
				</QuestionnaireItem>
				{@render navigation()}
			</Questionnaire>
		{/each}
	{:else if section === "rounded"}
		<!-- One question per rounded value; pill is a true pill, so 3xl and 4xl are the round options that keep choices unclipped. -->
		{#each roundedValues as rounded (rounded)}
			<Questionnaire class="demoFrame" {rounded} onsubmit={handleSubmit}>
				<QuestionnaireItem name="rounded-{rounded}" required>
					<QuestionnaireTitle>Rounded {rounded}</QuestionnaireTitle>
					<QuestionnaireChoices>
						<QuestionnaireChoice value="yes">
							<strong>Looks good</strong>
							<QuestionnaireChoiceDescription>Ship it as it is.</QuestionnaireChoiceDescription>
						</QuestionnaireChoice>
						<QuestionnaireChoice value="no">
							<strong>Needs work</strong>
							<QuestionnaireChoiceDescription>Send it back with notes.</QuestionnaireChoiceDescription>
						</QuestionnaireChoice>
					</QuestionnaireChoices>
					<QuestionnaireError />
				</QuestionnaireItem>
				{@render navigation()}
			</Questionnaire>
		{/each}
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xl);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 2rem 0;
	}

	.demo :global(.demoFrame) {
		width: 100%;
		max-width: 32rem;
	}

	.demoTabs {
		display: flex;
		gap: var(--spacing-xs);
	}

	.demoTab {
		cursor: pointer;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background: none;
		padding: var(--spacing-xs) var(--spacing-sm);
		color: var(--muted-foreground);
		font-size: var(--text-sm);
		text-transform: capitalize;
	}

	.demoTab[aria-current] {
		background-color: var(--muted);
		color: var(--foreground);
	}

	.demoOption {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}
</style>
