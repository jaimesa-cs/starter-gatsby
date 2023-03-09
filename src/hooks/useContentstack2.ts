import * as Utils from "@contentstack/utils"

import { onEntryChange, unsubscribe } from "./cs-stack"

import React from "react"

interface IContentstackApiCall<K extends any, T extends any> {
  input: T
  get: (input: T) => Promise<any>
  defaultModel: K
}

interface IContenstackResult<T extends any> {
  model: T
}
export function useContentstack<K extends any, T extends any>(
  apiCall: IContentstackApiCall<K, T>
): IContenstackResult<K> {
  const [model, setModel] = React.useState<K>(apiCall.defaultModel)
  React.useEffect(() => {
    let callbackId: any
    if (process.env.CONTENTSTACK_LIVE_PREVIEW) {
      callbackId = onEntryChange(() => {
        apiCall.get(apiCall.input).then(setModel)
      })
    }
    return () => {
      if (process.env.CONTENTSTACK_LIVE_PREVIEW) {
        unsubscribe(callbackId)
      }
    }
  }, [])
  return {
    model,
  }
}
