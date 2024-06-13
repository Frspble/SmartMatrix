var isMouseDown, instance, width, left, distance

function setPostion(x) {
	if (instance) {
		instance.selectComponent('.slider-block').setStyle({
			left: x - 8 + 'px'
		})
	}
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
	left = rect.left
	//获取相对坐标
	x = x - left
	//修正滑块超出边界
	x = x > width ? width : x < 0 ? 0 : x
	//计算出滑块距离比例
	distance = x / width;
	//设置滑块位置
	setPostion(x)
	e.preventDefault()
	e.stopPropagation()
}

function touchmove(e, ins) {
	if (!isMouseDown) return;
	var x = e.touches[0].clientX
	var y = e.touches[0].clientY

	//获取相对坐标
	x = x - left

	//修正滑块超出边界
	x = x > width ? width : x < 0 ? 0 : x

	//计算出滑块距离比例
	distance = x / width;
	//设置滑块位置
	setPostion(x)
	instance.callMethod('emitEvent', { distance: distance })
	e.preventDefault()
	e.stopPropagation()
}

function touchend(e, ins) {
	if (!isMouseDown) return;
	isMouseDown = false
	instance.callMethod('emitEvent', { distance: distance })
	e.preventDefault()
	e.stopPropagation()
}

export default {
	touchstart: touchstart,
	touchmove: touchmove,
	touchend: touchend,
	setPostion: setPostion,
}