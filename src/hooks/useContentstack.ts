import * as Utils from "@contentstack/utils"

import { onEntryChange, unsubscribe } from "./cs-stack"

import React from "react"

interface IContentstackApiCall<T extends any> {
  input: T
  get: (input: T) => Promise<any>
  set: React.Dispatch<React.SetStateAction<T>>
}

export function useContentstack<T extends any>(
  apiCall: IContentstackApiCall<T>
) {
  React.useEffect(() => {
    let callbackId: any
    if (process.env.CONTENTSTACK_LIVE_PREVIEW) {
      callbackId = onEntryChange(() => {
        apiCall.get(apiCall.input).then(apiCall.set)
      })
    }
    return () => {
      if (process.env.CONTENTSTACK_LIVE_PREVIEW) {
        unsubscribe(callbackId)
      }
    }
  }, [])
}
