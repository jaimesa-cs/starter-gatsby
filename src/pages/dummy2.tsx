import type { HeadFC, PageProps } from "gatsby"
import {
  IGetEntryByUidParams,
  getEntryByUid,
  getPageByUrl,
} from "../hooks/cs-api"

import React from "react"
import { graphql } from "gatsby"
import { useContentstack } from "../hooks/useContentstack2"

const TYPE_UID = "dummy"
const PAGE_UID = "bltdb7e03e625964195"

interface IDummy {
  title?: string
  value_1?: string
  value_2?: string
}

export const query = graphql`
  query TestPage {
    contentstackDummy(uid: { eq: "bltdb7e03e625964195" }) {
      title
      url
    }
  }
`

export interface TestOptions {
  title: string
  url: string
}

const TestPage2: React.FC<PageProps<any>> = ({
  data: { contentstackDummy },
}) => {
  const { model } = useContentstack<IDummy, IGetEntryByUidParams>({
    input: { contentTypeUid: TYPE_UID, entryUid: PAGE_UID },
    get: getEntryByUid,
    defaultModel: contentstackDummy,
  })

  return (
    <main className="test-page">
      <h1 className="title">{model?.title}</h1>
      <p className="value-1">{model?.value_1}</p>
      <p className="value-2">{model?.value_2}</p>
    </main>
  )
}

export default TestPage2

export const Head: HeadFC = () => <title>Testing CS and Gatsby</title>
