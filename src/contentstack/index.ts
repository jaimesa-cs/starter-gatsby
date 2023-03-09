import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { Stack } from "contentstack";
import { CsStackOptions, useCsStack } from "./CSConfig";

export class ContentStack {
	public onEntryChange = ContentstackLivePreview.onEntryChange;
	public unsubscribeOnEntryChange =
		ContentstackLivePreview.unsubscribeOnEntryChange;

	async getUpdatedEntry<T extends Object>(
		stackOptions: CsStackOptions /** The options summoned from the hook passed inward. */,
		contentTypeUid: string /** The unique identifier of the content type. @example 'page_hero' */,
		entryUid: string /** The identifier of the specific entry of this type. */,
		referenceFieldPaths: string[] = [] /** The included sub-reference paths to fetch. */
	): Promise<T | null> {
		try {
			if (!contentTypeUid || !entryUid) {
				console.error(
					"Invalid ContentStack params:\n\tcontentType:",
					contentTypeUid,
					"\n\tcontentUid:",
					entryUid
				);
				return null;
			}

			const query = stackOptions[0].ContentType(contentTypeUid).Entry(entryUid);
			if (referenceFieldPaths.length > 0) {
				query.includeReference(...referenceFieldPaths);
			}

			return query.toJSON().fetch();
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}

export const contentStack = new ContentStack();
