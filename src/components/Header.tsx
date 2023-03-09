import { DispatchData, Entry, HeaderProps, Menu } from "../typescript/layout"
import { Link, graphql, useStaticQuery } from "gatsby"
import React, { useEffect, useState } from "react"
import { getAllEntries, getHeaderRes, jsonToHtmlParse } from "../helper-ts/"

import Tooltip from "./ToolTip"
import { actionHeader } from "../store/actions/state.action"
import { connect } from "react-redux"
import jsonIcon from "../images/json.svg"
import { onEntryChange } from "../live-preview-sdk-ts/"
import parse from "html-react-parser"

const queryHeader = () => {
  const query = graphql`
    query {
      contentstackHeader {
        title
        uid
        logo {
          uid
          url
          filename
        }
        navigation_menu {
          label
          page_reference {
            title
            url
            uid
          }
        }
        notification_bar {
          show_announcement
          announcement_text
        }
      }
    }
  `
  return useStaticQuery(query)
}

const Header = ({ dispatch }: DispatchData) => {
  const { contentstackHeader } = queryHeader()
  jsonToHtmlParse(contentstackHeader)
  const [getHeader, setHeader] = useState(contentstackHeader)

  function buildNavigation(ent: Entry, head: HeaderProps) {
    let newHeader = { ...head }
    if (ent.length !== newHeader.navigation_menu.length) {
      ent.forEach(entry => {
        const hFound = newHeader?.navigation_menu.find(
          navLink => navLink.label === entry.title
        )
        if (!hFound) {
          newHeader.navigation_menu?.push({
            label: entry.title,
            page_reference: [
              { title: entry.title, url: entry.url, $: entry.$ },
            ],
            $: {},
          })
        }
      })
    }
    return newHeader
  }

  async function getHeaderData() {
    const headerRes = await getHeaderRes()
    const allEntries = await getAllEntries()
    const nHeader = buildNavigation(allEntries, headerRes)
    setHeader(nHeader)
    dispatch(actionHeader(nHeader))
  }

  useEffect(() => {
    onEntryChange(() => getHeaderData())
  }, [onEntryChange])

  return (
    <header className="header">
      <div
        className="note-div"
        {...getHeader.notification_bar.$?.announcement_text}
      >
        {getHeader.notification_bar.show_announcement &&
          typeof getHeader.notification_bar.announcement_text === "string" &&
          parse(getHeader.notification_bar.announcement_text)}
      </div>
      <div className="max-width header-div">
        <div className="wrapper-logo">
          <Link to="/" className="logo-tag" title="Contentstack">
            <img
              className="logo"
              {...getHeader.logo.$?.url}
              src={getHeader.logo?.url}
              alt={getHeader.title}
              title={getHeader.title}
            />
          </Link>
        </div>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon"></span>
        </label>

        <nav className="menu">
          <ul className="nav-ul header-ul">
            {getHeader.navigation_menu.map((menu: Menu, index: number) => {
              return (
                <li className="nav-li" key={index} {...menu.$?.label}>
                  {menu.label === "Home" ? (
                    <Link
                      to={`${menu.page_reference[0]?.url}`}
                      activeClassName="active"
                    >
                      {menu.label}
                    </Link>
                  ) : (
                    <Link
                      to={`${menu.page_reference[0]?.url}/`}
                      activeClassName="active"
                    >
                      {menu.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="json-preview">
          <Tooltip
            content="JSON Preview"
            direction="top"
            dynamic={false}
            delay={200}
            status={0}
          >
            <span data-bs-toggle="modal" data-bs-target="#staticBackdrop">
              <img src={jsonIcon} alt="JSON Preview icon" />
            </span>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}

export default connect()(Header)
