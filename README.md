<!-- h1. 中文 -->

<!-- "for English please click":#english -->

# recx.js

这个javascript组件，记录用户在页面上的输入和选择，当用户下一次载入该页面时，还原上次的输入和选择。进而达到降低用户成本，提高用户体验的目的。

具体说来，它能记录用户对下拉菜单 `<select>` 、单选按钮 `<input type="radio">` 、选择框 `<input type="checkbox">` 的选择及各种输入框 `<input>，type不为"radio"、"checkbox"、"submit"、"button"、"hidden"、"image"、"file"或"reset"`、输入区域 `<textarea>` 的值，并在用户下次载入页面时，按照上次记录的值还原用户的选择及输入的值。

支持的浏览器如下，也就是说，目前还在广泛使用的浏览器中，只有IE6\IE7\IE8不支持：

* IE 9+
* Firefox 3+
* Safari 3.2+
* chrome 5+
* iOS 3.2+
* Android 2.1+

<!-- h2. 当前用户 --><!-- * "百度地图":http://map.baidu.com/ --><!-- * "百度团购":http://tuan.baidu.com/ --><!-- * +You -->

## 如何使用?

### 快速上手

在你HTML代码的尾部引入recx.js：

	<script src="recx.js"></script>

<!-- 你也可以使用我们的CDN服务器： -->

<!-- <script src="??????????"></script> -->

或者使用AMD、CMD、Kissy兼容的模块加载器：

	require(['recx'],function(recx){
    	// your code 
	})

接着你为所有要记录的“下拉菜单 `<select>` 、单选按钮 `<input type="radio">` 、选择框 `<input type="checkbox">` 的选择及各种输入框 `<input>，type不为"radio"、"checkbox"、"submit"、"button"、"hidden"、"image"、"file"或"reset"`、输入区域 `<textarea>` ”（我们称它为“可交互元素”，下同）均赋予一个 `id`，如：

	<input id="checkbox_0" type="checkbox"/>

然后加入下面一句代码，即可记录页面中所有区域内上述元素的选择或输入值：

    recx()

### 高级

#### 指定记录的区域

入口函数`recx(wrapperDOM)`的第一个参数 `wrapperDOM` 可以是某个dom元素，或某个dom元素的id的字符串。
可以通过传递需要记录的区域的最外层dom元素或它的id，来指定需要记录的区域：

	recx('wrapper') // 这将记录id为`wrapper`的dom元素内部的所有符合要求的“可交互元素”
	// 或 recx(document.getElementById('wrapper'))

如果要指定记录页面中的多个区域，则通过调用多次使用 `recx()`，传递不同的 `wrapperDOM` 参数来实现：
_注意：不能指定已被指定过的的`wrapperDOM`，或是一个与已被指定过的的`wrapperDOM`有包含或被包含的关系的dom_

	recx('area1')
	recx('area2') // area2与area1不能有包含和被包含关系（即任意一个不能为另一个的父、子节点）

甚至可以将区域限制小到只有某一个“可交互元素”：

	// html:
	<input id="input_0" />
	// js:
	<script>
		recx('input_0') // 指定记录的区域仅为id为`input_0`的input本身
	</script>

_注意：在这种情况下，你不能只指定区域为：一组关联的（`name`值相同的）单选按钮 `<input type="radio">` 中的一个，因为这一组单选按钮共同来决定一个值，只记录其中一个是没有意义的_

	// html:
	<p id="radioGroupP">
    	radio group:<br/>
    	<input id="radio_0" type="radio" name="my_radio" value="value_0">
    	<input id="radio_1" type="radio" name="my_radio" value="value_1">
	</p>
	// js:
	<script>
		recx('radio_1') // 反例，这是不对的，没有意义
		recx('radioGroupP') // 这是对的，因为所有`name`相同的单选按钮都被包裹进去了
	</script>

#### 不记录页面中的某些“可交互元素”

最简单的方法就是不为这些“可交互元素”赋予id，或者将它们的id通过下面的方式加入到忽略id数组。
_注意：对于一组关联的（`name`值相同的）单选按钮 `<input type="radio">` ，你需要将它们每一个 `<input>` 的id都添加进去，或者给每一个 `<input>` 都不赋予id_

	recx(document,{
	    ignoreIds:['select_0','radio_0','radio_1']
	})

#### 自行控制下一次页面载入时“可交互元素”的还原行为

默认情况下，在下一次载入页面时，该组件会将所有符合要求且未被忽略的“可交互元素”赋予上一次的值，你也可以获取这个值来进行其它操作。通过配置一个函数的形式来操作它。如果该配置函数返回true，则继续执行组件原本的设定值操作；如果函数返回值为false，则不继续执行组件原本的设定值操作

	recx(document,{
    	handleSetValueFromCacheFuncs:{
        	'input_0':function(value,wrapperDOM){
            	// this 指向当前dom，本例中即id为input_0的元素
            	// value 当前存储值，如果this是一个<textarea>，请用recx.configs.textareaLineFeedHolder替换回换行符，如value.replace(recx.configs.textareaLineFeedHolder,'\n')
            	//  如果this是一个<input type="radio">，并且它没有指定value值，那么可以通过recx.configs.noValueRadioIndexPrefix获取在所有name相同的<input type="radio">中它的位置，如 value.replace(recx.configs.noValueRadioIndexPrefix,'')
            	//  如果this是一个<input type="checkbox">，并且它没有指定value值，如果他被选中了（this.checked），那么value为1，否则为0
            	// wrapperDOM是初始化时，传入的wrapperDOM参数对应的dom
            	return true // 继续执行组件原本的设定值操作
            	// return false // 不继续执行组件原本的设定值操作
        	}
    	}
	})

#### 修改全局默认配置

可以通过修改`recx.configs`静态方法来修改默认配置。
请注意，需要先修改默认配置，再初始化recx对象实例。

	// 修改示例：
	recx.customConfig({
		oldValueAttributeName:'data-recxoldvalue'
	})

可以修改的默认配置：

字段名 | 默认值 | 说明 
:---|:-----|:-----
noValueRadioIndexPrefix | `'__R_NVRIP__'` | 有一组 `name` 值相同的 `<input type="radio">` ，但当前被选中的radio可能没有 `value` 值，我们就要一个模拟的值——用它在这一组radio中的位置来代替它的值来存储。`noValueRadioIndexPrefix`就是这个假值的前缀。举个例子：如果第三个radio被选中了，我们将`noValueRadioIndexPrefix+'3'`，默认配置下即`__R_NVRIP__2`当做模拟值来存储
oldValueAttributeName | `'data-roldvalue'` | `<input>，type不为"radio"和"checkbox"` 和 `textarea` 必须将旧值存储起来，以便于检查值是否发生了变化。我们将旧制存储到这个dom属性中
textareaLineFeedHolder | `'__R_TLFH_ramdom_769768842_ramdom_'` | textarea的换行符会在与其他字符串连接时丢弃。为了避免这种情况，我们在这之前用这个属性的值将换行符替换到。在还原时再替换回来
getLocalStorageKeySuffix | 一个函数，详见源码 | 对于某个站点的不同页面，用于在localStorage里面存储用户交互值的key是不相同的。这个函数用于根据`location`对象计算出这个key。默认情况下，我们对于单页应用（OPOA，或称为SPA）考虑了`location.hash`部分，对于传统的后端渲染的前端页面，没有考虑`location.hash`部分。可以重写这个函数，函数的参数是`location`对象

#### 在AMD|CMD|Kissy体系中修改全局默认配置

在AMD体系中，由于不清楚recx.js是否已经被加载和配置过，我们建议您将配置项也写成一个AMD模块，例如：

	// 假设路径为 js/recxConfig.js
	define({
		oldValueAttributeName:'data-recxoldvalue'
	})
	
在每次使用recx时

	require(['recx','js/recxConfig'],function(recx,recxConfig){
		recx.customConfig(recxConfig)
		// do sth.
	})

这样能确保只用书写一处配置文件。或者也可以直接修改源代码里24行的configs

### 详细接口

recx对象实例
每当你调用recx()时，如果没有报错，它都会返回一个recx的对象实例，这个对象实例能让你做进一步精细的控制。

#### wrapperDom属性

指向当前recx对象实例的wrapperDom，即使你初始化时的wrapperDom参数传递的是dom的id，也会指向实际的dom。当初始化时传递的wrapperDom参数不合法，则指向document

#### handleSetValueFromCacheFuncs属性

指向当前recx对象实例初始化时配置项里面的handleSetValueFromCacheFuncs对象，如果未设置或不合法，则为 `{}`

#### ignoreIds属性

指向当前recx对象实例初始化时配置项里面的ignoreIds数组，如果未设置或不合法，则为 `[]`

#### selects属性

一般情况下，指向当前recx对象实例wrapperDom内的所有select元素的 [HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection)，当wrapperDom本身即为一个select时，指向只包含该select的长度为1的数组

#### textareas属性

一般情况下，指向当前recx对象实例wrapperDom内的所有textarea元素的 [HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection)，当wrapperDom本身即为一个textarea时，指向只包含该textarea的长度为1的数组

#### inputs属性

一般情况下，指向当前recx对象实例wrapperDom内的所有input元素的 [HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection)，当wrapperDom本身即为一个input时，指向只包含该input的长度为1的数组；_注意，inputs里面可能包含recx组件不关注类型的input（即type为"radio"、"checkbox"、"submit"、"button"、"hidden"、"image"、"file"或"reset"的input）_

#### setValue方法

	var myrecx = recx(wrapperDom,settings)
	myrecx.setValue()

这个方法会在调用入口函数recx()，生成recx对象实例时自动调用一次。它的作用是将缓存储的上一次“可交互元素”的值设置到对应“可交互元素”上。
你也可以在适当的时候手动调用它，这样它会把该recx对象实例所包含的“可交互元素”再次赋值一遍。

#### getKvObj方法

	var myrecx = recx(wrapperDom,settings)
	myrecx.getKvObj()

这个方法返回当前wrapperDom内所有满足监听条件的“可交互元素”的id和当前值。对象结构为：

	{
		id1:value1,
		id2:value2
	}

#### stop方法

	var myrecx = recx(wrapperDom,settings)
	myrecx.stop()

这个方法将会注销掉recx对象，使他不再起任何作用。比如注销掉对对应“可交互元素”的监听。

## License

所有代码遵循 "MIT License":http://www.opensource.org/licenses/mit-license.php 。也就是说你可以自由地做任何你想做的事情。只是不能在代码中移除我的名字。