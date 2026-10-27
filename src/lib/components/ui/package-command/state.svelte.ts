/** Active tab for each `storageKey`, shared so blocks on one page switch together; only written in the browser */
export const syncedValues: Record<string, string> = $state({});
