import * as React from "react"
import { useState } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import { getFileChunk, uploadChunks } from '../utils/util'

const onChange = (e) => {
  const file = e.target.files;
  getFileChunk(file?.[0]).then((res,rej) => {
    uploadChunks(res.fileHash, res.fileChunkList)
  })
}
function Upload() {
  return (
    <div className="App">
      <h1>大文件上传</h1>
      <input type="file" onChange={onChange}/>
      上传进度
      <div>
        <h1>断点续传</h1>
        <h1>秒传</h1>
        <h1>取消上传</h1>
      </div>
    </div>
  )
}

export default Upload
