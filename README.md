KityMinder Editor
==========



在线：[https://mind.clboy.cn](https://mind.clboy.cn)



## 简介

基于 [kityminder-editor](https://github.com/fex-team/kityminder-editor) 修改，由于没有学习过AngularJS，都是照葫芦画瓢添加的代码，只是为了方便个人在不登录的情况下编辑和查看思维导图。



## 已知问题

- 图片跨域无法生成PNG
- 360安全浏览器右键菜单无法显示
- 火狐浏览器节点中如果存在链接导出PNG无效
- Chrome暂未发现问题 :white_check_mark:



## 本地运行

```shell
git clone git@github.com:cloudlandboy/kityminder-editor.git
```

- 进去kityminder-editor的目录执行`bower install`(使用cdn则不需要下载)

- 打开`docs`目录下的`index.html`即可
- 脱离网络，把`docs/index.html`中css和js，bower部分注释打开，cdn部分注释掉