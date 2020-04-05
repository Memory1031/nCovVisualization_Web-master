<template>
  <div>
    <Row>
      <div class="button">
        <Button type="success" class="refresh_button" @click="init(1)">刷新</Button>
      </div>
    </Row>
    <Row>
      <Table size="large"
             no-data-text="无法检索到符合条件的城市信息"
             border
             :loading="loading"
             height="650"
             :columns="columns" :data="nowData"></Table>
      <Page :total="nums" :page-size="10" @on-change="changepage" style="text-align: center"
            show-total show-elevator/>
    </Row>
  </div>
</template>

<script>
  import axios from 'axios';
  import expandRow from "./table-expand.vue";
  export default {
      components: { expandRow },
      data(){
          return{
              columns: [
                  {
                      type: "expand",
                      width: 50,
                      render: (h, params) => {
                          return h(expandRow, {
                              props: {
                                  row: params.row
                              }
                          });
                      }
                  },
                  {
                      title: "起始地",
                      key: "start",
                      align: "center",
                      width: 400
                  },
                  {
                      title: "目的地",
                      key: "end",
                      align: "center",
                      width: 300
                  },
                  {
                      title: "路径",
                      align: "center",
                      children: [
                          {
                              title: "主要交通方式",
                              className: "no_border",
                              render: (h, params) => {
                                  return h("div", [
                                      h("Table", {
                                          props: {
                                              columns: [{ key: "type", align: "center" }],
                                              data: params.row.sumCalResponseList,
                                              "show-header": false,
                                              stripe: false,
                                              border: false
                                          }
                                      })
                                  ]);
                              },
                              align: "center"
                          },
                          {
                              title: "得分(5分制)",
                              className: "no_border",
                              render: (h, params) => {
                                  return h("div", [
                                      h("Table", {
                                          props: {
                                              columns: [{ key: "sumScore", align: "center" }],
                                              data: params.row.sumCalResponseList,
                                              "show-header": false
                                          }
                                      })
                                  ]);
                              },
                              align: "center"
                          }
                      ]
                  }
              ],
              nowData: [],
              nums: 0,
              loading: false,
              pageCurrent: 1,
          }
      },
      mounted(){
          this.init(1)
      },
      methods: {
          init(pageNum){
              this.nowData = []
              this.loading = true;
              axios({
                  url: apiRoot + '/epidemic/getDetails?cur=' + pageNum + "&nums=10",
                  method: 'get'
              }).then(res => {
                  if(res.data.code == 200){
                      this.nums = res.data.data.total;
                      res.data.data.assessmentAllResponseList.forEach(item=>{
                          this.nowData.push(item)
                      })
                      this.$Message.success("第" + pageNum + "页数据获取成功！")
                      this.loading = false;
                  }else{
                      this.$Message.error(res.data.message)
                      this.loading = false;
                  }
              }).catch(err => {
                  this.$Message.error("请检查网络连接！")
                  this.loading = false;
              })
          },
          changepage(index) {
              //需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
              this.init(index)
              //储存当前页
              this.pageCurrent = index;
          },
      }
  }
</script>

<style scoped lang="scss">
  @import "route";
</style>
