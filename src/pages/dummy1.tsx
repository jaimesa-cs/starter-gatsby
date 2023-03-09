import type { HeadFC, PageProps } from "gatsby"
import { getEntryByUid, getPageByUrl } from "../hooks/cs-api"

import React from "react"
import { graphql } from "gatsby"
import { useContentstack } from "../hooks/useContentstack"

const TYPE_UID = "dummy"
const PAGE_URL = "/bank-of-ozk"

export const query = graphql`
  query TestPage {
    contentstackDummy(uid: { eq: "bltc70381c51bc258d9" }) {
      title
      url
    }
  }
`
export interface TestOptions {
  title: string
  url: string
}

const TestPage: React.FC<PageProps<any>> = ({
  data: { contentstackDummy },
}) => {
  const [model, setModel] = React.useState(contentstackDummy)

  useContentstack({
    input: { contentTypeUid: TYPE_UID, entryUrl: PAGE_URL },
    get: getPageByUrl,
    set: setModel,
  })
  useContentstack({
    input: { contentTypeUid: TYPE_UID, entryUrl: PAGE_URL },
    get: getPageByUrl,
    set: setModel,
  })
  // useContentstack({
  //   input: { contentTypeUid: TYPE_UID, entryUid: "bltc70381c51bc258d9" },
  //   get: getEntryByUid,
  //   set: setModel,
  // })

  return (
    <main className="test-page">
      <h1 className="title">{model?.title}</h1>
      <p className="value-1">{model?.value_1}</p>
      <p className="value-2">{model?.value_2}</p>
    </main>
  )
}

export default TestPage

export const Head: HeadFC = () => <title>Testing CS and Gatsby</title>
