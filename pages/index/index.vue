<template>
  <view class="main">
    <view class="head-img">
      <view class="status-box">
        <view class="connect-BL" v-if="BLEConnect">
          <view style="margin-right: 10rpx;">🟢</view> 蓝牙已连接
        </view>
        <view class="connect-BL" v-else @click="connectDevice()">
          <view style="margin-right: 10rpx;">🔴</view> 蓝牙未连接
        </view>
      </view>
      
        <image class="logo" src="/static/SmartMatrix2.png" @click="connectDevice()"></image>
    </view>
    <view class="content">
      <view class="content-title">
        <text style="color: gray;">系统设置</text>
      </view>
      
      <view class="setting-item">
      	<text class="title">亮度设置</text>
        <slider :value="Brightness"
                @change="sliderChange"
                min="1" max="100" block-size="20"
                show-value style="align-self: stretch;"
                :disabled="autoBrightness"
                v-if="!autoBrightness" />
                
        <view class="auto-brightness" >
          <text class="sub-title">自动亮度</text>
          <switch :checked="autoBrightness" @change="changeAuto" style="scale: 80%;" />
        </view>
      </view>
      
      <view class="setting-item">
      	<text class="title">时钟设置</text>
        <view class="color-box">
          <text class="sub-title">时钟颜色</text>
          <view class="color-box-right">
            <text class="sub-title" style="margin-right: 20rpx">{{colorRGB}}</text>
            <view class="color-show" :style="{ backgroundColor: colorShow }"></view>
          </view>
        </view>
        <button class="button" @click="changeColor()">修改颜色</button>
        <view class="color-change-box" v-if="showColorConfig">
          <view class="color-input-box">
            <view style="display: flex; color: #ff0000;" >
              R：<input type="number" maxlength="3" class="color-input" v-model="colorR"/>
            </view>
            <view style="display: flex; color: #00ff00">
              G：<input type="number" maxlength="3" class="color-input" v-model="colorG"/>
            </view>
            <view style="display: flex; color: #0000ff">
              B：<input type="number" maxlength="3" class="color-input" v-model="colorB"/>
            </view>
          </view>
          <button class="button" @click="setColor()">确认</button>
        </view>
        <text class="hint">配置时钟的字体颜色</text>
        <view class="color-box">
          <text class="sub-title">时钟动画</text>
          <switch :checked="animOpen" @change="changeAnim" style="scale: 80%;" />
        </view>
        <text class="hint">开启后将在时钟界面使用翻页动画</text>
      </view>
      
      <view class="setting-item">
      	<text class="title">WLAN 配置</text>
        <view class="wifi-box">
          <text v-if="WifiName">已配置WLAN：{{WifiName}}</text>
          <text v-else class="sub-title">未配置WLAN</text>
          <button class="button" @click="changeWifi()">管理 WLAN</button>
        </view>
        <view class="wifi-set-box" v-if="showWifiConfig">
          <view class="wifi-input-box">
            <view style="display: flex; align-items: center; margin-bottom: 10rpx;">
              <text style="font-size: 28rpx;">SSID：</text>
              <input type="text" v-model="ssid_input" placeholder="请输入SSID" class="wifi-input"/>
            </view>
            <view style="display: flex; align-items: center;">
              <text style="font-size: 28rpx;">密 码：</text>
              <input type="text" v-model="pass_input" class="wifi-input" placeholder="请输入密码" />
            </view>
          </view>
          <button class="button" @click="setWIFI()">确认</button>
        </view>
        <text class="hint">配置WLAN用于设备自动联网校时</text>
      </view>
      
      <view class="setting-item">
      	<text class="title">时间同步</text>
        <button class="button" @click="setTime()">蓝牙对时</button>
        <text class="hint">使用蓝牙同步当前的时间</text>
      </view>
      
     <view class="setting-item">
        <text class="title">生日设置</text>
        <view class="switch-item" >
          <text class="sub-title">开启生日提醒</text>
          <switch :checked="birthdayOpen" @change="changeBirthday" style="scale: 80%;" />
        </view>

        <view class="manage-box" v-if="birthdayOpen">
          <view class="sub-title" v-if="!birthdayDate">未设置生日</view>
          <view class="sub-title" v-else>已设置生日</view>
          <picker mode="date" :value="birthdayDate" @change="birthdayDateChange">
            <view class="sub-title" style="margin-top: 10rpx;">{{ birthdayDate ? birthdayDate : '点击选择日期' }}</view>
          </picker>
        </view>
        <text class="hint">开启该功能后，会在设置的日期当天在时钟日期界面显示生日蛋糕图案并播放音乐</text>
      </view>
      
      <view class="setting-item">
        <text class="title">纪念日设置</text>
        <view class="switch-item" >
          <text class="sub-title">开启纪念日功能</text>
          <switch :checked="anniversaryOpen" @change="changeAnniversary" style="scale: 80%;" />
        </view>
        <view class="manage-box" v-if="anniversaryOpen">
          <view class="ann-box">
            <view class="sub-title">纪念日A：</view>
            <picker mode="date" :value="anniversaryDates[0]" @change="anniversaryDateChange($event, 0)">
              <view class="sub-title">{{ anniversaryDates[0] ? anniversaryDates[0] : '点击选择日期' }}</view>
            </picker>
          </view>

          <view class="ann-box">
            <view class="sub-title">纪念日B：</view>
            <picker mode="date" :value="anniversaryDates[1]" @change="anniversaryDateChange($event, 1)">
              <view class="sub-title">{{ anniversaryDates[1] ? anniversaryDates[1] : '点击选择日期' }}</view>
            </picker>
          </view>
        </view>
        <text class="hint">该功能会开启一个新的界面，显示距离设置的纪念日间隔的天数</text>
       </view>
      
      <view class="setting-item">
      	<text class="title">断开连接</text>
        <button class="button" type="warn" @click="disConnect()">断开连接</button>
        <text class="hint">断开与设备的蓝牙连接</text>
      </view>
      
      <view class="setting-item">
      	<text class="title">重置连接</text>
        <button class="button" type="warn" @click="reConnectBLE()">重置蓝牙连接</button>
        <text class="hint">取消与SmartMatrix的配对，已配置的设置不会删除，后续可重新连接使用</text>
      </view>
      
    </view>
  </view>
</template>

<script setup>
	import { nextTick, onMounted, ref, watchEffect } from 'vue';
  const BLEConnect = ref(false)
  
  const showColorConfig = ref(false)
  const colorR = ref(0)
  const colorG = ref(250)
  const colorB = ref(250)
  const colorRGB = ref("0,250,250")
  const colorShow  = ref(`rgb(${colorR.value},${colorG.value},${colorB.value})`)
  
  const WifiName = ref('')
  const showWifiConfig = ref(false)
  const ssid_input = ref('')
  const pass_input = ref('')
  
  const SERVICE1_UUID       = "14d59bde-ba3d-4477-ba91-3a7d6589b164"   // UART service UUID
  const BRIGHTNESS_UUID     = "be8948de-9de8-4736-9da8-8a8169265a0e"
  const COLOR_UUID          = "515ced63-935b-48f8-8087-4b93e2e64f88"
  const ANNIVERSARY_UUID    = "e56b3238-0af0-4502-82ad-473dc6f3d9f9"
  const BIRTHDAY_UUID       = "0ceae7bf-16ed-46f5-b6c3-17dc8439d574"
  const WIFI_UUID           = "da75e597-b36a-444c-b771-9b058fb1fcd8"
  const ANIM_UUID           = "8e952b12-dd4e-4c78-8bc6-810dc018c22b"
  
  const SERVICE2_UUID       = "5738a36e-8e61-48cf-ad73-06fce0d5843d"   // UART service UUID
  const UUID_RX             = "836a72f2-c6c7-44c9-b0ea-ce09cc23038f"   //通用接收特性
  const UUID_TX             = "a0ea1b56-2f4d-464c-8de8-d523fbb9b284"   //通用发送特性
  
  const Brightness = ref(40)
  const autoBrightness = ref(false)
  const anniversaryOpen = ref(false)
  const birthdayOpen = ref(false)
  const animOpen = ref(false)
  
  const birthdayTimestamp = ref(0)
  const anniversaryTimestamp = ref([])
  const birthdayDate = ref('')
  const anniversaryDates = ref([])
  
  
  let connectedDevice = uni.getStorageSync("connectedDevice") || {}
  let deviceId = connectedDevice.deviceId
  let listenedConnectionChange = false
  // deviceId = true
  
  if (!deviceId){
    uni.reLaunch({
      url: '/pages/connect/connect'
    })
  } else{
    checkBLE()
    if (!BLEConnect){
      connectDevice()
    }
  }
  
  function initBLE() {
    return new Promise((resolve, reject) => {
      uni.openBluetoothAdapter({
        success(res) {
            console.log('初始化蓝牙成功')
            console.log(res)
            resolve(res)
        },
        fail(err) {
          uni.showModal({
              title: '',
              content: '蓝牙初始化失败，请确认是否开启蓝牙',
              showCancel: false,
          });
          console.log('初始化蓝牙失败')
          console.error(err)
          if (err.errCode === 10001) {
              uni.onBluetoothAdapterStateChange(
                  function (res) {
                      if (res.available) {
                          resolve(initBLE())
                      }
                  }
              )
          } else {
              reject(err)
          }
        }
      })
    })
  }
  
  function checkBLE(){
    uni.getConnectedBluetoothDevices({
      success(res) {
        console.log(res)
        if (res.devices[0]){
          BLEConnect.value = true
          initMessage()
          getSettings()
        } else {
          BLEConnect.value = false
          connectDevice()
        }
      },
      fail(err) {
        console.error(err)
        BLEConnect.value = false
        if (err.errCode === 10000){
          initBLE().then(() => {
            checkBLE()
          })
        }
      }
    })
  }
  
  function connectDevice(){
    if (BLEConnect.value){
      return
    }
    uni.showLoading({
      title: '连接中...',
    })
    uni.createBLEConnection({
      deviceId,
      timeout: 5000,
      success(res) {
        console.log('连接成功')
        console.log(res)
        BLEConnect.value = true
        uni.showToast({
          title: '连接成功',
          icon: 'success',
        })
        initMessage()
        setTime()
        getSettings()
        listenConnectionChange()
      },
      fail(err) {
        console.log('连接失败')
        console.error(err)
        BLEConnect.value = false
        uni.showModal({
          title: '',
          content: '连接失败，请检查设备的蓝牙状态',
          showCancel: false
        })
      },
      complete(){
        uni.hideLoading()
      }
    })
  }
  
  function listenConnectionChange(){
    if (listenedConnectionChange){
      return
    }
    uni.onBLEConnectionStateChange(function (res) {
      console.log(res)
      if (!res.connected) {
        BLEConnect.value = false
        uni.showModal({
          title: '',
          content: '设备连接已断开',
          showCancel: false,
        });
      }
    })
    listenedConnectionChange = true
  }
  
  function getSettings(){
    getBrightness()
    nextTick(() => {
      getColor()
    })
    nextTick(() => {
      getAnim()
    })
    nextTick(() => {
      getWIFI()
    })
    nextTick(() => {
      getAnniversary()
    })
    nextTick(() => {
      getBirthday()
    })
  }
  
  // ArrayBuffer转字符串
  function ab2hex(buffer) {
      return String.fromCharCode.apply(null, new Uint8Array(buffer))
  }
  
  // 字符串转ArrayBuffer
  function str2ab(str) {
    // 首先将字符串转为16进制
    let val = ""
    for (let i = 0; i < str.length; i++) {
      if (val === '') {
        val = str.charCodeAt(i).toString(16)
      } else {
        val += ',' + str.charCodeAt(i).toString(16)
      }
    }
    // 将16进制转化为ArrayBuffer
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  }
  
  // 初始化蓝牙通讯
  function initMessage(){
    uni.notifyBLECharacteristicValueChange({
      state: true,    // 启用 notify 功能
      deviceId,       // 设备ID
      serviceId: SERVICE2_UUID,    //服务ID
      characteristicId: UUID_TX,   //特征值ID
      success(res) {
        uni.onBLECharacteristicValueChange(function (res) {
          let charId = res.characteristicId.toLocaleLowerCase()
          let rValue = ab2hex(res.value)

          console.log(charId)
          switch (charId){
            case UUID_TX:
              console.log('收到消息', rValue)
              if (rValue === "needTime"){
                setTime()
              } else if (rValue === "Brightness"){
                getBrightness()
              } else if (rValue === "Color"){
                getColor()
              } else if (rValue === "WiFi"){
                getWIFI()
              } else if (rValue === "Anniversary"){
                getAnniversary()
              } else if (rValue === "Birthday"){
                getBirthday()
              }
              break
              
            case BRIGHTNESS_UUID:
              try{
                if (rValue === "AUTO"){
                  autoBrightness.value = true
                } else {
                  Brightness.value = rValue
                  autoBrightness.value = false
                }
              }catch{
                uni.showToast({
                  title: '获取亮度配置失败',
                  icon: 'none'
                })
              }
              break
            case COLOR_UUID:
              try{
                colorRGB.value = rValue
                let colorArray = colorRGB.value.split(",")
                colorR.vaue = colorArray[0]
                colorG.value = colorArray[1]
                colorB.value = colorArray[2]
                colorShow.value = `rgb(${colorR.value},${colorG.value},${colorB.value})`
              }catch{
                uni.showToast({
                  title: '获取颜色配置失败',
                  icon: 'none'
                })
              }
              
              break
            case WIFI_UUID:
              try{
                let res = rValue.split("|")
                ssid_input.value = res[0]
                pass_input.value = res[1]
                WifiName.value = ssid_input.value
              }catch{
                uni.showToast({
                  title: '获取WIFI配置失败',
                  icon: 'none'
                })
              }
              
              break
            case ANNIVERSARY_UUID:
              try{
                let res = rValue.split("|")
                anniversaryOpen.value = res[0] === "1"
                let dates = res[1].split(",")
                anniversaryTimestamp.value[0] = dates[0]
                anniversaryTimestamp.value[1] = dates[1]
                anniversaryDates.value[0] = new Date(dates[0] * 1000 + 8*60*60*1000 ).toISOString().split('T')[0]
                anniversaryDates.value[1] = new Date(dates[1] * 1000 + 8*60*60*1000 ).toISOString().split('T')[0]
              }catch{
                uni.showToast({
                  title: '获取纪念日配置失败',
                  icon: 'none'
                })
              }
              break
            case BIRTHDAY_UUID:
              try{
                let res = rValue.split("|")
                birthdayOpen.value = res[0] === "1"
                birthdayTimestamp.value = res[1]
                let date = new Date(res[1] * 1000 + 8*60*60*1000)
                birthdayDate.value = date.toISOString().split("T")[0]
              }catch{
                uni.showToast({
                  title: '获取生日配置失败',
                  icon: 'none'
                })
              }
              break
            case ANIM_UUID:
              try{
                animOpen.value = rValue === "true"
              }catch{
                uni.showToast({
                  title: '获取动画配置失败',
                  icon: 'none'
                })
              }
              break
          }
          
        })
      }
    })
  }
  
  // 发送消息
  function sendMessage(msg){
    uni.writeBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE2_UUID,
      characteristicId: UUID_RX,
      // 这里的value是ArrayBuffer类型
      value: str2ab(msg),
      success(res) {
        console.log('发送成功', res)
      },
      fail(err) {
        console.error(err)
        uni.showToast({
          title: '配置失败',
          icon: 'none'
        })
      }
    })
  }
  
  function setTime(){
    if (!BLEConnect.value){
      uni.showToast({
        title: '设备未连接',
        icon: 'none'
      })
      return
    }
    let now = new Date()
    let timestamp = Math.floor(now.getTime() / 1000) + 1    //蓝牙传输有延迟，因此时间戳加1
    sendMessage("T" + timestamp.toString())
    uni.showToast({
      title: '时间已发送',
      icon: 'none'
    })
  }
  
  function setBrightness(brightness) {
    uni.writeBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: BRIGHTNESS_UUID,
      value: str2ab(brightness),
      success(res) {
        console.log('亮度设置成功', res)
      },
      fail(err) {
        uni.showToast({
          title: '配置失败',
          icon: 'none',
        })
        console.error(err)
      }
    })
  }
  
  function getBrightness(){
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: BRIGHTNESS_UUID,
      success(res) {
        console.log('亮度读取成功', res)
      },
      fail(err) {
        console.error(err)
      }
    })
  }
  
  function setColor() {
    let color = `${colorR.value},${colorG.value},${colorB.value}`
    uni.writeBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: COLOR_UUID,
      value: str2ab(color),
      success(res) {
        uni.showToast({
          title: '时钟颜色配置成功',
          icon: 'success',
        })
        colorRGB.value = color
        colorShow.value = `rgb(${colorR.value},${colorG.value},${colorB.value})`
        showColorConfig.value = false
        console.log('时钟颜色设置成功', res)
      },
      fail(err) {
        uni.showToast({
          title: '配置失败',
          icon: 'none',
        })
        console.error(err)
      }
    })
  }
  
  function getColor(){
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: COLOR_UUID,
      success(res) {
        console.log('时钟颜色读取成功', res)
      },
      fail(err) {
        console.error(err)
      }
    })
  }
  
  function setWIFI() {
    let wifi = ssid_input.value + "|" + pass_input.value
    uni.writeBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: WIFI_UUID,
      value: str2ab(wifi),
      success(res) {
        uni.showToast({
          title: 'WIFI配置成功',
          icon: 'success',
        })
        WifiName.value = ssid_input.value
        showWifiConfig.value = false
        console.log('WiFi设置成功', res)
      },
      fail(err) {
        uni.showToast({
          title: 'WIFI配置失败',
          icon: 'none',
        })
        console.error(err)
      }
    })
  }
  
  function getWIFI(){
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: WIFI_UUID,
      success(res) {
        console.log('WIFI读取成功', res)
      },
      fail(err) {
        console.error(err)
      }
    })
  }
  
  function setAnniversary(){
    let anniversary = `${anniversaryOpen.value ? 1 : 0}|${anniversaryTimestamp.value[0]},${anniversaryTimestamp.value[1]}`
    uni.writeBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: ANNIVERSARY_UUID,
      value: str2ab(anniversary),
      success(res) {
        uni.showToast({
          title: '纪念日配置成功',
          icon: 'none',
        })
        console.log('纪念日设置成功', res)
      },
      fail(err) {
        uni.showToast({
          title: '纪念日配置失败',
          icon: 'none',
        })
        console.error(err)
      }
    })
  }
  
  function getAnniversary(){
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: ANNIVERSARY_UUID,
      success(res) {
        console.log('纪念日读取成功', res)
      },
      fail(err) {
        console.error(err)
      }
    })
  }
  
  function setBirtyday(){
    let birthday = `${birthdayOpen.value ? 1 : 0}|${birthdayTimestamp.value}`
    uni.writeBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: BIRTHDAY_UUID,
      value: str2ab(birthday),
      success(res) {
        uni.showToast({
          title: '生日配置成功',
          icon: 'none',
        })
        console.log('生日设置成功', res)
      },
      fail(err) {
        uni.showToast({
          title: '生日配置失败',
          icon: 'none',
        })
        console.error(err)
      }
    })
  }
  
  function getBirthday(){
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: BIRTHDAY_UUID,
      success(res) {
        console.log('生日读取成功', res)
      },
      fail(err) {
        console.error(err)
      }
    })
  }
  
  function setAnim(){
    uni.writeBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: ANIM_UUID,
      value: str2ab(animOpen.value ? "true" : "false"),
      success(res) {
        console.log('时钟动画设置成功', res)
      },
      fail(err) {
        uni.showToast({
          title: '配置失败',
          icon: 'none',
        })
        console.error(err)
      }
    })
  }
  
  function getAnim(){
    uni.readBLECharacteristicValue({
      deviceId,
      serviceId: SERVICE1_UUID,
      characteristicId: ANIM_UUID,
      success(res) {
        console.log('时钟动画读取成功', res)
      },
      fail(err) {
        console.error(err)
      }
    })
  }
  
  function disConnect(){
    uni.closeBLEConnection({
      deviceId,
    })
    BLEConnect.value = false
  }
  
  function reConnectBLE(){
    try{
      uni.closeBluetoothAdapter()
    }catch(e){
      console.log(e)
    }
    
    BLEConnect.value = false
    uni.removeStorageSync('connectedDevice')
    uni.reLaunch({
      url: '/pages/connect/connect'
    })
  }
  
  // 处理控件部分
  function sliderChange(e){
    console.log(e.detail.value)
    Brightness.value = e.detail.value
    let brightness = e.detail.value.toString()
    if (e.detail.value > 0){
      setBrightness(brightness)
    }
  }
  
  function changeAuto(e){
    autoBrightness.value = e.detail.value
    if (e.detail.value){
      setBrightness("AUTO")
    } else{
      setBrightness(Brightness.value.toString())
    }
  }
  
  function changeColor(){
    showColorConfig.value = !showColorConfig.value
  }
  
  function changeAnim(e){
    animOpen.value = e.detail.value
    setAnim()
  }
  
  function changeWifi(){
    showWifiConfig.value = !showWifiConfig.value
  }
  
  function changeBirthday(){
    birthdayOpen.value = !birthdayOpen.value
    setBirtyday()
  }
  
  function birthdayDateChange(e){
    birthdayDate.value = e.detail.value
    let dateString = birthdayDate.value + 'T00:00:00'
    let date = new Date(dateString)
    birthdayTimestamp.value = Math.floor(date.getTime() / 1000)
    setBirtyday()
    console.log(birthdayTimestamp.value)
  }
  
  function changeAnniversary(){
    anniversaryOpen.value = !anniversaryOpen.value
    setAnniversary()
  }
  
  function anniversaryDateChange(e, index){
    anniversaryDates.value[index] = e.detail.value
    let dateString = anniversaryDates.value[index] + 'T00:00:00'
    let date = new Date(dateString)
    anniversaryTimestamp.value[index] = Math.floor(date.getTime() / 1000)
    setAnniversary()
    console.log(anniversaryTimestamp.value)
  }
  
</script>

<style>
  page{
    background-color: #f9f9f9;
  }
  .head-img{
    height: 25vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .status-box{
    position: absolute;
    top: 20rpx;
    left: 26rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .connect-BL{
    background-color: #fff;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dadada;
    padding: 6rpx 20rpx;
    border-radius: 30rpx;
    box-shadow: 2rpx 2rpx 10rpx rgba(0, 0, 0, 0.1);
  }
  .connect-WLAN{
    margin-left: 10rpx;
    background-color: #fff;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dadada;
    padding: 6rpx 20rpx;
    border-radius: 30rpx;
    box-shadow: 2rpx 2rpx 10rpx rgba(0, 0, 0, 0.1);
  }
	.content {
    background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
    margin: 0 26rpx;
    padding: 0 26rpx;
    border-radius: 36rpx 36rpx 0 0;
    box-shadow: 2rpx 2rpx 10rpx rgba(0, 0, 0, 0.3);
    min-height: 75vh;
	}
  
  .button{
    font-size: 28rpx;
    margin-top: 20rpx;
  }
  .hint{
    font-size: 24rpx;
    color: gray;
    margin-top: 20rpx;
  }
  
  .content-title{
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 20rpx 0;
    border-bottom: 1px solid #dadada;
  }

	.logo {
    margin-top: 50rpx;
		align-self: center;
	}

	.setting-item {
		display: flex;
		justify-content: center;
    align-items: flex-start;
    align-self: stretch;
    flex-direction: column;
    padding: 20rpx 0;
    border-bottom: 1px solid #dadada;
	}
  
  .auto-brightness{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
  }
  
  .color-box{
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
  }
  .color-box-right{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .color-show{
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    margin-right: 20rpx;
  }
  .color-input{
    width: 70rpx;
    border-bottom: 1px solid #dadada;
  }
  .color-change-box{
    margin-top: 20rpx;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
    border: 1px solid #dadada;
    border-radius: 20rpx;
    padding-bottom: 20rpx;
  }
  .color-input-box{
    align-self: stretch;
    padding: 20rpx 70rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
  }
  
  
  .wifi-box{
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    margin-top: 20rpx;
  }
  
  .wifi-set-box{
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f9f9f9;
    border: 1px solid #dadada;
    border-radius: 20rpx;
    padding-bottom: 20rpx;
    margin-top: 20rpx;
  }
  .wifi-input-box{
    /* width: 70%; */
    padding: 20rpx 10rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-top: 20rpx;
  }
  .wifi-input{
    font-size: 28rpx;
    width: 70%;
    border-bottom: 1px solid #dadada;
  }
  
  .switch-item{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
  }
  
  .manage-box{
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .ann-box{
    display: flex;
    align-items: center;
    margin-top: 10rpx;
  }

	.title {
		font-size: 28rpx;
    color: #0055ff;
	}
  
  .sub-title{
    font-size: 28rpx;
    color: black;
  }
</style>
