import React, { useEffect, useState } from "react"
import { getPageRes, jsonToHtmlParse } from "../helper-ts/"

import Layout from "../components/Layout"
import { PageProps } from "../typescript/template"
import RenderComponents from "../components/RenderComponents"
import SEO from "../components/SEO"
import { graphql } from "gatsby"
import { onEntryChange } from "../live-preview-sdk-ts/"

const Home = ({ data: { contentstackPage } }: PageProps) => {
  jsonToHtmlParse(contentstackPage)
  const [getEntry, setEntry] = useState(contentstackPage)

  async function fetchData() {
    try {
      const entryRes = await getPageRes("/")
      if (!entryRes) throw new Error("Error 404")
      setEntry(entryRes)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData())
  }, [])

  return (
    <Layout pageComponent={getEntry}>
      <SEO title={getEntry.title} />
      {getEntry.page_components && (
        <RenderComponents
          components={getEntry.page_components}
          contentTypeUid="page"
          entryUid={getEntry.uid}
          locale={getEntry.locale}
        />
      )}
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    contentstackPage(url: { eq: "/" }) {
      title
      url
      uid
      locale
      seo {
        enable_search_indexing
        keywords
        meta_description
        meta_title
      }
      page_components {
        contact_details {
          address
          email
          phone
        }
        from_blog {
          title_h2
          featured_blogs {
            title
            uid
            url
            featured_image {
              url
              uid
            }
            body
            author {
              title
              uid
              bio
            }
          }
          view_articles {
            title
            href
          }
        }
        hero_banner {
          banner_description
          banner_title
          bg_color
          banner_image {
            url
            uid
          }
          call_to_action {
            title
            href
          }
        }
        our_team {
          title_h2
          description
          employees {
            name
            designation
            image {
              url
              uid
            }
          }
        }
        section {
          title_h2
          description
          image {
            url
            uid
          }
          image_alignment
          call_to_action {
            title
            href
          }
        }
        section_with_buckets {
          title_h2
          description
          buckets {
            title_h3
            description
            icon {
              url
              uid
            }
            call_to_action {
              title
              href
            }
          }
        }
        section_with_cards {
          cards {
            title_h3
            description
            call_to_action {
              title
              href
            }
          }
        }
      }
    }
  }
`

export default Home
