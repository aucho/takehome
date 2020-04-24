# Frontend take-home

## JSON 编辑器

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run start
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```
### structure

```js
+-- build/                      ---打包的文件目录
+-- node_modules/               ---npm下载文件目录
+-- public/                                 
|   --- favicon.ico							    ---站点ico文件
|   --- index.html							    ---首页入口html文件
+-- src/                        ---核心代码目录
|   +-- entry                       ---文本框组件
|   |    --- entry.js
|   +-- showcase                    ---树形展示组件
|   |    --- showcase.js
|   |    --- component
|   |    ...            
|   --- index.js                            ---js入口文件
|   --- Help.js                             
|   --- App.js               
--- package.json                            ---依赖库配置文件