var isMouseDown, instance, width, height, top, left, saturation, lightness;
var windowTop = 0

function setPostion(x, y) {
	if (instance) {
		instance.selectComponent('.slider-block').setStyle({
			left: x - 8 + 'px',
			top:y - 8 + 'px'
		})
	}
}

function setWindowTop(num = 0) {
	windowTop = num
}

function touchstart(e, ins) {
	//解决往上冒泡的问题
	instance = ins
	ins.callMethod('firstTouch')
	isMouseDown = true
	var x = e.touches[0].clientX
	var y = e.touches[0].clientY
	var rect = e.instance.getBoundingClientRect()
	width = rect.width
	height = rect.height
	top = rect.top - windowTop
	left = rect.left
	//获取相对坐标
	x = x - left
	y = y - top
	//修正滑块超出边界
	x = x >= width ? width : x <= 0 ? 0 : x
	y = y >= height ? height : y <= 0 ? 0 : y
	//计算饱和度和亮度
	saturation = parseInt((x / width) * 100);
	lightness = parseInt((1 - y / height) * 100);
	//设置滑块位置
	setPostion(x, y)
}

function touchmove(e, ins) {
	if (!isMouseDown) return;
	var x = e.touches[0].clientX
	var y = e.touches[0].clientY

	//获取相对坐标
	x = x - left
	y = y - top

	//修正滑块超出边界
	x = x > width ? width : x < 0 ? 0 : x
	y = y > height ? height : y < 0 ? 0 : y

	//计算饱和度和亮度
	saturation = parseInt((x / width) * 100);
	lightness = parseInt((1 - y / height) * 100);
	//设置滑块位置
	setPostion(x, y)
	instance.callMethod('emitEvent', { saturation:saturation, lightness:lightness })
}

function touchend(e, ins) {
	if (!isMouseDown) return;

	isMouseDown = false
	instance.callMethod('emitEvent', { saturation:saturation, lightness:lightness })
}


export default {
	touchstart:touchstart,
	touchmove:touchmove,
	touchend:touchend,
	setPostion:setPostion,
	setWindowTop:setWindowTop
}