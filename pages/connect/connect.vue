<template>
  <view class="main">
    <view class="welcome-title">
      <text style="font-size: 50rpx; font-weight: bold;">欢迎使用 SmartMatrix</text>
      <text style="font-size: 36rpx; color: gray; margin-top: 20rpx;">首次使用需要进行蓝牙连接</text>
      <text style="font-size: 36rpx; color: gray; margin-top: 6rpx;">请确保设备已经通电并开机</text>
      <text style="font-size: 36rpx; color: gray; margin-top: 6rpx;">并且已打开手机蓝牙</text>
    </view>
    
    <view class="BLE-box">
      <view v-if="!blueDeviceList.length" style="display: flex; flex-direction: column; align-items: center;" >
        <text style="color: gray; margin-bottom: 20rpx;">{{BLEhint}}</text>
        <uni-icons type="refreshempty" size="30" color="gray" @click="initBLE()"></uni-icons>
      </view>
      <scroll-view class="BLE-list" scroll-y v-else>
        <view class="BLE-item" v-for="(item, index) in blueDeviceList" :class="index === currentIndex? 'active':'' " @click="chooseItem(index)">
          <text>设备名称：{{item.name}}</text>
          <text>设备地址：{{item.deviceId}}</text>
        </view>
        <view style="height: 10rpx;"></view>
      </scroll-view>
    </view>
    
    <view class="bottom-bar">
      <button type="primary" @click="connect()">确认连接</button>
    </view>
  </view>
  
</template>

<script setup>
  import { ref } from 'vue'
  
  const currentIndex = ref(-1)
  const blueDeviceList = ref([])
  const currentDevice = ref({})
  const BLEhint = ref('正在初始化蓝牙...')
  
  initBLE()
  
  function chooseItem(index){
    currentIndex.value = index
    currentDevice.value = blueDeviceList.value[index]
    // console.log(index)
  }
  
  function initBLE() {
    uni.openBluetoothAdapter({
        success(res) {
            console.log('初始化蓝牙成功')
            console.log(res)
            BLEhint.value = '正在搜索设备...'
            discovery()
        },
        fail(err) {
          uni.showModal({
            title: '',
            content: '蓝牙初始化失败，请确认是否开启蓝牙',
            showCancel: false,
          });
          console.log('初始化蓝牙失败')
          console.error(err)
          BLEhint.value = '蓝牙初始化失败，请确认是否开启蓝牙'
          if (err.errCode === 10001) {
            uni.onBluetoothAdapterStateChange(
              function (res) {
                  if (res.available) {
                      initBLE()
                  }
              }
            )
          }
        }
    })
  }
  
  function discovery() {
    uni.startBluetoothDevicesDiscovery({
      // services: ["5B8B"],
      success(res) {
          console.log('开始搜索设备')
          console.log(res)
          uni.onBluetoothDeviceFound(found)
      },
      fail(err) {
          console.log('搜索设备失败')
          console.error(err)
      }
    })
  }
  
  function found(res) {
    console.log('发现设备')
    console.log(res)
    if (res.devices[0].name === 'SmartMatrix'){
      if (!blueDeviceList.value.some(device => device.deviceId === res.devices[0].deviceId)) {
        blueDeviceList.value.push(res.devices[0])
      }
    }
  }
  
  function connect(){
    if (currentIndex.value === -1) {
      uni.showModal({
        title: '',
        content: '请选择一个设备',
        showCancel: false,
      });
      return
    }
    uni.showLoading({
      title: '连接中...'
    })
    uni.createBLEConnection({
      deviceId: currentDevice.value.deviceId,
      success(res) {
        console.log('连接成功')
        console.log(res)
        stopDiscovery()
        uni.setStorageSync('connectedDevice', currentDevice.value)
        uni.reLaunch({
          url: '/pages/index/index'
        })
      },
      fail(err) {
        console.log('连接失败')
        console.error(err)
        uni.showModal({
          title: '',
          content: '连接失败，请确认设备是否开机并且在手机蓝牙范围内',
          showCancel: false,
        });
      },
      complete(){
        uni.hideLoading()
      }
      
    })
  }
  
  function stopDiscovery(){
    uni.stopBluetoothDevicesDiscovery({
      success(res) {
        console.log('停止搜索设备')
        console.log(res)
      },
      fail(err) {
        console.log('停止搜索设备失败')
        console.error(err)
      }
    })
  }
  

</script>

<style>
  page{
    background-color: #f9f9f9;
  }
  
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
  }
    
  .welcome-title{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .BLE-box{
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 30vh;
  }

  .BLE-list{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 40vh;
    padding-bottom: 20rpx;
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .BLE-item{
    align-self: stretch;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin: 10rpx;
    margin-top: 20rpx;
    padding: 20rpx;
    border-radius: 20rpx;
    box-shadow: 2rpx 2rpx 10rpx rgba(0, 0, 0, 0.3);
  }
  .active{
    background-color: #f0f0f0;
    border: 1px solid #51aa38;
  }
</style>
