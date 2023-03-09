import * as Utils from "@contentstack/utils"
import * as contentstack from "contentstack"

import ContentstackLivePreview from "@contentstack/live-preview-utils"

export const Stack = contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY || "",
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || "",
  environment: process.env.CONTENTSTACK_ENVIRONMENT || "",
  live_preview: {
    management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "",
    enable: true,
    host: process.env.CONTENTSTACK_API_HOST || "",
  },
  //@ts-ignore
  stackDetails: {
    apiKey: process.env.CONTENTSTACK_API_KEY || "",
    environment: process.env.CONTENTSTACK_ENVIRONMENT || "",
  },
})

if (process.env.CONTENTSTACK_API_HOST) {
  Stack.setHost(process.env.CONTENTSTACK_API_HOST)
}

ContentstackLivePreview.init({
  enable: process.env.CONTENTSTACK_LIVE_PREVIEW === "true",
  //@ts-ignore
  stackSdk: Stack,
  clientUrlParams: {
    host: process.env.CONTENTSTACK_APP_HOST,
  },
  ssr: false,
})

export const onEntryChange = ContentstackLivePreview.onEntryChange
export const unsubscribe = ContentstackLivePreview.unsubscribeOnEntryChange

const renderOption = {
  ["span"]: (node: any, next: any) => {
    return next(node.children)
  },
}

const api = {
  /**
   *
   * fetches all the entries from specific content-type
   * @param {* content-type uid} contentTypeUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   *
   */
  getEntry({ contentTypeUid, referenceFieldPath, jsonRtePath }: any) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query()
      if (referenceFieldPath) query.includeReference(referenceFieldPath)
      query
        .includeOwner()
        .toJSON()
        .find()
        .then(
          result => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              })
            resolve(result)
          },
          error => {
            reject(error)
          }
        )
    })
  },

  /**
   *fetches specific entry from a content-type
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* url for entry to be fetched} entryUrl
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUrl({
    contentTypeUid,
    entryUrl,
    referenceFieldPath,
    jsonRtePath,
  }: any) {
    return new Promise((resolve, reject) => {
      const blogQuery = Stack.ContentType(contentTypeUid).Query()
      if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath)
      blogQuery.includeOwner().toJSON()
      const data = blogQuery.where("url", `${entryUrl}`).find()
      data.then(
        result => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            })
          resolve(result[0])
        },
        error => {
          reject(error)
        }
      )
    })
  },
}

export default api
