// table-expand.vue

<template>
  <div>
    <Modal v-model="modal1"  width="70vw">
      <city-detail v-bind:factor="cityName"></city-detail>
    </Modal>
    <Card :bordered="false">
      <p style="color:#f60;text-align:center;height:50px">
        <Icon type="ios-information-circle" size="35" style="top:10px;position:relative"></Icon>
        <span style="font-size:35px;top:10px;position:relative">返沪风险指数</span>
      </p>
      <Divider></Divider>
      <div v-for="(item,index) in doubleLineList" :key="index">
        <Tag style="position:absolute;left:50px;margin-top:10px" size="large" class="tags">
          <span style="top:0px;position:relative">{{item.type}}</span>
        </Tag>
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="10" style="text-align:center">
            <div style="height:340px">
              <div>
                <p style="text-align:center;margin-left:20px;font-size:45px;font-weight:bold">综合评分</p>
                <p
                  style="text-align:center;margin-top:0px;font-size:80px;color:rgb(77, 121, 243);"
                >{{row.sumCalResponseList[index].sumScore}}</p>
                <p style="text-align:center;margin-bottom:10px;font-size:30px;font-weight:bold">始终点</p>
                <Row type="flex" justify="center" class="code-row-bg" style>
                  <Col span="8" offset="0">
                    <div style=";position:relative;margin-top:20px;">
                      <p
                        style="position:relative;font-size:14px;font-weight:bold;color:rgb(77, 121, 243);"
                      >{{row.start}}</p>
                    </div>
                  </Col>
                  <Divider
                    type="vertical"
                    style="width:1px;height:80px;position:relative;left:20px;top:20px"
                  />

                  <Col span="8" offset="2">
                    <div style=";position:relative;margin-top:20px;">
                      <p
                        style="position:relative;font-size:14px;font-weight:bold;color:rgb(77, 121, 243);"
                      >{{row.end}}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
          <Divider type="vertical" style="width:1px;height:330px;position:relative;left:-10px" />
          <Col span="13">
            <div>
              <p
                style="font-size:20px;font-weight:bold;position:relative;text-align:center;margin-bottom:0px;top:-5px"
              >旅程分段风险评估</p>

              <div style="height:320px;overflow-y:auto">
                <ul
                  v-for="(sitem,index) in item.line"
                  :key="index"
                  style="list-style-type:none;position:relative;padding-right:10px;width:100%"
                >
                  <li v-if="sitem.type==0">
                    <span class="navtrans-bus-icon bus" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.公交车</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      路段风险：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:3px"></Divider>
                    <div style="width:100%;position:relative;right:0px">
                      <Table
                        row-key="id"
                        :columns="columns"
                        :data="sitem.line"
                        border
                        :indent-size="0"
                      >
                        <template slot-scope="{ row }" slot="specific">
                          <span>
                            <div v-if="row.specific=='详情'" @mouseenter="mEnter(row.factor)">
                                                            <Button
                                                              type="primary" @click="modal1=true,cityName=row.factor"
                                                            >{{row.specific}}</Button>
                            </div>
                            <div v-else>{{row.specific}}</div>
                          </span>
                        </template>
                      </Table>
                    </div>

                    <Divider style="position:relative;margin-top:5px;margin-bottom:10px"></Divider>
                  </li>
                  <li v-if="sitem.type==1">
                    <span class="navtrans-bus-icon bus" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.地铁</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      路段风险：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:3px"></Divider>
                    <div style="width:100%;position:relative;right:0px">
                      <Table
                        row-key="id"
                        :columns="columns"
                        :data="sitem.line"
                        border
                        :indent-size="0"
                      >
                       <template slot-scope="{ row }" slot="specific">
                          <span>
                            <div v-if="row.specific=='详情'" @mouseenter="mEnter(row.factor)">
                                                            <Button
                                                              type="primary" @click="modal1=true,cityName=row.factor"
                                                            >{{row.specific}}</Button>
                            </div>
                            <div v-else>{{row.specific}}</div>
                          </span>
                        </template>
                      </Table>
                    </div>

                    <Divider style="position:relative;margin-top:5px;margin-bottom:10px"></Divider>
                  </li>
                  <li v-if="sitem.type==3">
                    <span class="navtrans-bus-icon train" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.火车</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      路段风险：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:3px"></Divider>
                    <div style="width:100%;position:relative;right:0px">
                      <Table
                        row-key="id"
                        :columns="columns"
                        :data="sitem.line"
                        border
                        :indent-size="0"
                      >
                     <template slot-scope="{ row }" slot="specific">
                       <span>
                            <div v-if="row.specific=='详情'" @mouseenter="mEnter(row.factor)">
                                                            <Button
                                                              type="primary" @click="modal1=true,cityName=row.factor"
                                                            >{{row.specific}}</Button>
                            </div>
                            <div v-else>{{row.specific}}</div>
                          </span>
                        </template>
                      </Table>
                    </div>

                    <Divider style="position:relative;margin-top:5px;margin-bottom:10px"></Divider>
                  </li>
                  <li v-if="sitem.type==4">
                    <span class="navtrans-bus-icon plane" style="size:30px"></span>
                    <span
                      style="font-size:18px;font-weight:bold;position:relative;left:5px;"
                    >{{index+1}}.飞机</span>
                    <span style="position:relative;float:right;font-size:18px;font-weight:bold;">
                      路段风险：
                      <Rate
                        allow-half
                        disabled
                        v-model="sitem.finalscore"
                        icon="ios-flame"
                        style="margin-top:-2px;"
                      />
                    </span>
                    <Divider style="position:relative;margin-top:10px;margin-bottom:3px"></Divider>
                    <div style="width:100%;position:relative;right:0px">
                      <Table
                        row-key="id"
                        :columns="columns"
                        :data="sitem.line"
                        border
                        :indent-size="0"
                      >
                      <template slot-scope="{ row }" slot="specific">
                          <span>
                            <div v-if="row.specific=='详情'" @mouseenter="mEnter(row.factor)">
                                                            <Button
                                                              type="primary" @click="modal1=true,cityName=row.factor"
                                                            >{{row.specific}}</Button>
                            </div>
                            <div v-else>{{row.specific}}</div>
                          </span>
                        </template>
                      </Table>
                    </div>

                    <Divider style="position:relative;margin-top:5px;margin-bottom:10px"></Divider>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
        <Divider></Divider>
      </div>
    </Card>
    <Modal v-model="modal" title="Common Modal dialog box title"></Modal>
  </div>
</template>
<script>
import CityDetail from '@/assets/citydetail.vue';
export default {
  props: {
    row: Object
  },
  components: {
      "city-detail": CityDetail
  },
  data() {
    return {
      demos: {},
      modal: false,
      modal1: false,
      cityName: '',
      columns: [
        {
          title: "风险因素",
          key: "factor",
          tree: true,
          align: "center",
          className: "demo-table-info-column"
        },
        {
          title: "具体信息",
          slot: "specific",
          align: "center",
          className: "demo-table-info-column2"
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
                      // marginTop:"3px",
                    }
                  },
                  row.number
                )
              ]);
            }
          }
        }
      ],
      data: [
        {
          id: 5,
          factor: "路程时间",
          specific: "0时3分",
          number: 18
        },

        {
          id: 4,
          factor: "交通工具",
          specific: "宝山2路",
          number: 30,
          children: [
            {
              id: 20,
              factor: "初始站:终点站",
              specific: "虹桥1号航站楼站(3口)",
              number: "虹桥2号航站楼站"
            }
          ]
        },

        {
          id: 1,
          factor: "途径城市",
          specific: "10个城市",
          number: 23,
          children: [
            {
              id: 11,
              factor: "宝山",
              specific: "详情",
              number: 19
            },
            {
              id: 3,
              factor: "宝山",
              specific: "详情",
              number: 19
            }
          ]
        }
      ],

      doubleLineList: []
    };
  },
  mounted() {
    this.construct(this.row.sumCalResponseList);
  },
  methods: {

    construct(data) {
      this.doubleLineList = [];
      let theTemplate = [];
      theTemplate = this.theTemplate;

      for (let i = 0; i < data.length; i++) {
        let lineList = [];
        for (let j = 0; j < data[i].resultList.length; j++) {
          let theTemplate = [
            {
              id: 1,
              factor: "路程时间",
              specific: "",
              number: 0
            },
            {
              id: 2,
              factor: "交通工具",
              specific: "",
              number: 0,
              children: [
                {
                  id: 3,
                  factor: "初始站:终点站",
                  specific: "",
                  number: ""
                }
              ]
            },

            {
              id: 4,
              factor: "途径城市",
              specific: "",
              number: 0,
              children: []
            }
          ];
          let nums = 10;
          let lineTemp = data[i].resultList[j];
          lineTemp.timeScore = parseInt(lineTemp.timeScore).toFixed(0);
          lineTemp.transportScore = parseInt(lineTemp.transportScore).toFixed(
            0
          );
          theTemplate[0].specific = lineTemp.time;
          theTemplate[0].number = lineTemp.timeScore;
          theTemplate[1].specific = lineTemp.title;
          theTemplate[1].number = lineTemp.transportScore;
          theTemplate[1].children[0].specific = lineTemp.start;
          theTemplate[1].children[0].number = lineTemp.end;

          theTemplate[2].specific = `经过${lineTemp.city.length}个城市`;
          let theCityScore = 0;
          for (let k = 0; k < lineTemp.city.length; k++) {
            let cityTemp = {
              id: k + 10,
              factor: lineTemp.city[k].cityname,
              number: lineTemp.city[k].cityscore,
              specific: "详情"
            };
            theTemplate[2].children.push(cityTemp);
            theCityScore += lineTemp.city[k].cityscore;
          }
          theCityScore /= lineTemp.city.length;
          theTemplate[2].number = theCityScore.toFixed(0);
          let big = {
            type: lineTemp.type,
            finalscore: lineTemp.finalscore,
            line: theTemplate
          };
          lineList.push(big);
        }

        let bigs = {
          type: data[i].type,
          sumScore: data[i].sumScore,
          line: lineList
        };
        this.doubleLineList.push(bigs);
      }
    },
    mEnter(city){
      console.log(city)
    }
  },
  computed: {}
};
</script>

<style scoped>
.expand-row {
  margin-bottom: 16px;
}
.tags {
  z-index: 999;
}
</style>
<style>
.ivu-tag-size-large {
  height: 52px;
  line-height: 40px;
  padding: 0 12px;
}
.ivu-tag {
  display: inline-block;
  height: 43px;
  line-height: 20px;
  margin: 2px 4px 2px 0;
  padding: 6px 8px;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  /* background: #130d0d; */
  font-size: 36px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
}
.ivu-table .demo-table-info-row td {
  background-color: #2db7f5;
  color: #fff;
}
.ivu-table .demo-table-error-row td {
  background-color: #ff6600;
  color: #fff;
}
.ivu-table td.demo-table-info-column {
  font-weight: bold;
  /* background-color: #cfcfce; */
  color: rgb(0, 0, 0);
}
.ivu-table td.demo-table-info-column2 {
  font-weight: bold;
}
.ivu-table .demo-table-info-cell-name {
  background-color: #2db7f5;
  color: #fff;
}
.ivu-table .demo-table-info-cell-age {
  background-color: #c0bebd;
  color: rgb(3, 3, 3);
  font-weight: bold;
}
.ivu-table .demo-table-info-cell-address {
  background-color: #187;
  color: #fff;
}
.tagtext {
  /* background:#000 !important; */
}
.ivu-tag-text {
  position: relative;
  top: 4px !important;
  right: 3px;
}
.poptip {
  /* z-index:999 !important; */

  /* background:#000; */
  /* position: absolute; */
}
</style>
