<script lang="ts">
	import { z } from "zod";
	import { Form, FormField, FormControl, FormLabel, FormDescription, FormFieldErrors, createForm } from "#lib/components/ui/form/index.js";
	import { FieldGroup } from "#lib/components/ui/field/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Textarea } from "#lib/components/ui/textarea/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Spinner } from "#lib/components/ui/spinner/index.js";
	import { toast } from "#lib/components/ui/toaster/index.js";

	const profileSchema = z.object({
		username: z.string().min(2, "Username must be at least 2 characters.").max(30, "Username must be at most 30 characters."),
		email: z.email("Enter a valid email address."),
		bio: z.string().max(160, "Bio must be at most 160 characters."),
	});
	const form = createForm(profileSchema, {
		initial: { username: "", email: "", bio: "" },
		onSubmit: async (data) => {
			// Stand in for a request to save the profile.
			await new Promise((resolve) => setTimeout(resolve, 800));
			toast.success(`Saved profile for @${data.username}`);
			form.reset();
		},
	});
</script>

<div class="demo">
	<!-- Profile form; errors show once a field is left or the form is submitted. -->
	<Form {form} style="width: 100%; max-width: 24rem">
		<FieldGroup>
			<FormField {form} name="username">
				<FormLabel>Username</FormLabel>
				<FormControl>
					{#snippet children({ props })}
						<Input placeholder="shadcn" bind:value={form.values.username} {...props} />
					{/snippet}
				</FormControl>
				<FormDescription>This is your public display name.</FormDescription>
				<FormFieldErrors />
			</FormField>
			<FormField {form} name="email">
				<FormLabel>Email</FormLabel>
				<FormControl>
					{#snippet children({ props })}
						<Input type="email" placeholder="you@example.com" bind:value={form.values.email} {...props} />
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
			<FormField {form} name="bio">
				<FormLabel>Bio</FormLabel>
				<FormControl>
					{#snippet children({ props })}
						<Textarea placeholder="Tell us a little about yourself" bind:value={form.values.bio} {...props} />
					{/snippet}
				</FormControl>
				<FormDescription>{form.values.bio.length}/160 characters</FormDescription>
				<FormFieldErrors />
			</FormField>
			<Button type="submit" disabled={form.submitting} style="align-self: flex-start">
				{#if form.submitting}<Spinner />{/if}
				Save profile
			</Button>
		</FieldGroup>
	</Form>
</div>

<style>
	.demo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--spacing-sm);
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 1rem 0;
	}
</style>
