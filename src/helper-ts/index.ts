import * as Utils from "@contentstack/utils"

import Stack from "../live-preview-sdk-ts"

const liveEdit = process.env.CONTENTSTACK_LIVE_EDIT_TAGS === "true"

export const jsonToHtmlParse = (entry: any) => {
  const renderOption = {
    ["span"]: (node: any, next: any) => next(node.children),
  }

  return Utils.jsonToHTML({
    entry,
    paths: [
      "body",
      "copyright",
      "related_post.body",
      "notification_bar.announcement_text",
      "page_components.from_blog.featured_blogs.body",
      "page_components.section_with_buckets.buckets.description",
      "page_components.section_with_html_code.description",
    ],
    renderOption,
  })
}

export const getHeaderRes = async () => {
  const response: any = await Stack.getEntry({
    contentTypeUid: "header",
    referenceFieldPath: ["navigation_menu.page_reference"],
    jsonRtePath: ["notification_bar.announcement_text"],
  })

  liveEdit && Utils.addEditableTags(response[0][0], "header", true)
  return response[0][0]
}

export const getFooterRes = async () => {
  const response: any = await Stack.getEntry({
    contentTypeUid: "footer",
    referenceFieldPath: undefined,
    jsonRtePath: ["copyright"],
  })
  liveEdit && Utils.addEditableTags(response[0][0], "footer", true)
  return response[0][0]
}

export const getAllEntries = async () => {
  const response: any = await Stack.getEntry({
    contentTypeUid: "page",
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  })
  liveEdit &&
    response[0].forEach((entry: any) =>
      Utils.addEditableTags(entry, "page", true)
    )
  return response[0]
}

export const getPageRes = async (entryUrl: string) => {
  const response: any = await Stack.getEntryByUrl({
    contentTypeUid: "page",
    entryUrl,
    referenceFieldPath: ["page_components.from_blog.featured_blogs"],
    jsonRtePath: [
      "page_components.from_blog.featured_blogs.body",
      "page_components.section_with_buckets.buckets.description",
      "page_components.section_with_html_code.description",
    ],
  })
  liveEdit && Utils.addEditableTags(response[0], "page", true)
  return response[0]
}

export const getPageByUrl = async (
  contentTypeUid: string,
  entryUrl: string,
  referenceFieldPath?: [],
  jsonRtePath?: []
) => {
  const response: any = await Stack.getEntryByUrl({
    contentTypeUid: contentTypeUid,
    entryUrl,
    referenceFieldPath,
    jsonRtePath,
  })
  liveEdit && Utils.addEditableTags(response[0], "dummy", true)
  return response
}

export const getBlogListRes = async () => {
  const response: any = await Stack.getEntry({
    contentTypeUid: "blog_post",
    referenceFieldPath: ["author", "related_post"],
    jsonRtePath: ["body"],
  })
  liveEdit &&
    response[0].forEach((entry: any) =>
      Utils.addEditableTags(entry, "blog_post", true)
    )
  return response[0]
}

export const getBlogPostRes = async (entryUrl: string) => {
  const response: any = await Stack.getEntryByUrl({
    contentTypeUid: "blog_post",
    entryUrl,
    referenceFieldPath: ["author", "related_post"],
    jsonRtePath: ["body", "related_post.body"],
  })
  liveEdit && Utils.addEditableTags(response[0], "blog_post", true)
  return response[0]
}
