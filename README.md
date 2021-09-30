# 说明文档
## `malp`: 一个帮助你快速搭建和开发前端项目的CLI

如何安装？

```shell
npm install malp -g
```

## 创建项目

目前支持React，后期可能会支持Vue3

React项目模块已经帮你配置：

* 常用的目录结构（你可以在此基础上修改）
* craco.config.js（其中配置了别名，你可以自行修改和配置更多）
* network（网络请求axios的安装以及二次封装）
* router（router的安装和配置）
* redux（redux的安装和配置，并配置了thunk中间件，另外有动态加载子模块，后面详细说明）

创建TypeScript项目

```shell
malp create your_project_name
or
malp create your_project_name -l ts
```

创建JavaScript项目

```shell
malp create your_project_name -l js
or
malp create your_project_name -l javascript
```

自动拉取项目模板



## 项目开发

项目开发目前提供：

* 创建Redux子模块

### 创建Redux子模块

```shell
malp add store # 例如malp add store，默认会放到当前终端路径文件夹下
malp add store -d src/pages/404 # 也可以指定文件夹(基于当前终端路径下查找)
```

创建完成后，不需要手动配置，已经动态将所有子模块集成进去：

```js
interface ReducersType {
  [key: string]: any
}
const reducers: ReducersType = {}
// @ts-ignore
const files = require.context('@/pages', true, /store\/index\.ts$/)
files.keys().forEach((key: string) => {
  const reducerPath = key.replace('./', '')
  const reducerName = reducerPath.split('/store/')[0]
  reducers[reducerName] = require(`@/pages/${reducerPath}`).reducer
})
```

