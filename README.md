## Vuetify Message Snackbar

> 开发插件时`vuetify`的版本号是`2.3.10`，支持`Nuxt`

Vuetify Snackbar 的样式和功能都很有特点，但美中不足，没有提供函数式调用的能力。

习惯 ElementUI 函数式唤起消息条的人可能不会再想笨重的写 DOM，再通过数据驱动控制消息条的显隐，麻烦，影响开发效率。

所以本插件参考了 ElementUI Message 的调用方式对 v-snackbar 进行了封装与扩展，并提供了便捷的函数式配置能力。

[在线预览效果](https://thinkupp.github.io/demo/#/vuetify/message)

### 特点

- 函数式显示与隐藏 Snackbar
- 六个方向支持多消息同时显示（上左中右、下左中右）
- 支持 VNode （内容与右侧的关闭按钮都支持）
- 链式调用设置属性
- 自动设置过渡动画
- 自定义配置支持缓存再调用

### 安装

```base
npm install -D vuetify-message-snackbar
```

##### Browser

```js
import Vue from 'vue'
import message from 'vuetify-message-snackbar';

Vue.use(message[, option]);
```

- option

> `Vue.use` 时的`option`请参考下方的配置项说明，可不传

```js
Vue.use(Message, {
	autoRemove: true,
	closeButtonContent: 'CLOSE',
	offsetTop: 10,
	autoTransitionSetting: true,
	class: 'margin-top-animation',
	// 预设icon
	presetIcon: {
		success: 'mdi-checkbox-marked-circle'
	},
	// ...以及几乎所有的组件属性都可以在这里进行设置, 比如:
	absolute: true,
	dark: true,
	width: 600,
	height: 200,
	transition: 'scroll-x-transition',
	// 使用自定义vuetify配置(自行修改vuetify插件将opt作为对象属性导出)
	options: vuetify.options
})

```
##### CDN

> 下方链接仅供参考

```html
<script src="https://cdn.jsdelivr.net/npm/vuetify-message-snackbar"></script>

<script>
	Vue.use(VuetifyMessageSnackbar[, option]);
</script>
```

##### Nuxt

> /plugins 文件夹中新建`message`目录，`message`目录下新建`index.js / index.ts`文件

```js
import Vue from 'vue'
import message from './vuetify-message-snackbar'

Vue.use(message[, option]);
```

> 在`nuxt.config.js`中，找到`plugins`字段，添加一项

```js
plugins: [
  '~/plugins/message'
]
```

### 组件需知

如果你是以按需加载的方式加载的`Vuetify`，请确保以下组件已经被注册：

- `v-snackbar`
- `v-icon`
- `v-btn`

参考下方示例代码：

```js
import Vuetify, { VSnackbar, VBtn, VIcon } from “vuetify/lib”;

Vue.use(Vuetify);

Vue.component("v-snackbar", VSnackbar);
Vue.component("v-btn", VBtn);
Vue.component("v-icon", VIcon);
```

### 使用

- 基本的用法

```js
// 传参
this.$message({
	message: 'Hello',
	color: 'success',
})

// 快捷方法
this.$message.success('success');
this.$message.info('info');
this.$message.warning('warning');
this.$message.error('error');

// 默认底色(color)
this.$message.show('show');
```

- 自定义方向

```js
this.$message.top().success('top'); // 上中
this.$message.bottomLeft().success('bottomLeft'); // 下左
// (top/topLeft/topRight/bottom/bottomLeft/bottomRight) 共六个方向
```

##### 在JS/TS文件中使用
```js
import { Notify } from "vuetify-message-snackbar";
Notify.success('use in js');
```

- 函数式配置

#####  通过函数可以设置绝大部分属性

> 除了方向相关以及`value`外的所有属性都可以设置（`top/left/right/bottom/value`），因为方向相关的已经封装了对应的六个函数(`top/topLeft/bottomRight`等)；而`value`是控制显隐的，属于特殊属性所以不允许外部控制

```js
this.$message.top().timeout(-1).info('timeout');	// 设置自动隐藏时间
```

##### 纯布尔值默认为真

> 如果属性是纯布尔值的（不是多类型或者非布尔的），那么调用不传参默认就是设置为`true`

```js
this.$message.topRight().light().success('light');	// 设置为浅色的主题
this.$message.topRight().light(true).success('light');	// 与上面的那句等价

this.$message.topRight().light(false).success('light');	// 设置非浅色的主题
```

##### 消息条ICON

0.2.3 版本预设了`success/info/warning/error`的字体图标

如果传入`string`，比如`mdi-domain`，那将会转换成`<v-icon left>mdi-domain</v-icon>`的结构，所以请确保传入的参数可以被`v-icon`正确的解析）

通过`Vue.use`或者`this.$message.messageIcon`传参可覆盖

*当`message`为`VNode`类型时，该功能失效*

```js
this.$message.messageIcon("mdi-domain").success("自定义Icon"); // string
this.$message.messageIcon(this.$createElement("v-icon", {
	props: {
		small: true,
	}
}, ["mdi-domain"])).success("自定义Icon"); // VNode

this.$message.messageIcon().success("Hide Icon"); // 隐藏预设的icon
```

##### 配置链式调用

> 相同配置以最后一次执行的值为准

```js
this.$message.vertical().height(100).info('配置链式调用'); // 链式调用
this.$message.height(600).height(10).height(300).info('高度为300'); // 重复配置
```

> 需要注意一点，如果要自定义背景色(`color`)，**最后需要调用`show`方法**，而不可以是`success/info/warning/error`（因为这几个命令对`color`的赋值优先级是最高的，调用后自定义`color`值将被覆盖）

```js
this.$message.top().color('#12d6cd').show();	// 自定义背景色
```

##### 随机动画效果

> 调用 `transition` 时不传参的话，会从`vuetify`默认自带的 10 个过渡效果中随机选择一个

```js
this.$message.transition().success('random');
```

##### 带有横线的参数支持两种配置方式

```js
// 所有带横线的参数都支持下面两种写法
this.$message['min-width'](100).success('min-width');
this.$message.minWidth(100).success('minWidth');
```

##### 设置关闭按钮（官方属性外的扩展设置）

```js
// 设置按钮标题
// 如果传文本，需要保证全局支持`v-btn`，因为关闭按钮默认就是`v-btn`
this.$message.closeButtonContent('关闭').success('close-button');

// 自定义 VNode
this.$message.closeButtonContent(this.$createElement('div', 'VNode Close')).success('关闭按钮使用VNode');

// 传空字符串会隐藏关闭按钮
this.$message.closeButtonContent('').success('隐藏关闭按钮');
```

##### 设置消息条的边距（官方属性外的扩展设置）

```js
this.$message.offsetTop(100).success('offset-top');
```

### 方法

- `$message.closeAll`

	- 描述：隐藏当前所有的消息条
	- 返回值：无

```js
this.$message.closeAll();
```

- `$message | $message.success | $message.info | $message.warning | $message.error | $message.show`
	- 描述：创建消息条
	- 返回值：`{ close(): void, again(): { close() => void } }`

- `close`
	- 描述：隐藏创建的消息条
	- 返回值：无

- `again`
	- 描述：按照相同参数创建一个新的消息条
	- 返回值：`{ close(): void }`

```js
const bar = this.$message.success('message');
bar.close();	// 隐藏消息条
bar.again();	// 创建一个新的相同的消息条
```

- `save( name: string )`
	- 描述：保存当前函数式配置产生的参数，通过`read`方法可以根据`name`读取所保存的参数
	- 返回值：实例

- `read( name: string )`
	- 描述：根据`name`读取相对应的通过`save`方法保存的配置参数
	- 返回值：实例

```js
this.$message.top().closeButton('关闭').absolute().elevation(10).save('test');
this.$message.read('test').success('custom');
this.$message.read('test').success('custom1');
// 等同于下方
this.$message.top().closeButton('关闭').absolute().elevation(10).success('custom');
this.$message.top().closeButton('关闭').absolute().elevation(10).success('custom1');
```


### 说明

##### 自动设置过渡动画

> 在通过`top/topLeft/topRight/bottom/bottomLeft/bottomRight`设置方向时，并且没有人为设置过渡动画，这时候插件会自动设置对应的过渡动画。

> `Vue.use` 时，参数中设置 `autoTransitionSetting`: `false`可关闭此效果

> 对于已经使用 `transition()`进行了函数配置了，或者通过传参设置了该值的情况下，也不会自动设置过渡动画

|位置|过渡动画|
|:--:|:--:|
|`top`|`scroll-y`
|`bottom`|`scroll-y-reverse`
|`topLeft/bottomLeft`|`slide-y`
|`topRight/bottomRight`|`slide-y-reverse`

##### marginTop 过渡效果说明

> 在有多个消息条时，插件通过设置`marginTop`将消息条与消息条隔开，并通过内置的 CSS `margin-top-animation`对`marginTop`简单的做了一个过渡效果，使消息条消失时其余的消息条会有一个平移的效果。

> 如果不想要这个效果或者想自定义效果，`Vue.use`注册本插件时通过设置参数`class`即可，该参数说明见下方配置项相关中的表格。

##### 配置项相关

- 配置项优先级

> `$message(option)`传入的参数 **>** 函数式配置产生的参数 **>** 插件内置默认参数 **>** `Vue.use`时传入的参数

- 插件内置默认参数

|参数名|参数值|
|:--:|:--:|
|top|`true`|
|bottom|`false`|
|left|`false`
|right|`false`
|timeout|`3000`

> 下方几个属性为插件的属性，非官方组件的属性

- 只能在 `Vue.use` 时使用

|参数名|类型|默认值|描述|
|:--:|:--:|:--:|:--:
|`appendTo`|string \| Element|`undefined`|指定消息条渲染在哪个节点下，默认会选择`.v-application/#app/body`，如果都获取不到则会放到根节点下（没有渲染在`v-app`组件下会影响部分样式）
|`presetIcon`|{[messageType: string]: string}|`undefined`|预设icon (0.2.4新增)

- `Vue.use`时与`$message(option)`时都支持

|参数名|类型|默认值|描述|
|:--:|:--:|:--:|:--:
|`autoRemove`|boolean|`true`|消息条隐藏后是否从树中移除
|`closeButtonContent`|string \| VNode|`""`|消息条取消按钮的文案
|`offsetTop`|number|`10`|消息条与消息条之间的间隔
|`class`|string \| string[]|`undefined`|每个消息条的类名，传空字符串或空数组可覆盖默认的`margin-top-animation`
|`autoTransitionSetting`|boolean|`true`|未手动设置过渡动画时，是否自动根据对应位置设置不同效果的过渡动画
|`message`|string \| VNode|`undefined`|消息条内容(`Vue.use`时设置此值可作为消息条内容的默认值)
|`messageIcon`|string \| VNode|`undefined`|指定消息条内容的字体图标（0.2.3新增）

> 函数式配置具体都能配置哪些参数，可以去看官方文档该组件的参数：https://vuetifyjs.com/zh-Hans/components/snackbars/

> 不过查看项目内的 TS 文件的话是最准确的
