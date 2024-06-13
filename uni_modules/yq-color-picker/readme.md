

## 颜色选择器
> **组件名：yq-color-picker**

### 介绍
本组件采用的调色模式为hsl，可直接输出hex、rgb、hsl格式的颜色字符串，使用方法非常简单。
视图层控制采用了wxs，在APP和小程序上运行也是非常丝滑。
目前仅支持`pc`、`H5`、`App-vue`、`微信小程序`、`支付宝小程序`、`百度小程序`和`QQ小程序`,后续还会继续适合更多平台

### 基本用法

在 ``template`` 中使用组件

```html
<view>
	<yq-color-picker :color="color" @confirm="confirm"></yq-color-picker>
</view>
```

### 通过方法打开选择器

```html
<view>
	<yq-color-picker ref="colorPicker" @confirm="confirm" />
	 <button @click="open">打开选择器</button>
</view>
```

```javascript

export default {
	data() {
		return {};
	},
	methods: {
		open(){
			this.$refs.colorPicker.open();
		},
		confirm(e) {
			console.log(e);
		}
	}
};

```


## API

### ColorPicker Props

|  属性名		|    类型	| 默认值	| 说明																													|
|:-:			|:-:		|:-:	|:-:																													|
| color			| String	|#ff0000| 初始颜色，默认为红色(<font color= #ff0000>#ff0000</font>)，支持hex,rgb,rgba,hsl,hsla格式的字符串														|
| title			| String	|	-	| 自定义标题																												|
| showValue		| Boolean	|true	| 是否显示数值																											|
| disable-istory| Boolean	|false	| 是否禁用历史记录																										|
| disabled		| Boolean	|false	| 是否禁用组件																											|
| preset		| Array		|false	| 预置色卡，默认：['<font color= #B8F1ED>#B8F1ED</font>', '<font color= #F16D7A>#F16D7A</font>', '<font color= #AE716E>#AE716E</font>', '<font color= #C86F67>#C86F67</font>', '<font color= #B7D28D>#B7D28D</font>', '<font color= #D9B8F1>#D9B8F1</font>']，支持hex,rgb,rgba,hsl,hsla格式的字符串	|


### ColorPicker Events

|  事件名		| 说明								|返回值																				|
|:-:			|:-:								|:-:																				|
| @confirm		| 点击确定按钮触发，返回颜色字符串	| 	'#FF0000'或'rgb(255,0,0)'或'hsl(0,100%,50%)'	返回的格式根据当前所选择的模式而定		|

### ColorPicker Methods
|方法名	|说明								|返回值	|
|:-:	|:-:								|:-:	|
|open	|弹出选择器组件						|-		|


