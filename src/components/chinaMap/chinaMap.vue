<template>
  <div>
    <div class="button">
      <DatePicker type="date" size="large" :value="selectedDate" @on-change="changeDate"
                  :options="options" placeholder="选择日期" style="width: 8vw"></DatePicker>
    </div>
    <div id="myChart" ref="myChart" :style="{width: '60vw', height: '70vh', marginLeft:'5vw', marginTop: '5vh'}"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
      name: 'chinaMap',
      data(){
          return{
              yesterday: new Date(new Date().setDate(new Date().getDate() - 1)),
              selectedDate: '',
              options: {
                  disabledDate (date) {
                      return date && date.valueOf() > Date.now();
                  }
              },
              allDateInfo: []
          }
      },
      watch: {
          selectedDate(oldVal, newVal){
              this.init()
          }
      },
      mounted() {
          this.selectedDate = this.yesterday.getFullYear() +  "-" + (this.yesterday.getMonth()> 9 ? (this.yesterday.getMonth() + 1) : "0" +
              (this.yesterday.getMonth() + 1)) + "-" +(this.yesterday.getDate()> 9 ? (this.yesterday.getDate()) : "0" + (this.yesterday.getDate()));
          this.init();
      },
      methods: {
          init() {
              let myChart = this.$echarts.init(document.getElementById('myChart'))
              // myChart.showLoading()
              myChart.setOption({ // 进行相关配置
                  title: {
                      text: '中国新型冠状病毒患病人数分布图',
                      color: '#fff',
                      x: 'center',
                  },
                  toolbox: {
                      show: true,
                      orient: 'vertical',
                      left: 'right',
                      top: 'center',
                      feature: {
                          dataView: {readOnly: false},
                          restore: {},
                          saveAsImage: {}
                      }
                  },
                  visualMap: {
                      min: 0, //最小值
                      max: 3000, //最大值
                      realtime: false,
                      calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
                      inRange: {
                          color: ['rgb(244, 208, 0)', 'rgb(229, 131, 8)', 'rgb(220, 87, 18)'] //颜色
                      },
                      textStyle: {
                          color: '#fff'
                      },
                  },
                  // 提示框，鼠标移入
                  tooltip: {
                      show: true, //鼠标移入是否触发数据
                      trigger: 'item', //触发方式
                      formatter: function (params) {
                          // console.log(params)
                          if (params.data == undefined) {
                              return params.name + ' 患病人数：缺少该地区患病人数数据'
                          } else {
                              return params.name + ' 患病人数：' + params.data.value
                          }
                      }
                  },
                  //配置地图的数据，并且显示
                  series: [
                      {
                          name: '地图',
                          type: 'map',  //地图种类
                          map: 'china', //地图类型。
                          zoom: 1,
                          data: [],
                          label: {  //图形上的文本标签，可用于说明图形的一些数据信息
                              show: true,
                          },
                      }
                  ],
              })
              myChart.showLoading();
              axios({
                  url: apiRoot + '/map/dateInfo',
                  method: 'get'
              }).then(res => {
                  if(res.data.code == 200){
                      res.data.data.forEach(item => {
                          this.allDateInfo.push(item)
                          if(new Date(item.date).getTime() == new Date(this.selectedDate).getTime()){
                              let dataList = []
                              item.provinceInfoList.forEach(item2 => {
                                  if(item2.name=='黑龙江省' || item2.name == '内蒙古自治区'){
                                      dataList.push({
                                          name: item2.name=item2.name.slice(0,3),
                                          value: item2.confirm
                                      })
                                  }else
                                  dataList.push({
                                      name: item2.name=item2.name.slice(0,2),
                                      value: item2.confirm
                                  })
                              })
                              myChart.hideLoading()
                              myChart.setOption({
                                  series: {
                                      data: dataList
                                  }
                              })
                          }
                      })

                  }
              })
          },
          changeDate(newDate, date){
              let date1 = new Date(newDate)
              this.selectedDate = date1.getFullYear() +  "-" + (date1.getMonth()> 9 ? (date1.getMonth() + 1) : "0" +
                  (date1.getMonth() + 1)) + "-" +(date1.getDate()> 9 ? (date1.getDate()) : "0" + (date1.getDate()));
          },
          chooseDataByDate(){
              if(new Date(item.date).getTime() == new Date(this.selectedDate).getTime()){

              }
          }
      }
  }
</script>

<style lang="scss" scoped>
  @import 'chinaMap';
</style>
