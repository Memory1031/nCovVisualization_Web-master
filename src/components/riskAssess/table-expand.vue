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
                            if(params.name == "每百万人现存感染人数") {
                                ans += "每百万人现存感染人数: " + params.data.remainConfirm + "</br>"
                                ans += "排名: " + params.data.remainConfirmRank + "</br>"
                                ans += "得分: " + params.data.remainScore
                            }else if(params.name == '现存感染人数'){
                                ans += "现存感染人数: " + params.data.remainCount + "</br>"
                                ans += "排名: " + params.data.remainCountRank + "</br>"
                                ans += "得分: " + params.data.remainCountScore
                            }else{
                                ans += "近十四日新增感染人数: " + params.data.growth + "</br>"
                                ans += "排名: " + params.data.growthRank + "</br>"
                                ans += "得分: " + params.data.growthScore
                            }
                            return ans;
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['每百万人现存感染人数', '现存感染人数', '近十四日新增感染人数']
                    },
                    series: [
                        {
                            name: '具体参数',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {value: 30, name: '每百万人现存感染人数', remainConfirm: this.row.remainConfirm, remainConfirmRank: this.row.remainConfirmRank, remainScore: this.row.remainScore},
                                {value: 30, name: '现存感染人数', remainCount: this.row.remainCount, remainCountRank: this.row.remainCountRank, remainCountScore: this.row.remainCountScore},
                                {value: 40, name: '近十四日新增感染人数', growth: this.row.growth, growthRank: this.row.growthRank, growthScore: this.row.growthScore},
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
