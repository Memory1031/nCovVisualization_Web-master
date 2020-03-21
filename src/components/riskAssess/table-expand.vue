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
            init(){
                let myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    title: {
                        text: '地级市/区风险评估',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            let ans = "具体参数</br>"
                            if(params.name == "现存感染人数") {
                                ans += "每百万人现存感染人数: " + params.data.remainConfirm + "</br>"
                                ans += "排名: " + params.data.remainConfirmRank + "</br>"
                                ans += "得分: " + params.data.remainScore
                            }else if(params.name == '死亡率'){
                                ans += "死亡率: " + params.data.dead + "</br>"
                                ans += "排名: " + params.data.deadRank + "</br>"
                                ans += "得分: " + params.data.deadScore
                            }else{
                                ans += "近三日增速: " + params.data.growth + "</br>"
                                ans += "排名: " + params.data.growthRank + "</br>"
                                ans += "得分: " + params.data.growthScore
                            }
                            return ans;
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['现存感染人数', '死亡率', '近三日增速']
                    },
                    series: [
                        {
                            name: '具体参数',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {value: 50, name: '现存感染人数', remainConfirm: this.row.remainConfirm, remainConfirmRank: this.row.remainConfirmRank, remainScore: this.row.remainScore},
                                {value: 20, name: '死亡率', dead: this.row.dead, deadRank: this.row.deadRank, deadScore: this.row.deadScore},
                                {value: 30, name: '近三日增速', growth: this.row.growth, growthRank: this.row.growthRank, growthScore: this.row.growthScore},
                            ],
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
            }
        }
    };
</script>
