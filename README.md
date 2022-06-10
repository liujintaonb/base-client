# base-client

## 基础权限系统

> 本项目实现基础的权限管理系统，以及一些演示，在实际开发中，可将演示去掉，只保留基础权限功能。需要什么功能再拿什么。

## 项目结构
```
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── config                 # 全局配置文件
│   ├── directive              # 全局指令
│   ├── filters                # 全局 filter
│   ├── icons                  # 项目所有 svg icons
│   ├── layout                 # 全局 layout
│   ├── plugins                # 插件包，目前有 map k-ui 之后会迁移到自建 npm
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── vendor                 # 公用vendor
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件 加载组件 初始化等
│   └── perm.js                # 权限管理
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── vue.config.js              # vue-cli 配置
└── package.json               # package.json
```

## 布局
#### layout
对应代码 @/layout ， base-client 中大部分页面都是基于 ```layout``` 的，除了个别如：login 等页面没有使用该 ```layout```。 如果想在一个项目中不同的或多个 ```layout``` 也很方便，只要在 layout 文件夹下，创建不同的 ```layout``` ,然后只要在一级路由那里选择不同的```layout``` 组件就行


这里使用了 vue-router 路由嵌套，所以一般情况下，增加或修改页面只会影响 ```app-main``` 这个主体区域。其他配置在 ```layout``` 中的内容：侧边栏或导航栏都是不会随着主体页面变化二变化的。

#### app-main
> 对应代码 @/layout/components/AppMain

这里在 ```app-main``` 外部包了一层 ```keep-alive``` 主要是为了缓存 ```<router-view>``` 的。

如需要缓存页面
```
// 缓存页面,前置条件，需要缓存的路由对应组件必须设置 name 与 路由 name 一致，否则不生效
store.diptch('tagsView/addCachedView', routeName) // routeName ，路由 name， 也可以是数组形式

// 清除缓存页面
store.diptch('tagsView/delCachedView', routeName) / routeName ，路由 name， 也可以是数组形式
```

## 路由与侧边栏
#### 路由配置
```
/**
 *  constantRoutes 存放不需要权限控制的路由，比如 登录、注册等页面
 *  路由参数
 *  hidden 可选参数， hidden = true 时，左侧菜单不显示，可以是 登录、注册、某个模块详情 等
 *  alwaysShow 可选参数 alwaysShow = true 时，表示，不管用户有没有路由权限 始终显示
 *  name 基本路由名称， 一级菜单可不设置路由菜单， 路由唯一标识，在 asyncRoutes 与后端返回权限集合对比
 *  meta 对象
 *      title 做左侧与页面标签显示
 *      icon  当前路由 icon 支持 src/icons 中的图标（对应 svg 文件名），与 element 图标
 *      affix 当前路由 是否固定在 tagsView
 */
```

> 如在 其他位置需要使用 icons 中为图标，可在 阿里巴巴图标中或其他网站下载 svg 文件
，存入 ```@/icons/svg``` 文件件

```
<svg-icon icon-class="svg文件名"></svg-icon>
```

## 权限

#### 菜单权限

开发过程中，可先将路由存放到 constantRoutes 数组中。上测试环境在 将 路由存放到 asyncRoutes 数组中并在资源管理页面新增菜单，菜单名称对应 路由 meta.title , 唯一编码对应 路由 name , 权限集合对应页面基础接口，如某个查询等（编辑更新，删除等接口权限配置到页面对应的按钮）。 配置成功后，可在相应的角色中添加该菜单权限即可访问。

#### 按钮权限
按钮唯一编码 最好是如下格式 页面路由name + ':' + 按钮动作名 。 如 资源管理 编辑按钮 唯一编码可以是 system_menus:edit

控制按钮权限代码
```
// 依旧拿 资源管理 编辑按钮举例， 当用户有该按钮权限则显示，反之不显示
// 指令形式
<el-button v-perm="'system_menus:edit'">编辑</el-button>

// 函数模式 配合 v-if 使用
<script>
import hasPerm from '@/utils/perm'

const hasEditPerm = hasPerm('system_menus:edit')

export default defineComponent({
  data () {
    return {
      hasEditPerm
    }
  }
})
</script>


// 使用经验：表格中的编辑等按钮，最好是 指令形式与函数形式配合使用， 如下
// 原因，当该列一个表格都没有则显示一个空列在那。
<el-table-column
  label="操作"
  align="center"
  v-if="hasEditDelPerm">
  <template #default="{ row }">
    <el-button v-perm="'system_menus:edit'">编辑</el-button>
    <el-button v-perm="'system_menus:del'">删除</el-button>
  </template>
</el-table-column>

<script>
import hasPerm from '@/utils/perm'

const hasEditDelPerm = hasPerm('system_menus:edit') || hasPerm('system_menus:del')

export default defineComponent({
  data () {
    return {
      hasEditDelPerm
    }
  }
})
</script>
```

## 与服务端进行交互
为了方便管理维护，所有接口都必须在 @/api 文件夹配置 url 传参等。 以后端接口模块建立文件。如 角色 则 创建 @/api/role.js 文件 所有与角色相关的接口都定义到这个文件，然后组件中调用

配置 api 基础 baseUrl
在 env.*** 中配置 ```VUE_APP_BASE_API``` 的值

## 配置文件
项目的一些全局配置定义在 .env.*** 文件中, 更多配置请查看具体文件

然后在 ```@/config/index.js``` 文件中配置,如
```
// .env.***
VUE_APP_BASE_API = '/api'

// @/config/index.js
module.exports = {
  baseApiUrl: process.env.VUE_APP_BASE_API
}

// 项目中获取
import config from '@/config'

config.***
```

> 为啥这样做？

为了更好的维护，不让项目业务代码中出现丑陋的 process.env.****


## 第三方插件
第三方插件除非是官方出的 vue 组件，一般建议自己封装成 vue 组件的形式。

示例 详见 @/plugins/k-ui/packages/badge 或 @/components/Charts


## 图表
> 本项目 图表插件使用的是 ```@antv/g2plot``` ， 在 ```@/components/Charts``` 简单封装了 line pie bar 等。需要其他图，可按照 line pie bar 等自己封装。

## 温馨提示
el-dialog 在使用中出现 切换不显示的 bug , 看ele 生成的dom 依然是 display:none ,估计是 ele 现存bug, 暂时解决 如下
```
// 使用 v-if 修复
<el-dialog title="角色编辑" v-if="visible" v-model="visible">
....
</el-dialog>
```

compression-webpack-plugin 依赖包暂不可升级，否则会打包报错