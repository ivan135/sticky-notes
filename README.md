### sticky-notes 便签

[点击预览本项目](https://lxchuan12.github.io/sticky-notes/dist?_blank "点击预览本项目")

其中`master`，`dev`分支是使用`webpack4`构建。[点击查看`dev`分支](https://github.com/lxchuan12/sticky-notes/tree/dev "点击查看`dev`分支")

`gh-pages`分支是使用`gulp`构建。[点击查看`gh-pages`分支](https://github.com/lxchuan12/sticky-notes/tree/gh-pages "点击查看`gh-pages`分支")

[点击查看参考的项目效果](https://webkit.org/demos/sticky-notes?_blank "点击查看参考的项目效果")


#### TODO 功能点

- [x] 1、创建、删除、移动、删除便签

- [x] 2、把便签内容保存到`localstorage`

- [x] 3、清除所有便签

- [x] 4、拖拽范围限制在可视区

- [x] 5、改用webpack4 构建

- [x] 6、加入less、eslint、babel等

- [x] 7、加入husky依赖，precommit 钩子校验

#### How to use
```
// 安装依赖
npm install

// 启动编写代码
npm run dev

// 本地开发访问：`http://localhost:1200`

// `eslint` 格式化文件
npm run lint:fix

// 打包发布
npm run build
```