import { Stack } from "./cs-stack"
import { Utils } from "contentstack"

export const renderOption = {
  ["span"]: (node: any, next: any) => {
    return next(node.children)
  },
}

export interface IGetPageByURLParams {
  contentTypeUid: string
  entryUrl: string
  referenceFieldPath?: []
  jsonRtePath?: []
}

export interface IGetEntryByUidParams {
  contentTypeUid: string
  entryUid: string
}

export const getPageByUrl = (input: IGetPageByURLParams): Promise<any> => {
  return new Promise((resolve, reject) => {
    const pageQuery = Stack.ContentType(input.contentTypeUid).Query()
    if (input.referenceFieldPath)
      pageQuery.includeReference(input.referenceFieldPath)
    pageQuery.includeOwner().toJSON()
    const data = pageQuery.where("url", `${input.entryUrl}`).find()
    data.then(
      (result: any) => {
        input.jsonRtePath &&
          Utils.jsonToHTML({
            entry: result,
            paths: input.jsonRtePath,
            renderOption,
          })
        resolve(result[0][0])
      },
      error => {
        reject(error)
      }
    )
  })
}

export const getEntryByUid = (input: IGetEntryByUidParams): Promise<any> => {
  return new Promise((resolve, reject) => {
    const entryQuery = Stack.ContentType(input.contentTypeUid).Entry(
      input.entryUid
    )
    entryQuery.includeOwner().toJSON()
    const data = entryQuery.fetch()
    data.then(
      (result: any) => {
        resolve(result)
      },
      error => {
        reject(error)
      }
    )
  })
}
