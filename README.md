# [Helpful link to make new branch ](https://www.varonis.com/blog/git-branching) to avoid making git force
## About The Project

## Dependencies

## The Problem

## The Solution

## How Does It Work

## How To Use

## Getting Started

### To deploy the Smart Contract

### To run react development server

----------------------
## *To Run IPFS locally*
## Install 
 ```js
npm i --location=global ipfs
```
##  Run server 
```js
jsipfs daemon
```
> to visit it click ```http://127.0.0.1:5002/webui```

## !! to avoid the forbidden Error that happens when you upload images 
## ```open PowerShell then write this``` 
  ```git
  - jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\"http://127.0.0.1:5002\", \"http://localhost:3000\", \"http://127.0.0.1:5001\", \"https://webui.ipfs.io\"]'

  - jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\"PUT\", \"POST\"]'
  ```
  > also Don't forget to open Server 
  ```jsipfs daemon```