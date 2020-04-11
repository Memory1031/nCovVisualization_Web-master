<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
  .hr_extend{
    margin-top: 10px;
    margin-bottom: 10px;
    color: #d7dde4;
  }
</style>
<template>
  <div>
    <Card style="font-size: 15px">
      <Carousel v-model="index">
        <CarouselItem>
          <div id="myChart" :style="{width: '60vw', height: '400px'}"></div>
        </CarouselItem>
        <CarouselItem>
          <div id="myChart1" :style="{width: '60vw', height: '400px'}"></div>
        </CarouselItem>
      </Carousel>

    </Card>
  </div>
</template>
<script>
    import axios from 'axios'

    export default {
        props: {
            row: Object
        },
        watch: {
            row(){
                this.init()
            }
        },
        data(){
            return{
                cityName: '',
                index: 0,
                date: [],
                totalConfirm: [],
                remainConfirm: [],
                totalDead: [],
                totalCure: [],
                deadRate: [],
                cureRate: []
            }
        },
        mounted(){
            this.init();
        },
        methods:{
            toPoint(percent){
                let str=percent.replace("%","");
                return str;
            },
            init(){
                this.date = []
                this.totalConfirm = []
                this.remainConfirm = []
                this.totalDead= []
                this.totalCure= []
                this.deadRate= []
                this.cureRate= []
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: 'nCoV-2019 确诊/治愈/死亡'
                    },
                    tooltip: {
                        trigger: 'axis',

                    },
                    legend: {
                        data: ['现有确诊','累计确诊', '治愈人数', '死亡人数']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: [{
                        type: 'value'
                    },{
                        type: 'value'
                    }],
                    series: [
                        {
                            name: '现有确诊',
                            type: 'line',
                            yAxisIndex: 0,
                            // stack: '总量',
                            data: []
                        },
                        {
                            name: '累计确诊',
                            type: 'line',
                            yAxisIndex: 0,
                            // stack: '总量',
                            data: []
                        },
                        {
                            name: '治愈人数',
                            type: 'line',
                            yAxisIndex: 0,
                            // stack: '总量',
                            data: []
                        },
                        {
                            name: '死亡人数',
                            type: 'line',
                            yAxisIndex: 1,
                            // stack: '总量',
                            data: []
                        },
                    ]
                });
                myChart1.setOption({
                    title: {
                        text: 'nCoV-2019 病死率/治愈率'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params) {
                            console.log(params)
                            let date = params[0].name + '</br>'
                            params.forEach((item, index) => {
                                let name = item.seriesName
                                let number = item.data + '%'
                                date = date + name + ": " + number + '</br>'
                            })
                            return date
                        }
                    },
                    legend: {
                        data: ['治愈率','病死率']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            // magicType: {show: true, type: ['tiled', 'stack']},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '治愈率',
                            type: 'line',
                            // stack: '总量',
                            label: {
                                normal: {
                                    position: 'insideRight',
                                    formatter: '{c}%'
                                },
                            },
                            data: []
                        },
                        {
                            name: '病死率',
                            type: 'line',
                            // stack: '总量',
                            label: {
                                normal: {
                                    position: 'insideRight',
                                    formatter: '{c}%'
                                },
                            },
                            data: []
                        },
                    ]
                });
                myChart.showLoading();
                myChart1.showLoading();
                this.cityName = this.row.areaname
                // console.log(this.cityName)
                axios({
                    url: apiRoot + '/epidemic/allDateInfo?name=' + this.cityName,
                    method:'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item,index) => {
                            if(this.date.length != res.data.data.length){
                                this.date.push(item.date.slice(5))
                                this.totalConfirm.push(item.totalconfirm)
                                this.totalDead.push(item.totaldead)
                                this.totalCure.push(item.totalheal)
                                this.deadRate.push(this.toPoint(item.mortality))
                                this.cureRate.push(this.toPoint(item.cureRate))
                                this.remainConfirm.push(item.remainConfirm)
                            }
                        })
                        myChart.hideLoading();
                        myChart.setOption({
                            xAxis: {
                                data: this.date
                            },
                            series: [{
                                name: '累计确诊',
                                data: this.totalConfirm
                            },{
                                name: '治愈人数',
                                data: this.totalCure
                            },{
                                name: '死亡人数',
                                data: this.totalDead
                            },{
                                name: '现有确诊',
                                data: this.remainConfirm
                            }]
                        })
                        myChart1.hideLoading()
                        myChart1.setOption({
                            xAxis: {
                                data: this.date
                            },
                            series: [{
                                name: '病死率',
                                data: this.deadRate
                            },{
                                name: '治愈率',
                                data: this.cureRate
                            }]
                        })
                    }else{
                        this.$Message.error(res.data.message)
                    }
                    // console.log(this.totalConfirm)
                }).catch((err) => {
                    this.$Message.error(err)
                })

            }
        }
    };
</script>
