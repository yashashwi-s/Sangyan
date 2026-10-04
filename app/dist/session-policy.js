// The former session-only policy is preserved in archive/session-only-policy.js.
// Current policy keeps personal entries in memory with deliberate optional local encrypted recovery.
// Never remove a previous encrypted workspace without the owner choosing removal.
export const personalPersistence = "optional-authenticated-encryption";
