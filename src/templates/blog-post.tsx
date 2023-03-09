import React, { useEffect, useState } from "react"
import { getBlogPostRes, getPageRes, jsonToHtmlParse } from "../helper-ts/"

import ArchiveRelative from "../components/ArchiveRelative"
import Layout from "../components/Layout"
import { PageProps } from "../typescript/template"
import RenderComponents from "../components/RenderComponents"
import SEO from "../components/SEO"
import { graphql } from "gatsby"
import moment from "moment"
import { onEntryChange } from "../live-preview-sdk-ts/"
import parser from "html-react-parser"
import { useLocation } from "@reach/router"

const blogPost = ({
  data: { contentstackBlogPost, contentstackPage },
}: PageProps) => {
  const { pathname } = useLocation()
  jsonToHtmlParse(contentstackBlogPost)

  const [getEntry, setEntry] = useState({
    banner: contentstackPage,
    post: contentstackBlogPost,
  })

  async function fetchData() {
    try {
      const entryRes = await getBlogPostRes(pathname)
      const bannerRes = await getPageRes("/blog")
      if (!entryRes || !bannerRes) throw new Error("Error 404")
      setEntry({ banner: bannerRes, post: entryRes })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData())
  }, [contentstackBlogPost, contentstackPage])
  return (
    <Layout blogPost={getEntry.post} banner={getEntry.banner}>
      <SEO title={getEntry.post.title} />
      <RenderComponents
        components={getEntry.banner.page_components}
        blogPage
        contentTypeUid="blog_post"
        entryUid={getEntry.banner.uid}
        locale={getEntry.banner.locale}
      />
      <div className="blog-container">
        <div className="blog-detail">
          <h2 {...getEntry.post.$?.title}>
            {getEntry.post.title ? getEntry.post.title : ""}
          </h2>
          <span>
            <p>
              {moment(getEntry.post.date).format("ddd, MMM D YYYY")},{" "}
              <strong {...getEntry.post.author[0]?.$?.title}>
                {getEntry.post.author[0]?.title}
              </strong>
            </p>
          </span>
          <span {...getEntry.post.$?.body}>{parser(getEntry.post.body)}</span>
        </div>
        <div className="blog-column-right">
          <div className="related-post">
            {getEntry.banner.page_components[2].widget && (
              <h2 {...getEntry.banner.page_components[2]?.widget.$?.title_h2}>
                {getEntry.banner.page_components[2].widget.title_h2}
              </h2>
            )}
            <ArchiveRelative
              data={getEntry.post.related_post && getEntry.post.related_post}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const postQuery = graphql`
  query ($title: String!) {
    contentstackBlogPost(title: { eq: $title }) {
      url
      title
      body
      uid
      locale
      date
      author {
        title
        bio
        picture {
          url
        }
      }
      related_post {
        body
        url
        title
        date
      }
      seo {
        enable_search_indexing
        keywords
        meta_description
        meta_title
      }
    }
    contentstackPage {
      page_components {
        widget {
          title_h2
          type
        }
      }
    }
  }
`
export default blogPost
