import React from 'react'

export default function Footer() {
  return (
    <>
      <div className="container">
        <ul className="nav nav-pills" style={{ fontSize: '16px' }}>
          <li className="nav-item">
            <a className="nav-link" href="###" aria-current="page">
              For you
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="###">
              Following
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="###">
              Web dev
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link disabled"
              href="###"
              tabIndex="-1"
              aria-disabled="true"
            >
              Disabled
            </a>
          </li>
        </ul>
      </div>
      <br />
    </>
  );
}
