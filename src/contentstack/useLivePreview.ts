import { contentStack } from ".";
import React from "react";
import { useCsStack } from "./CSConfig";

export interface LivePreviewState<T extends Object> {
	model: T | null;
	isLivePreview: boolean;
}

export function useLivePreview<T extends Object>(
	staticModel: T | undefined | null,
	contentType = "accolade_list",
	entryUid = "blt06dfccc71da18cfd"
): LivePreviewState<T> {
	const stackOptions = useCsStack();
	const initialState = { model: staticModel ?? null, isLivePreview: false };
	const [cached, setCache] = React.useState(initialState);

	React.useEffect(() => {
		const callbackId = contentStack.onEntryChange(async () => {
			if (!staticModel) {
				return;
			}

			let updated = await contentStack.getUpdatedEntry<T>(
				stackOptions,
				contentType,
				entryUid
			);

			console.log("LivePreview > Updated:", updated);

			if (!updated) {
				throw new Error("Failed to get anything back");
			}

			setCache({ isLivePreview: true, model: updated });
		});

		// Unsubscribe on unmounting.
		return () => contentStack.unsubscribeOnEntryChange(callbackId);
	}, [contentType, entryUid]);

	return cached;
}
