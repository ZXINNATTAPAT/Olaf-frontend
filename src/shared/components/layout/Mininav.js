import React from 'react'

export default function Mininav() {
  // ไว้ดึงประเภทข้อมูลมาวนลูป
  return (
    <>
      <ul class="nav nav-pills border-bottom " style={{fontSize:'18px'}}>
        <li class="nav-item">
          <a class="nav-link " aria-current="page" href="##">For you</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="##">Following</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="###">Web dev</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="###">Link</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="###">Link</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="###" tabindex="-1" aria-disabled="true">Disabled</a>
        </li>
      </ul>
    </>
  )
}
