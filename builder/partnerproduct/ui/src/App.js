import "./fonts.css";
import Icon from "@leafygreen-ui/icon";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { SideNav, SideNavGroup, SideNavItem } from "@leafygreen-ui/side-nav";
import { H1, H2, H3 } from "@leafygreen-ui/typography";

import { ChatModule, Search, Hero } from './modules';

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index) => () => {
    setActiveTab(index);
  };

  return (
    <LeafyGreenProvider>
      <Router>
        <div className="App">
          <SideNav collapsed={false} widthOverride={300} className="container">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src="/mongodb_icon.svg" width={15} alt="MongoDB Icon" />
              <H3 style={{ marginLeft: "8px" }}>MAAP</H3>
            </div>
            <br></br>
            <Link onClick={handleTabClick(0)} className="link" to="/">
              <SideNavItem onClick={handleTabClick(0)} active={activeTab === 0} glyph={<Icon glyph="Dashboard" />}>
                Overview
              </SideNavItem>
            </Link>
            <SideNavItem
              onClick={function redirect() {
                window.open("https://mongodb-partners.github.io/maap-framework/docs/intro", "_blank");
              }}
              glyph={<Icon glyph="University" />}>
              Documentation
            </SideNavItem>
            <SideNavGroup header="Capabilities" glyph={<Icon glyph="Apps" />}>
              <Link onClick={handleTabClick(1)} className="link" to="/rag-chatbot">
                <SideNavItem active={activeTab === 1} glyph={<Icon glyph="Sparkle" />}>
                  RAG Chatbot
                </SideNavItem>
              </Link>
              <Link onClick={handleTabClick(2)} className="link" to="/search">
                <SideNavItem active={activeTab === 2} glyph={<Icon glyph="MagnifyingGlass" />} >
                  Vector Search
                </SideNavItem>
              </Link>
              <Link onClick={handleTabClick(3)} className="link" to="/hybrid-search">
                <SideNavItem active={activeTab === 3} glyph={<Icon glyph="Wizard" />} >
                  Hybrid Search
                </SideNavItem>
              </Link>
            </SideNavGroup>
          </SideNav>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/rag-chatbot" element={<ChatModule />} />
              <Route path="/search" element={<Search />} />
              <Route path="/hybrid-search" element={<Search hybrid="true" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LeafyGreenProvider>
  );
}

export default App;
