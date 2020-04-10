<template>
  <div>
    <Row>
      <div class="button">
        <DatePicker type="date" size="large" :value="selectedDate" @on-change="changeDate"
                    :options="options" placeholder="选择日期" style="width: 8vw"></DatePicker>
        <Button type="success" class="refresh_button" @click="searchForApply">筛选</Button>
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="无法检索到符合条件的城市信息"
        stripe border
        :loading="loading"
        height="650" @on-row-click="toggleTableExpand" ref="tableExpand"
        :columns="columns" :data="nowData"></Table>
      <Page :total="data.length" :page-size="10" @on-change="changepage" style="text-align: center"
            show-total show-elevator/>
    </Row>
  </div>
</template>

<script>
    import axios from 'axios'
    import expandRow from './table-expand'

    export default {
        name: 'riskAssess',
        components: {expandRow},
        data() {
            return{
                loading: false,
                loading_nowData: false,
                cityName: '',
                yesterday: new Date(new Date().setDate(new Date().getDate() - 1)),
                selectedDate: '',
                dataCount: 0,//总条数
                pageCurrent: 1,//当前页
                nowData: [],
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                columns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '#',
                        key: 'number',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '省/直辖市',
                        key: 'provincename',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: "城市名",
                        key: 'name',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '总分',
                        key: 'sumScore',
                        align: 'center',
                        tooltip: true,
                    },
                    {
                        title: '排名',
                        key: 'allRank',
                        align: 'center',
                        tooltip: true,
                    },
                ],
                data: [],
            }
        },
        mounted() {
            this.selectedDate = this.yesterday.getFullYear() +  "-" + (this.yesterday.getMonth()> 9 ? (this.yesterday.getMonth() + 1) : "0" +
                (this.yesterday.getMonth() + 1)) + "-" +(this.yesterday.getDate()> 9 ? (this.yesterday.getDate()) : "0" + (this.yesterday.getDate()));
            this.init("初始化成功！");
        },
        methods: {
            init(index){
                this.data = []
                this.loading = true;
                this.loading_nowData = true;
                this.nowData = [];
                axios({
                    url: apiRoot + '/epidemic/impDateInfo?date=' + this.selectedDate,
                    method: 'get'
                }).then((res) => {
                    if(res.data.code == 200){
                        let nowData_full = false;
                        let num = 1
                        res.data.data.forEach((item) => {
                              item.newParams = 'number';
                              item['number'] = num;
                              item['_expanded'] = false
                              num++;
                              this.data.push(item)
                            if(this.data.length == 10){
                                this.nowData = this.data.slice(0, 10);
                                nowData_full = true
                            }
                        })
                        if(nowData_full == false){
                            this.nowData = this.data
                        }
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
                this.init("检索成功！")
            },
            changeDate(newDate, date){
                let date1 = new Date(newDate)
                this.selectedDate = date1.getFullYear() +  "-" + (date1.getMonth()> 9 ? (date1.getMonth() + 1) : "0" +
                    (date1.getMonth() + 1)) + "-" +(date1.getDate()> 9 ? (date1.getDate()) : "0" + (date1.getDate()));
                this.init("刷新成功！");
            },
            changepage(index) {
                //需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
                let _start = (index - 1) * 10;
                //需要显示结束数据的index
                let _end = index * 10;
                //截取需要显示的数据
                this.nowData = this.data.slice(_start, _end);
                //储存当前页
                this.pageCurrent = index;
            },
            toggleTableExpand(row, index) {
                // this.$refs.tableExpand.toggleExpand(index);
                if(this.nowData[index]._expanded == true) {
                    this.nowData[index]._expanded = false
                }
                else {
                    this.nowData[index]._expanded = true
                    this.takeToFalse(index)
                }
            },
            takeToFalse(index){
                this.nowData.forEach((item, index2) => {
                    if(index2 != index){
                        item._expanded = false
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
  @import 'riskAssess';
</style>

