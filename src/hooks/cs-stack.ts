import * as Contentstack from "contentstack"

import ContentstackLivePreview from "@contentstack/live-preview-utils"

export const Stack = Contentstack.Stack({
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
