<template>
  <div>
    <Row>
      <Row type="flex" justify="end" class="code-row-bg" style="margin-bottom:10px;">
        <Col span="10" v-if="province=='上海市'" style="text-align:right;position:relative;right:20px">
          <div style="margin-top:10px;margin-right:0px;">
            <v-distpicker
              province="上海市"
              city="上海城区"
              area="宝山区"
              @province="onChangeProvince"
              @area="onChangeArea"
            ></v-distpicker>
            
          </div>
        </Col>
        <Col span="6" v-else style="text-align:right;position:relative;right:-30px">
          <div style="margin-top:10px;margin-right:60px">
            <v-distpicker only-province @province="onChangeProvince" :province="province"></v-distpicker>
          </div>
        </Col>
        <Col span="1.5">
          <Button
            type="success"
            class="refresh_button"
            @click="init(1)"
           style="position:relative;top:10px;right:10px"
          >刷新</Button>
        </Col>
      </Row>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="无法检索到符合条件的城市信息"
        border
        :loading="loading"
        height="650"
        :columns="columns"
        :data="nowData"
      ></Table>
      <Page
        :total="nums"
        :page-size="10"
        @on-change="changepage"
        style="text-align: center"
        show-total
        show-elevator
      />
    </Row>
  </div>
</template>

<script>
import axios from "axios";
import expandRow from "./table-expand.vue";

import VDistpicker from "v-distpicker";
export default {
  components: { expandRow, VDistpicker },
  data() {
    return {
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
      province: "上海市",
      area: "宝山区",
      province2: ""
    };
  },
  mounted() {
    this.init(1);
  },
  methods: {
    onChangeProvince(province) {
      if (province.code != undefined) {
        this.province2 = "";
        this.province = province.value;
        if (this.province != "上海市") {
          let patt = /自治区/;
          let check = false;
          check = patt.test(this.province);
          if (check) {
            if (this.province.search("西藏") != -1) {
              this.province2 = "西藏";
            } else if (this.province.search("内蒙古") != -1) {
              this.province2 = "内蒙古";
            } else if (this.province.search("宁夏") != -1) {
              this.province2 = "宁夏";
            } else if (this.province.search("广西") != -1) {
              this.province2 = "广西";
            } else if (this.province.search("新疆") != -1) {
              this.province2 = "新疆";
            }
          }

          this.area = "";
          this.init(1);
        }
      }
    },
    onChangeArea(area) {
      if (area.code != undefined) {
        this.area = area.value;
        this.init(1);
      }
    },
    sel: function(data) {},
    init(pageNum) {
      this.nowData = [];
      this.loading = true;
      let provinceArea;
      if (this.province2 != "") {
        provinceArea = this.province2 + this.area;
      } else {
        provinceArea = this.province + this.area;
      }
      console.log(provinceArea);
      axios({
        url: apiRoot + "/epidemic/getDetails",
        method: "get",
        params: {
          cur: pageNum,
          nums: 10,
          province: provinceArea
        }
      })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res);
            this.nums = res.data.data.total;
            res.data.data.assessmentAllResponseList.forEach(item => {
              this.nowData.push(item);
            });
            this.$Message.success("第" + pageNum + "页数据获取成功！");
            this.loading = false;
          } else {
            this.$Message.error(res.data.message);
            this.loading = false;
          }
        })
        .catch(err => {
          this.$Message.error("请检查网络连接！");
          this.loading = false;
        });
    },
    changepage(index) {
      //需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
      this.init(index);
      //储存当前页
      this.pageCurrent = index;
    }
  }
};
</script>

<style scoped lang="scss">
@import "route";
</style>
