import Contentstack, { Stack } from "contentstack"

import ContentstackLivePreview from "@contentstack/live-preview-utils"
import { useEffect } from "react"

export type CsStackOptions = [Stack, boolean]

export function useCsStack(): CsStackOptions {
  const isLivePreviewEnabled = true

  const stack = new Contentstack.Stack({
    api_key: process.env.CONTENTSTACK_API_KEY || "",
    delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || "",
    environment: "development",
    live_preview: {
      enable: true,
      host: process.env.CONTENTSTACK_API_HOST || "",
      management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "",
    },
  })

  // ContentstackLivePreview.init({
  //   enable: isLivePreviewEnabled,
  //   runScriptsOnUpdate: true,
  //   stackDetails: {
  //     apiKey: process.env.CONTENTSTACK_API_KEY || "",
  //     environment: "development",
  //   },
  // })

  // Initialize Live Preview once.
  useEffect(() => {}, [])

  return [stack, isLivePreviewEnabled]
}
