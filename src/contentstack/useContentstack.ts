import * as Contentstack from "contentstack"

import ContentstackLivePreview from "@contentstack/live-preview-utils"
import { OnEntryChangeCallback } from "@contentstack/live-preview-utils/dist/src/utils/types"
import React from "react"

interface IUseContentstackProps {
  livePreview?: boolean
}

interface IContenstack {
  contentstackReady: boolean
  Stack: Contentstack.Stack
  onEntryChange: (onChangeCallback: OnEntryChangeCallback) => string
  getDummyPageRes: () => Promise<any>
}

let config: Contentstack.Config = {
  api_key: process.env.CONTENTSTACK_API_KEY || "",
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || "",
  environment: process.env.CONTENTSTACK_ENVIRONMENT || "",
}

const livePreview = process.env.CONTENTSTACK_LIVE_PREVIEW === "true"

if (livePreview) {
  config.live_preview = {
    management_token: process.env.CONTENTSTACK_MANAGEMENT_TOKEN || "",
    enable: true,
    host: process.env.CONTENTSTACK_API_HOST || "",
  }
}

console.log("New Stack")
const Stack = Contentstack.Stack(config)

if (process.env.CONTENTSTACK_API_HOST) {
  Stack.setHost(process.env.CONTENTSTACK_API_HOST)
}

export const useContentstack = (init: IUseContentstackProps): IContenstack => {
  const [contentstackReady, setContentstackReady] = React.useState(false)
  const [initialized, setInitialized] = React.useState(false)
  const onEntryChange = ContentstackLivePreview.onEntryChange

  React.useEffect(() => {
    console.log(
      "Initialize",
      livePreview,
      config.live_preview?.enable,
      initialized
    )
    if (livePreview && config.live_preview?.enable && !initialized) {
      ContentstackLivePreview.init({
        enable: process.env.CONTENTSTACK_LIVE_PREVIEW === "true",
        //@ts-ignore
        stackSdk: Stack,
        clientUrlParams: {
          host: process.env.CONTENTSTACK_APP_HOST,
        },
        ssr: false,
      })
      // console.log("Initialized")
      setContentstackReady(true)
      setInitialized(true)
    }
  }, [initialized])

  return {
    contentstackReady,
    Stack,
    onEntryChange,
    getDummyPageRes: async () => {
      if (contentstackReady) {
        return Stack.ContentType("dummy")
          .Entry("bltc70381c51bc258d9")
          .toJSON()
          .fetch()
      }
    },
  }
}
