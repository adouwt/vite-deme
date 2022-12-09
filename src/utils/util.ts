import SparkMD5 from 'spark-md5'
import {uploadFile, mergeChunks } from './request';
const DefualtChunkSize = 2 * 1024 * 1024;
export const getFileChunk = (file, chunkSize = DefualtChunkSize) => {
    return new Promise((resovle) => {
        let fileChunkList = [];
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();
        console.log("chunks:", chunks)
        fileReader.onload = function (e) {
            let currFile = {}
            console.log('read chunk nr', currentChunk + 1, 'of');
            const chunk = e.target.result;
            spark.append(chunk);
            currentChunk++;
            currFile = {
                name: `${file.name}-${currentChunk}`
            }
            if (currentChunk < chunks) {
                loadNext(currFile);
            } else {
                let fileHash = spark.end();
                console.info('finished computed hash', fileHash);
                resovle({ fileHash, fileChunkList });
            }
        };

        fileReader.onerror = function () {
            console.warn('oops, something went wrong.');
        };

        function loadNext(currFile={name: file.name}) {
            let start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            let chunk = blobSlice.call(file, start, end);
            fileChunkList.push({ chunk, size: chunk.size, name: currFile.name });
            fileReader.readAsArrayBuffer(chunk);
        }

        loadNext();
    });
}

// 上传请求
export const uploadChunks = (fileHash, fileChunkList) => {
    console.log(fileChunkList)
    const requests = fileChunkList.map((item, index) => {
      const formData = new FormData();
      formData.append(`${item.name}-${fileHash}-${index}`, item.chunk);
      formData.append("filename", item.name);
      formData.append("hash", `${fileHash}-${index}`);
      formData.append("fileHash", fileHash);
      console.log("formData:", formData.get(`${item.name}-${fileHash}-${index}`))
      return uploadFile('/api/upload', formData, onUploadProgress(item));
    });
    
    Promise.all(requests).then(() => {
        setTimeout(() => {
            mergeChunks('/post/mergeChunk', { size: DefualtChunkSize, filename: fileHash, fileType: 'mp4' });
        },200)
    });
  }


  // 分块进度条
  const onUploadProgress = (item) => (e) => {
    item.percentage = parseInt(String((e.loaded / e.total) * 100));
    console.log("item.percentage:", item.percentage)
  }