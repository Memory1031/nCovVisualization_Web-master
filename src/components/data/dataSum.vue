<template>
  <div style="margin-left: 2vw; margin-top: 2vh">
    <Row>
      <Col span="12">
        <Card style="width: 39vw; height: 80vh">
          <div id="myChart1" ref="myChart1" :style="{width: '38vw', height: '70vh'}"></div>
        </Card>
      </Col>
      <Col span="12">
        <Card style="width: 39vw; height: 80vh">
          <div id="myChart2" ref="myChart2" :style="{width: '38vw', height: '60vh'}"></div>
        </Card>
      </Col>
    </Row>
  </div>

</template>

<script>
    import axios from 'axios';
    export default {
        name: "dataSum",
        data(){
            return{

            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init(){
                let date = new Date();
                let nowTime = ""
                if(date.getHours() < 10){
                    nowTime = "0"
                }
                nowTime += date.getHours() + ":";
                if(date.getMinutes() < 10){
                    nowTime += "0"
                }
                nowTime += date.getHours() + ":"
                if(date.getSeconds() < 10){
                    nowTime += "0"
                }
                nowTime += date.getSeconds();
                let myChart1 = this.$echarts.init(document.getElementById("myChart1"));
                myChart1.setOption({
                    title: {
                        text: "今日新增数据量（至 " + nowTime + " 为止）",
                        left: 'left'
                    },
                    tooltip: {
                        formatter: function(params){
                            // console.log(params.data)
                            return params.data.name + "： " + params.data.value + "条";
                        }
                    },
                    series: [
                        {
                            name: '今日共获取数据量',
                            type: 'gauge',
                            detail: {formatter: '{value}条'},
                            data: []
                        }
                    ]
                })
                let myChart2 = this.$echarts.init(document.getElementById("myChart2"));
                myChart2.setOption( {
                    title: {
                        text: '数据构成',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['省/市实时疫情数据', '境外输入']
                    },
                    series: [
                        {
                            name: '数据组成',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
                myChart2.showLoading();
                axios({
                    url: apiRoot + '/map/statistic',
                    method: 'get'
                }).then(res => {
                    if(res.data.code == 200){
                        console.log(res.data.data.sumNumber);
                        myChart1.setOption({
                            series: {
                                data: [{value: res.data.data.sumNumber, name: '今日获取数据量'}]
                            }
                        })
                        myChart2.hideLoading();
                        myChart2.setOption({
                            series: {
                                data: [
                                    {value: res.data.data.covDate, name: '省/市实时疫情数据'},
                                    {value: res.data.data.abroadInput, name: '境外输入'}
                                ]
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'dataSum';
</style>
