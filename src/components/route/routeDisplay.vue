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
        @on-row-click="toggleTableExpand"
      ></Table>
      <Page
        :total="nums"
        :page-size="10"
        :current="pageCurrent"
        @on-change="changepage"
        style="text-align: center"
        show-total
        show-elevator
      />
    </Row>
    <Drawer width="380" :closable="false" v-model="modal">
      <p slot="header" style="color:#000;text-align:center;font-size:25px;height:30px">
        <Icon type="ios-information-circle"></Icon>
        <span>多种出行方案疫情评估</span>
      </p>
      <div style="text-align:center;">
        <ul style="list-style-type:none;" class="plans">
          <li v-for="(item,index) in allPlan" :key="index" @click="specifics(item.lines[0],index)">
            <span class="theIndex">{{index+1}}</span>
            <div class="theBackground">
              <p class="traffic">
                <span v-if="item.lines[0].type=='地铁' || item.lines[0].type=='公交车'" class="theicon">
                  <Icon type="ios-subway-outline" size="22" />
                </span>
                <sapn v-else-if="item.lines[0].type=='火车'" class="theicon">
                  <Icon type="md-train" size="22" />
                </sapn>
                <span v-else class="theicon">
                  <Icon type="md-plane" size="22" />
                </span>
                <span>{{item.lines[0].type}}</span>
              </p>
              <p style="position:absolute;right:25px;top:2px;font-weight:bold">详情</p>
              <p class="sicon">
                <Icon type="md-arrow-dropright" size="25" color="rgba(48, 108, 197, .9)" />
              </p>
            </div>
            <div class="theBody">
              <p class="time">
                全程约：
                <span>{{item.time}}</span>
              </p>

              <p class="score" v-if="item.lines[0].sumScore>=60">
                <Tag checkable color="error" size="large" type="dot">{{item.lines[0].sumScore}}</Tag>
              </p>
              <p class="score" v-else-if="item.lines[0].sumScore>=30">
                <Tag checkable color="warning" size="large" type="dot">{{item.lines[0].sumScore}}</Tag>
              </p>
              <p class="score" v-else>
                <Tag checkable color="success" size="large" type="dot">{{item.lines[0].sumScore}}</Tag>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </Drawer>
    <Drawer :closable="false" v-model="drawer" width="355">
      <p slot="header" style="position:relative;font-size:20px;font-weight:bold">
        <Icon type="md-add" />
        {{theIndex}}号方案分段风险评估
      </p>
      <div style="height:520px;overflow-y:auto">
        <ul
          v-for="(sitem,index) in item.line"
          :key="index"
          style="list-style-type:none;position:relative;padding-right:10px;width:100%"
          class="sspecific"
        >
          <li v-if="sitem.type==0" :class="{noExpand:(!(expand==index)),isExpand:(expand==index)}">
            <div @click="decideExpand(index)" style="cursor:pointer">
              <span class="theIndex">{{index+1}}</span>
              <div class="theBackground">
                <p class="icon">
                  <span class="navtrans-bus-icon bus" style="size:30px"></span>
                </p>
                <p class="traffic">
                  <span>&nbsp;&nbsp;{{sitem.line[1].factor}}</span>
                </p>
                <p class="time">
                  全程约：
                  <span>{{sitem.line[0].factor}}</span>
                </p>
                <p class="sicon" v-if="!(expand==index)">
                  <Icon type="md-arrow-dropdown" size="20" color="rgba(48, 108, 197, .9)" />
                </p>
                <p class="sicon" v-else>
                  <Icon type="md-arrow-dropup" size="20" color="rgba(48, 108, 197, .9)" />
                </p>
              </div>
              <div class="theBody">
                <p class="start">
                  出发站：
                  <span>{{sitem.start}}</span>
                </p>
                <p class="end">
                  终点站：
                  <span>{{sitem.end}}</span>
                </p>
                <p class="score" v-if="sitem.finalscore>=60">
                  <Tag checkable color="error" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
                <p class="score" v-else-if="sitem.finalscore>=30">
                  <Tag checkable color="warning" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
                <p class="score" v-else>
                  <Tag checkable color="success" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
              </div>
            </div>
            <div style="position:relative;right:0px" class="table">
              <Table
                row-key="id"
                @on-row-click="toggleTableExpand2"
                :columns="columns2"
                :data="sitem.line"
                border
                :indent-size="0"
              ></Table>
            </div>
          </li>
          <li v-if="sitem.type==1" :class="{noExpand:(!(expand==index)),isExpand:(expand==index)}">
            <div @click="decideExpand(index)" style="cursor:pointer">
              <span class="theIndex">{{index+1}}</span>
              <div class="theBackground">
                <p class="icon">
                  <span class="navtrans-bus-icon bus" style="size:30px"></span>
                </p>
                <p class="traffic">
                  <span>&nbsp;&nbsp;{{sitem.line[1].factor}}</span>
                </p>
                <p class="time">
                  全程约：
                  <span>{{sitem.line[0].factor}}</span>
                </p>
                <p class="sicon" v-if="!(expand==index)">
                  <Icon type="md-arrow-dropdown" size="20" color="rgba(48, 108, 197, .9)" />
                </p>
                <p class="sicon" v-else>
                  <Icon type="md-arrow-dropup" size="20" color="rgba(48, 108, 197, .9)" />
                </p>
              </div>
              <div class="theBody">
                <p class="start">
                  出发站：
                  <span>{{sitem.start}}</span>
                </p>
                <p class="end">
                  终点站：
                  <span>{{sitem.end}}</span>
                </p>
                <p class="score" v-if="sitem.finalscore>=60">
                  <Tag checkable color="error" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
                <p class="score" v-else-if="sitem.finalscore>=30">
                  <Tag checkable color="warning" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
                <p class="score" v-else>
                  <Tag checkable color="success" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
              </div>
            </div>
            <div style="position:relative;right:0px" class="table">
              <Table
                row-key="id"
                @on-row-click="toggleTableExpand2"
                :columns="columns"
                :data="sitem.line"
                border
                :indent-size="0"
              ></Table>
            </div>
          </li>
          <li v-if="sitem.type==3" :class="{noExpand:(!(expand==index)),isExpand:(expand==index)}">
            <div @click="decideExpand(index)" style="cursor:pointer">
              <span class="theIndex">{{index+1}}</span>
              <div class="theBackground">
                <p class="icon">
                  <span class="navtrans-cross-city-icon train" style="size:30px"></span>
                </p>
                <p class="traffic">
                  <span>&nbsp;&nbsp;{{sitem.line[1].factor}}</span>
                </p>
                <p class="time">
                  全程约：
                  <span>{{sitem.line[0].factor}}</span>
                </p>
                <p class="sicon" v-if="!(expand==index)">
                  <Icon type="md-arrow-dropdown" size="20" color="rgba(48, 108, 197, .9)" />
                </p>
                <p class="sicon" v-else>
                  <Icon type="md-arrow-dropup" size="20" color="rgba(48, 108, 197, .9)" />
                </p>
              </div>
              <div class="theBody">
                <p class="start">
                  出发站：
                  <span>{{sitem.start}}</span>
                </p>
                <p class="end">
                  终点站：
                  <span>{{sitem.end}}</span>
                </p>
                <p class="score" v-if="sitem.finalscore>=60">
                  <Tag checkable color="error" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
                <p class="score" v-else-if="sitem.finalscore>=30">
                  <Tag checkable color="warning" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
                <p class="score" v-else>
                  <Tag checkable color="success" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
              </div>
            </div>
            <div style="position:relative;right:0px" class="table">
              <Table
                row-key="id"
                @on-row-click="toggleTableExpand2"
                :columns="columns"
                :data="sitem.line"
                border
                :indent-size="0"
              ></Table>
            </div>
          </li>
          <li v-if="sitem.type==4" :class="{noExpand:(!(expand==index)),isExpand:(expand==index)}">
            <div @click="decideExpand(index)" style="cursor:pointer">
              <span class="theIndex">{{index+1}}</span>
              <div class="theBackground">
                <p class="icon">
                  <span class="navtrans-cross-city-icon airplane" style="size:30px"></span>
                </p>
                <p class="traffic">
                  <span>&nbsp;&nbsp;{{sitem.line[1].factor}}</span>
                </p>
                <p class="time">
                  全程约：
                  <span>{{sitem.line[0].factor}}</span>
                </p>
                <p class="sicon" v-if="!(expand==index)">
                  <Icon type="md-arrow-dropdown" size="20" color="rgba(48, 108, 197, .9)" />
                </p>
                <p class="sicon" v-else>
                  <Icon type="md-arrow-dropup" size="20" color="rgba(48, 108, 197, .9)" />
                </p>
              </div>
              <div class="theBody">
                <p class="start">
                  出发站：
                  <span>{{sitem.start}}</span>
                </p>
                <p class="end">
                  终点站：
                  <span>{{sitem.end}}</span>
                </p>
                <p class="score" v-if="sitem.finalscore>=60">
                  <Tag checkable color="error" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
                <p class="score" v-else-if="sitem.finalscore>=30">
                  <Tag checkable color="warning" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
                <p class="score" v-else>
                  <Tag checkable color="success" size="large" type="dot">{{sitem.finalscore}}</Tag>
                </p>
              </div>
            </div>
            <div style="position:relative;right:0px" class="table">
              <Table
                row-key="id"
                @on-row-click="toggleTableExpand2"
                :columns="columns"
                :data="sitem.line"
                border
                :indent-size="0"
              ></Table>
            </div>
          </li>
        </ul>
      </div>
    </Drawer>
    <Modal v-model="modal1" width="50">
      <city-detail v-bind:factor="cityname" style="height:400px;position:relative;left:10%"></city-detail>
      <div slot="footer">
        <Button type="primary" size="large" long @click="modal1=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
import CityDetail from "@/assets/citydetail.vue";
import VDistpicker from "v-distpicker";
export default {
  name: "routeDisplay",
  components: { VDistpicker, "city-detail": CityDetail },
  data() {
    return {
      item: "",
      theIndex: -1,
      cityname: "",
      modal1: false,
      drawer: false,
      columns: [
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
          title: "最高风险交通方式",
          key: "type",
          align: "center"
          // width:400,
        },
        {
          title: "最高风险分数",
          key: "risk",
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.risk >= 60 ? "error" : row.risk >= 30 ? "warning" : "success";

            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: color
                }
              },
              row.risk
            );
          }
        }
      ],
      nowData: [],
      nums: 0,
      loading: false,
      pageCurrent: 1,
      province: "上海市",
      area: "宝山区",
      province2: "",
      modal: false,
      modalWidth: 360,
      expand: -1,
      allPlan: [],
      columns2: [
        {
          title: "风险因素",
          key: "factor",
          tree: true,
          align: "center",
          className: "demo-table-info-column"
        },

        {
          title: "评估分数",
          key: "number",
          width: 140,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.number <= 30
                ? "success"
                : row.number <= 60
                ? "warning"
                : "error";
            if (row.factor == "初始站:终点站") {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      // fontSize: "25px",
                      position: "relative",
                      fontWeight: "bold"
                    }
                  },
                  row.number
                )
              ]);
            } else {
              return h("div", [
                h(
                  "Tag",
                  {
                    class: "tagtext",
                    props: {
                      type: "dot",
                      color: color
                    },
                    style: {
                      fontSize: "25px",
                      position: "relative"
                      // marginTop:"-3px",
                    }
                  },
                  row.number
                )
              ]);
            }
          }
        }
      ]
    };
  },
  mounted() {
    this.init(1);
  },
  methods: {
    decideExpand(index) {
      if (this.expand == index) {
        this.expand = -1;
      } else {
        this.expand = index;
      }
    },

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
    specifics(message, index) {
      this.theIndex = index + 1;
      this.item = message;
      this.drawer = true;
    },
    toggleTableExpand2(row, index) {
      if (row.id >= 10) {
        this.modal1 = true;
        this.cityname = row.factor;
      }
    },
    toggleTableExpand(row, index) {
      axios({
        url: apiRoot + "/epidemic/pathChildQuery",
        method: "get",
        params: {
          startAddress: row.start
        }
      })
        .then(res => {
          console.log(res);

          if (res.data.code == 200) {
            console.log(12313);
            for (let i = 0; i < res.data.data.transit.length; i++) {
              this.construct(res.data.data.transit[i]);
            }

            this.modal = true;
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("请检查网络连接！");
        });
    },
    init(pageNum) {
      this.nowData = [];
      this.loading = true;
      this.pageCurrent = pageNum
      this.nums = 0;
      let provinceArea;
      if (this.province2 != "") {
        provinceArea = this.province2 + this.area;
      } else {
        provinceArea = this.province + this.area;
      }
      console.log(provinceArea);
      console.log(pageNum);
      axios({
        url: apiRoot + "/epidemic/pathQuery",
        method: "post",
        data: {
          index: (pageNum - 1) * 10 + 1,
          num: 10,
          province: provinceArea
        }
      })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.nums = res.data.data.num - 1;
            res.data.data.pathQueryResponseList.forEach(item => {
              this.nowData.push(item);
            });
            this.$Message.success("第" + pageNum + "页数据获取成功！");
            this.loading = false;
          } else {
            if(res.data.message == '风险数据为空'){
                this.nums = 0;
            }
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
    },
    construct(data) {
      let doubleLineList = [];
      let lineList = [];
      for (let j = 0; j < data.resultList.length; j++) {
        let theTemplate = [
          {
            id: 1,
            factor: "",
            number: 0
          },
          {
            id: 2,
            factor: "",
            number: 0
          },
          {
            id: 4,
            factor: "途径城市",
            number: 0,
            children: []
          }
        ];
        let nums = 10;
        let lineTemp = data.resultList[j];
        lineTemp.timeScore = parseInt(lineTemp.timeScore).toFixed(0);
        lineTemp.transportScore = parseInt(lineTemp.transportScore).toFixed(0);
        theTemplate[0].factor = lineTemp.time;
        theTemplate[0].number = lineTemp.timeScore;
        theTemplate[1].factor = lineTemp.title;
        theTemplate[1].number = lineTemp.transportScore;

        let theCityScore = 0;
        for (let k = 0; k < lineTemp.city.length; k++) {
          let cityTemp = {
            id: k + 10,
            factor: lineTemp.city[k].cityname,
            number: lineTemp.city[k].cityscore
          };
          theTemplate[2].children.push(cityTemp);
          theCityScore += lineTemp.city[k].cityscore;
        }
        theCityScore /= lineTemp.city.length;
        theTemplate[2].number = theCityScore.toFixed(0);
        let big = {
          type: lineTemp.type,
          finalscore: lineTemp.finalscore,
          line: theTemplate,
          start: lineTemp.start,
          end: lineTemp.end
        };
        lineList.push(big);
      }

      let bigs = {
        type: data.type,
        sumScore: data.sumScore,
        line: lineList
      };
      doubleLineList.push(bigs);
      let onePlan = {
        policy: "citymethod",
        interpolicy: "intercitymethod",
        time: data.time,
        lines: doubleLineList
      };
      this.allPlan.push(onePlan);
      console.log(this.allPlan)
    }
  },
  watch: {
    modal(val, oldVal) {
      if (val) {
        console.log(this.allPlan);
      }
      if (!val) {
        this.allPlan.splice(0, this.allPlan.length);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "route";
</style>
<style scoped>
.tagtext .ivu-tag-dot-inner {
  position: relative;
  top: -4px;
  left: 2px;
}
</style>
