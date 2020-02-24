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
      <div id="myChart" :style="{width: '60vw', height: '400px'}"></div>
    </Card>
  </div>
</template>
<script>
    import axios from 'axios'

    export default {
        props: {
            row: Object
        },
        data(){
            return{
                cityName: '',
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
            init(){
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: 'nCoV-2019 确诊/治愈/死亡'
                    },
                    tooltip: {
                        trigger: 'axis'
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
                            magicType: {show: true, type: ['tiled', 'stack']},
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
                            name: '现有确诊',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '累计确诊',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '治愈人数',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                        {
                            name: '死亡人数',
                            type: 'line',
                            stack: '总量',
                            data: []
                        },
                    ]
                });
                myChart.showLoading();
                this.cityName = this.row.cityname
                console.log(this.cityName)
                axios({
                    url: apiRoot + '/epidemic/allDateInfo?name=' + this.cityName,
                    method:'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item,index) => {
                            this.date.push(item.date.slice(5))
                            this.totalConfirm.push(item.totalconfirm)
                            this.totalDead.push(item.totaldead)
                            this.totalCure.push(item.totalheal)
                            this.deadRate.push(item.mortality)
                            this.cureRate.push(item.cureRate)
                            this.remainConfirm.push(item.remainConfirm)
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
                    }else{
                        this.$Message.error(res.data.message)
                    }
                    console.log(this.totalConfirm)
                }).catch((err) => {
                    this.$Message.error(err)
                })

            }
        }
    };
</script>
