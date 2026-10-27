<script lang="ts">
	import { Message, MessageAvatar, MessageAvatarImage, MessageAvatarFallback, MessageContent, MessageActions, MessageAction, type MessageProps } from "#lib/components/ui/message/index.js";
	import { CopyIcon, RotateCwIcon, ThumbsDownIcon, ThumbsUpIcon } from "@lucide/svelte";

	const { section = "preview" }: Props = $props();
	const variants: MessageProps["variant"][] = ["default", "secondary", "outline", "ghost", "destructive"];
	const sizes: UiSize[] = ["xs", "sm", "md", "lg"];
	const roundedValues: UiRounded[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "pill"];

	/** Live preview for one section of the message docs */
	interface Props {
		/** Which group of examples to render */
		section?: "preview" | "from" | "variants" | "sizes" | "rounded" | "overrides";
	}
</script>

<div class="demo">
	{#if section === "preview"}
		<!-- A user question, then the assistant reply with its actions. -->
		<Message from="user">
			<MessageContent>What are Svelte 5 runes?</MessageContent>
		</Message>
		<Message>
			<MessageAvatar>
				<MessageAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<MessageAvatarFallback>CN</MessageAvatarFallback>
			</MessageAvatar>
			<MessageContent>Runes are symbols such as $state, $derived, and $effect that tell the Svelte compiler how to handle reactive state.</MessageContent>
			<MessageActions>
				<MessageAction size="icon-sm" aria-label="Copy"><CopyIcon /></MessageAction>
				<MessageAction size="icon-sm" aria-label="Good response"><ThumbsUpIcon /></MessageAction>
				<MessageAction size="icon-sm" aria-label="Bad response"><ThumbsDownIcon /></MessageAction>
				<MessageAction>
					<RotateCwIcon />
					Regenerate
				</MessageAction>
			</MessageActions>
		</Message>
	{:else if section === "from"}
		<!-- The same message from each sender, with avatars. -->
		<Message from="user">
			<MessageAvatar>
				<MessageAvatarFallback>AT</MessageAvatarFallback>
			</MessageAvatar>
			<MessageContent>Can you help me name a component?</MessageContent>
		</Message>
		<Message from="assistant">
			<MessageAvatar>
				<MessageAvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<MessageAvatarFallback>CN</MessageAvatarFallback>
			</MessageAvatar>
			<MessageContent>Sure. What does it do?</MessageContent>
		</Message>
	{:else if section === "variants"}
		<!-- One message per bubble style. -->
		{#each variants as variant (variant)}
			<Message {variant}>
				<MessageAvatar>
					<MessageAvatarFallback>CN</MessageAvatarFallback>
				</MessageAvatar>
				<MessageContent>This message uses the {variant} variant.</MessageContent>
			</Message>
		{/each}
	{:else if section === "sizes"}
		<!-- One message per size; the avatar and actions shrink with it. -->
		{#each sizes as size (size)}
			<Message from="user" {size}>
				<MessageAvatar>
					<MessageAvatarFallback>AT</MessageAvatarFallback>
				</MessageAvatar>
				<MessageContent>This message is size {size}.</MessageContent>
				<MessageActions>
					<MessageAction>
						<CopyIcon />
						Copy
					</MessageAction>
				</MessageActions>
			</Message>
		{/each}
	{:else if section === "rounded"}
		<!-- Each rounded value on a user bubble. -->
		{#each roundedValues as rounded (rounded)}
			<Message from="user" {rounded}>
				<MessageContent>This bubble is rounded {rounded}.</MessageContent>
			</Message>
		{/each}
		<!-- A long message keeps round corners instead of becoming an oval. -->
		<Message from="user" rounded="pill">
			<MessageContent>A longer message wraps onto several lines, so the pill radius keeps round corners here instead of stretching into an oval, and none of the text is clipped.</MessageContent>
		</Message>
	{:else if section === "overrides"}
		<!-- Content that sets its own variant, size, and radius. -->
		<Message from="user">
			<MessageContent variant="outline" size="sm" rounded="sm">A smaller outlined bubble in a medium message.</MessageContent>
		</Message>
		<!-- A larger bubble keeps the pill for its own size. -->
		<Message from="user">
			<MessageContent size="lg">A large pill in a medium message.</MessageContent>
		</Message>
	{/if}
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
