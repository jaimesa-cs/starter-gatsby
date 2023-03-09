import {
  DispatchData,
  Entry,
  FooterProps,
  Links,
  Menu,
  Social,
} from "../typescript/layout"
import { Link, graphql, useStaticQuery } from "gatsby"
import React, { useEffect, useState } from "react"
import { getAllEntries, getFooterRes, jsonToHtmlParse } from "../helper-ts/"

import { actionFooter } from "../store/actions/state.action"
import { connect } from "react-redux"
import { onEntryChange } from "../live-preview-sdk-ts/"
import parser from "html-react-parser"

const queryLayout = () => {
  const data = useStaticQuery(graphql`
    query {
      contentstackFooter {
        title
        uid
        logo {
          url
        }
        navigation {
          link {
            href
            title
          }
        }
        social {
          social_share {
            link {
              href
              title
            }
            icon {
              url
            }
          }
        }
        copyright
      }
    }
  `)
  return data
}

const Footer = ({ dispatch }: DispatchData) => {
  const { contentstackFooter } = queryLayout()
  jsonToHtmlParse(contentstackFooter)
  const [getFooter, setFooter] = useState(contentstackFooter)

  function buildNavigation(ent: Entry, footer: FooterProps) {
    let newFooter = { ...footer }
    if (ent.length !== newFooter.navigation.link.length) {
      ent.forEach(entry => {
        const fFound = newFooter?.navigation.link.find(
          (nlink: Links) => nlink.title === entry.title
        )
        if (!fFound) {
          newFooter.navigation.link?.push({
            title: entry.title,
            href: entry.url,
            $: entry.$,
          })
        }
      })
    }
    return newFooter
  }

  async function getFooterData() {
    const footerRes = await getFooterRes()
    const allEntries = await getAllEntries()
    const nFooter = buildNavigation(allEntries, footerRes)
    setFooter(nFooter)
    dispatch(actionFooter(nFooter))
  }

  useEffect(() => {
    onEntryChange(() => getFooterData())
  }, [onEntryChange])

  return (
    <footer>
      <div className="max-width footer-div">
        <div className="col-quarter">
          <Link to="/" className="logo-tag">
            <img
              {...getFooter.logo.$?.url}
              src={getFooter.logo?.url}
              alt={getFooter.title}
              title={getFooter.title}
              className="logo footer-logo"
            />
          </Link>
        </div>
        <div className="col-half">
          <nav>
            <ul className="nav-ul">
              {getFooter.navigation.link.map((menu: Menu, index: number) => {
                return (
                  <li className="footer-nav-li" key={index} {...menu.$?.title}>
                    <Link to={menu.href}>{menu.title}</Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
        <div className="col-quarter social-link">
          <div className="social-nav">
            {getFooter.social.social_share.map(
              (social: Social, index: number) => {
                return (
                  <a
                    href={social.link?.href}
                    title={social.link.title.toLowerCase()}
                    key={index}
                    className="footer-social-links"
                  >
                    <img
                      {...social.icon.$?.url}
                      src={social.icon?.url}
                      alt="social-icon"
                    />
                  </a>
                )
              }
            )}
          </div>
        </div>
      </div>
      <div className="copyright">
        {typeof getFooter.copyright === "string" ? (
          <div {...getFooter.$?.copyright}>{parser(getFooter?.copyright)}</div>
        ) : (
          ""
        )}
      </div>
    </footer>
  )
}

export default connect()(Footer)
