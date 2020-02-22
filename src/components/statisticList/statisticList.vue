<template>
  <div>
    <Row>
      <div class="button">
        <DatePicker type="date" size="large" :value="selectedDate" @on-change="changeDate"
                    :options="options" placeholder="选择日期" style="width: 200px"></DatePicker>
        <Input size="large" placeholder="输入地级市名称（选填）"
               style="width: 250px" clearable
               v-model="cityName"></Input>
        <Button type="success" class="refresh_button" @click="searchForApply">筛选</Button>
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="当前没有会议室申请"
        stripe border
        :loading="loading"
        height="700"
        :columns="columns" :data="data"></Table>
    </Row>
  </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'statisticList',
        data() {
            return{
                loading: false,
                cityName: '',
                yesterday: new Date(new Date().setDate(new Date().getDate() - 1)),
                selectedDate: '',
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                columns: [
                    {
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '省/直辖市',
                        key: 'provincename',
                        align: 'center',
                        width: 200,
                        tooltip: true
                    },
                    {
                        title: "城市名",
                        key: 'cityname',
                        align: 'center',
                        width: 150,
                        tooltip: true
                    },
                    {
                        title: '确诊人数',
                        key: 'totalconfirm',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '治愈人数',
                        key: 'totalheal',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '死亡人数',
                        key: 'totaldead',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '治愈率',
                        key: 'cureRate',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '死亡率',
                        key: 'mortality',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                    {
                        title: '每百万人感染人数',
                        key: 'confirmInMillion',
                        align: 'center',
                        tooltip: true,
                        sortable: true
                    },
                ],
                data: [],
            }
        },
        mounted() {
            this.selectedDate = this.yesterday.getFullYear() +  "-" + (this.yesterday.getMonth()> 9 ? (this.yesterday.getMonth() + 1) : "0" +
                (this.yesterday.getMonth() + 1)) + "-" +(this.yesterday.getDate()> 9 ? (this.yesterday.getDate()) : "0" + (this.yesterday.getDate()));
            this.init("初始化成功！", '');
            // console.log("上海".indexOf("上海"))
        },
        methods: {
            init(index,type){
                this.data = []
                this.loading = true;
                axios({
                    url: apiRoot + '/epidemic/allAreaInfo?date=' + this.selectedDate,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        res.data.data.forEach((item) => {
                            if(type == '' || item.provincename.indexOf(type) != -1 || item.cityname.indexOf(type) != -1)
                            {
                                this.data.push(item)
                            }
                        })
                        this.$Message.success(index);
                        console.log(this.data)
                        this.loading = false;
                    }else{
                        this.$Message.error(res.data.message)
                        this.loading = false;
                    }
                }).catch((err) => {
                    this.$Message.error("获取数据失败，请检查网络连接")
                    this.loading = false;
                })
            },
            searchForApply() {
                this.init("检索成功！", this.cityName)
            },
            changeDate(newDate, date){
                let date1 = new Date(newDate)
                this.selectedDate = date1.getFullYear() +  "-" + (date1.getMonth()> 9 ? (date1.getMonth() + 1) : "0" +
                    (date1.getMonth() + 1)) + "-" +(date1.getDate()> 9 ? (date1.getDate()) : "0" + (date1.getDate()));
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'statisticList';
</style>

