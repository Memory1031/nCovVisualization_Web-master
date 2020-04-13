<template>
  <div>
    <div id="left-panel">
      <div id="searchbox" class="clearfix">
        <p
          style="position:relative;font-weight:bolder;font-size:30px;text-align:center;margin-left:-30px;margin-bottom:10px"
        >疫情出行方案评估</p>
        <div id="searchbox-container">
          <div id="sole-searchbox-content" class="searchbox-content">
            <RadioGroup type="button" v-model="trafficType.type">
              <Radio label="0">
                <Icon type="md-train" />火车
              </Radio>
              <Radio label="1">
                <Icon type="md-plane" />飞机
              </Radio>
              <Radio label="2">
                <Icon type="ios-bus-outline" />城内公交
              </Radio>
            </RadioGroup>

            <Divider style="position:relative;margin-bottom:0px;margin-top:2px" />
            <div style="display:flex">
              <Icon type="ios-pin-outline" style="position:relative;top:9px;left:10px" size="20" />&nbsp;
              <input
                class="searchbox-content-common sole-input"
                type="text"
                name="word"
                autocomplete="off"
                maxlength="256"
                placeholder="请输入起点"
                v-model="startAddress.address"
                style="position:relative;left:10px"
              />
            </div>
            <Divider style="position:relative;margin-bottom:0px;margin-top:0px" />
            <div style="display:flex">
              <Icon type="ios-pin" style="position:relative;top:9px;left:10px" size="20" />&nbsp;
              <input
                class="searchbox-content-common sole-input"
                type="text"
                name="word"
                autocomplete="off"
                maxlength="256"
                placeholder="请输入终点"
                v-model="endAddress.address"
                style="position:relative;left:10px"
              />
            </div>
          </div>
        </div>
        <Button id="search-button" @click="codeAddress()">
          <Icon type="ios-search" color="#fff" size="30" />
        </Button>
        <a href="/home/statisticList">
          <Button id="back">返回</Button>
        </a>
      </div>
    </div>
    <div id="container"></div>
    <div class="box" id="box">
      <GeminiScrollbar class="my-scroll-bar" style="width:368px">
        <p class="title">
          <Icon type="ios-alert-outline" size="30" />多条线路方案评估
        </p>
        <ul style="list-style-type:none;" class="plans">
          <li v-for="(item,index) in allPlan" :key="index" @click="specifics(item.lines[0],index)">
            <span class="theIndex">{{index+1}}</span>
            <div class="theBackground"></div>
            <div class="theBody">
              <p class="icon">
                <Icon type="md-train" size="17" color="#F26118" />
              </p>
              <p class="method">
                <span>&nbsp;&nbsp;{{item.policy}}</span>
              </p>
              <p class="method2">
                <span>&nbsp;&nbsp;{{item.interpolicy}}</span>
              </p>
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
      </GeminiScrollbar>
    </div>
    <Drawer :closable="false" v-model="drawer" width="370">
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
              <Table row-key="id" :columns="columns" :data="sitem.line" border :indent-size="0">
                <template slot-scope="{ row }" slot="number">
                  <strong>{{ row.number }}</strong>
                </template>
              </Table>
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
              <Table row-key="id" :columns="columns" :data="sitem.line" border :indent-size="0">
                <template slot-scope="{ row }" slot="factor">
                  <span>
                    <div v-if="row.id>=10">
                      <Button type="primary" @click="modal1=true,cityname=row.factor">{{row.factor}}</Button>
                    </div>
                    <div v-else>{{row.factor}}</div>
                  </span>
                </template>
              </Table>
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
              <Table row-key="id" :columns="columns" :data="sitem.line" border :indent-size="0">
                <template slot-scope="{ row }" slot="factor">
                  <span>
                    <div v-if="row.id>=10">
                      <Button type="primary" @click="modal1=true,cityname=row.factor">{{row.factor}}</Button>
                    </div>
                    <div v-else>{{row.factor}}</div>
                  </span>
                </template>
              </Table>
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
              <Table row-key="id" :columns="columns" :data="sitem.line" border :indent-size="0">
                <template slot-scope="{ row }" slot="factor">
                  <span>
                    <div v-if="row.id>=10">
                      <Button type="primary" @click="modal1=true,cityname=row.factor">{{row.factor}}</Button>
                    </div>
                    <div v-else>{{row.factor}}</div>
                  </span>
                </template>
              </Table>
            </div>
          </li>
        </ul>
      </div>
    </Drawer>
    <Modal v-model="modal1" width="50">
      <city-detail v-bind:factor="cityname" style="height:400px;position:relative;left:0px"></city-detail>
      <div slot="footer">
        <Button type="primary" size="large" long @click="modal1=false;">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
import CityDetail from "@/assets/citydetail.vue";
export default {
  name: "routeMap",
  components: {
    "city-detail": CityDetail
  },
  data() {
    return {
      expand: -1,
      modal1: false,
      cityname: "",
      item: "",
      theIndex: "",
      drawer: false,
      geocoderStart: "",
      geocoderEnd: "",
      map: "",
      transit: "",
      projecting: false,
      startAddress: {
        address: "上海大学",
        lat: "",
        lng: "",
        city: "",
        latLng: ""
      },
      endAddress: {
        lat: "",
        lng: "",
        address: "北京市",
        city: "",
        latLng: ""
      },
      trafficType: {
        type: "0",
        TransitTypePolicy: [
          BMAP_TRANSIT_TYPE_POLICY_TRAIN, //火车优先
          BMAP_TRANSIT_TYPE_POLICY_AIRPLANE //飞机优先
        ], //此常量表示跨城交通方式策略。
        IntercityPolicy: [
          2, //价格低
          1 //出发早
        ], //此常量表示跨城公交换乘策略。
        TransitPolicy: [
          1, //最少时间
          2, //最少换乘
          3 //最少步行
        ] //此常量表示市内公交方案换乘策略。
      },
      plan: {
        intercity: 0,
        city: 0,
        index: 0
      },
      columns: [
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
      ],
      timeList: [],
      lines: [], //承载前端翻译出来的路程信息
      allPlan: [],
      geocoder1: "",
      geocoder2: "",
      geocoder3: "",
      citys1: [],
      citys2: [],
      citys3: [],
      heatmapOverlay: "",
      points: []
    };
  },
  methods: {
    decideExpand(index) {
      if (this.expand == index) {
        this.expand = -1;
      } else {
        this.expand = index;
      }
    },
    init() {
      var that = this;
      //调用地址解析类
      this.map = new BMap.Map("container");
      this.map.setMapStyle({
        style: "grayscale"
      });
      this.map.enableScrollWheelZoom();
      var point = new BMap.Point(121.389028, 31.32062);
      this.map.centerAndZoom(point, 8);
      this.heatmapOverlay = new BMapLib.HeatmapOverlay({ radius: 50 });
      this.map.addOverlay(this.heatmapOverlay);
      this.heatmapOverlay.setDataSet({ data: that.points, max: 100 });
      this.geocoderStart = new qq.maps.Geocoder({
        complete: function(result) {
          if (result.detail.addressComponents.province == "") {
            that.startAddress.city = result.detail.addressComponents.district;
          } else {
            that.startAddress.city = result.detail.addressComponents.city;
          }
          that.startAddress.lat = result.detail.location.lat;
          that.startAddress.lng = result.detail.location.lng;
        }
      });
      this.geocoderEnd = new qq.maps.Geocoder({
        complete: function(result) {
          if (result.detail.addressComponents.province == "") {
            that.endAddress.city = result.detail.addressComponents.district;
          } else {
            that.endAddress.city = result.detail.addressComponents.city;
          }
          that.endAddress.lat = result.detail.location.lat;
          that.endAddress.lng = result.detail.location.lng;
        }
      });

      // this.map.centerAndZoom(new BMap.Point(121.393402, 31.31601), 8);
      this.transit = new BMap.TransitRoute(this.map, {
        renderOptions: {
          map: this.map,
          autoViewport: true
        },
        onSearchComplete: function(results) {
          if (results.Gu == undefined) {
            that.$Message.warning("无法查询此路径");
            that.modal = false;
            that.projecting = false;
            return;
          }
          let allTime = results.getPlan(that.plan.index).getDuration();
          let timeCheck = true;
          for (let i = 0; i < that.timeList.length; i++) {
            if (allTime == that.timeList[i]) {
              timeCheck = false;
            }
          }
          if (!timeCheck) {
            that.loadData(0);
            return;
          }
          that.timeList.unshift(allTime);
          if (that.timeList.length > 5) {
            that.projecting = false;
            console.log(that.allPlan);
            return;
          }
          if (that.trafficType.type == "0" || that.trafficType.type == "2") {
            var half = false;
            var lineNum = results.getPlan(that.plan.index).getNumLines();
            let traindistance = 0;
            var trainlinenum = 0;
            var trainlinecheck = 0;
            for (let i = 0; i < lineNum; i++) {
              var line = results.getPlan(that.plan.index).getLine(i);

              if (line.type == 3) {
                trainlinenum++;
              }
            }
            for (var i = 0; i < lineNum; i++) {
              var line = results.getPlan(that.plan.index).getLine(i);

              if (line.type == 3) {
                trainlinecheck++;
                half = true;
                var temp = [];
                var check = {};
                for (let j = 0; j < line.Tq.length; j++) {
                  if (!check[line.Tq[j].lat]) {
                    temp.push(line.Tq[j]);
                    check[line.Tq[j].lat] = true;
                  }
                }
                for (let j = 0; j < temp.length; j++) {
                  var latLng = new qq.maps.LatLng(temp[j].lat, temp[j].lng);

                  if (j != 0) {
                    let lastlat = temp[j - 1].lat;
                    let lastlng = temp[j - 1].lng;
                    let pointA = new BMap.Point(lastlng, lastlat);
                    let pointB = new BMap.Point(temp[j].lng, temp[j].lat);
                    traindistance += that.map.getDistance(pointA, pointB);
                  }
                  that.geocoder1 = new qq.maps.Geocoder({
                    complete: function(result) {
                      if (
                        result.detail.addressComponents.city ==
                        result.detail.addressComponents.province
                      ) {
                        that.citys1.push(
                          result.detail.addressComponents.district
                        );
                      } else {
                        that.citys1.push(result.detail.addressComponents.city);
                      }
                    }
                  });

                  if (trainlinenum > 1) {
                    that.geocoder2 = new qq.maps.Geocoder({
                      complete: function(result) {
                        if (
                          result.detail.addressComponents.city ==
                          result.detail.addressComponents.province
                        ) {
                          that.citys2.push(
                            result.detail.addressComponents.district
                          );
                        } else {
                          that.citys2.push(
                            result.detail.addressComponents.city
                          );
                        }
                      }
                    });
                    if (trainlinenum > 2) {
                      that.geocoder3 = new qq.maps.Geocoder({
                        complete: function(result) {
                          if (
                            result.detail.addressComponents.city ==
                            result.detail.addressComponents.province
                          ) {
                            that.citys3.push(
                              result.detail.addressComponents.district
                            );
                          } else {
                            that.citys3.push(
                              result.detail.addressComponents.city
                            );
                          }
                        }
                      });
                    }
                  }
                  if (trainlinecheck == 1) {
                    that.geocoder1.getAddress(latLng);
                  } else if (trainlinecheck == 2) {
                    that.geocoder2.getAddress(latLng);
                  } else if (trainlinecheck == 3) {
                    that.geocoder3.getAddress(latLng);
                  }
                }
                var tempcitys = [];
                if (trainlinecheck == 1) {
                  tempcitys = that.citys1;
                } else if (trainlinecheck == 2) {
                  tempcitys = that.citys2;
                } else if (trainlinecheck == 3) {
                  tempcitys = that.citys3;
                }
                var theLine = {
                  citys: tempcitys,
                  type: line.type,
                  distance: traindistance,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.startAddress.address
                };
                that.lines.push(theLine);
              } else if (line.type == 0) {
                var theCity = half
                  ? that.endAddress.city
                  : that.startAddress.city;
                var distance = line.bg;
                let tempcity = [];
                tempcity.push(theCity);
                var theLine = {
                  citys: tempcity,
                  distance: distance,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.startAddress.address
                };
                that.lines.push(theLine);
              } else if (line.type == 1) {
                var theCity = half
                  ? that.endAddress.city
                  : that.startAddress.city;
                var distance = line.bg;
                let tempcity = [];
                tempcity.push(theCity);
                var theLine = {
                  citys: tempcity,
                  distance: distance,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.startAddress.address
                };
                that.lines.push(theLine);
              }
            }
          } else if (that.trafficType.type == "1") {
            var half = false;
            var lineNum = results.getPlan(that.plan.index).getNumLines();
            for (var i = 0; i < lineNum; i++) {
              var line = results.getPlan(that.plan.index).getLine(i);
              if (line.type == 0) {
                var theCity = half
                  ? that.endAddress.city
                  : that.startAddress.city;
                var distance = line.bg;
                let tempcity = [];
                tempcity.push(theCity);
                var theLine = {
                  citys: tempcity,
                  distance: distance,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.startAddress.address
                };
                that.lines.push(theLine);
              } else if (line.type == 1) {
                var theCity = half
                  ? that.endAddress.city
                  : that.startAddress.city;
                var distance = line.bg;
                let tempcity = [];
                tempcity.push(theCity);
                var theLine = {
                  citys: tempcity,
                  distance: distance,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.startAddress.address
                };
                that.lines.push(theLine);
              } else if (line.type == 4) {
                let tempcity = [];
                tempcity.push(that.startAddress.city);
                tempcity.push(that.endAddress.city);
                var theLine = {
                  citys: tempcity,
                  distance: line.bg,
                  type: line.type,
                  title: line.title,
                  start: line.Pi[0].title,
                  end: line.Pi[1].title,
                  startAdressZone: that.startAddress.address
                };
                that.lines.push(theLine);
                half = true;
              }
            }
          }
          setTimeout(function() {
            that.loadData(allTime);
          }, 300);
        }
      });
    },
    codeAddress() {
      if (this.projecting) {
        return;
      }
      this.clear();
      document.getElementById("box").classList.add("show");
      this.projecting = true;

      if (
        this.trafficType.type == "" ||
        this.startAddress.address == "" ||
        this.endAddress.address == ""
      ) {
        this.$Message.warning("请完整的填写信息（交通方式，始点，终点）");
        this.projecting = false;
        return;
      }
      this.geocoderStart.getLocation(this.startAddress.address);
      this.geocoderEnd.getLocation(this.endAddress.address);
      var that = this;
      setTimeout(function() {
        that.startAddress.latLng = new BMap.Point(
          that.startAddress.lng,
          that.startAddress.lat
        );
        that.endAddress.latLng = new BMap.Point(
          that.endAddress.lng,
          that.endAddress.lat
        );
        if (
          isNaN(that.startAddress.latLng.lat) ||
          isNaN(that.startAddress.latLng.lng) ||
          isNaN(that.endAddress.latLng.lat) ||
          isNaN(that.endAddress.latLng.lng)
        ) {
          that.projecting = false;
          that.$Message.warning("无法查询此路径,请输入更为详细的地址信息");

          return;
        }
        that.transit.setTransitTypePolicy(
          that.trafficType.TransitTypePolicy[that.trafficType.type]
        ); //跨城公交方式
        that.transit.setIntercityPolicy(
          that.trafficType.IntercityPolicy[that.plan.intercity]
        ); //跨城换乘
        that.transit.setPolicy(that.trafficType.TransitPolicy[that.plan.city]); //城内换乘
        that.transit.search(that.startAddress.latLng, that.endAddress.latLng);
      }, 200);
    },
    clear() {
      this.allPlan.splice(0, this.allPlan.length);
      this.citys1.splice(0, this.citys1.length);
      this.citys2.splice(0, this.citys2.length);
      this.citys3.splice(0, this.citys3.length);
      this.lines.splice(0, this.lines.length);
      (this.timeList = []), (this.startAddress.lat = "");
      this.startAddress.lng = "";
      this.startAddress.latLng = "";
      this.startAddress.city = "";
      this.endAddress.lat = "";
      this.endAddress.lng = "";
      this.endAddress.latLng = "";
      this.endAddress.city = "";
      this.plan.city = 0;
      this.plan.intercity = 0;
      this.plan.index = 0;
    },
    loadData(allTime) {
      if (allTime == 0) {
        if (this.plan.city == 2) {
          if (this.plan.intercity == 1) {
            if (this.plan.index < 2) {
              this.plan.city = this.plan.intercity = 0;
              this.plan.index++;
            } else {
              this.projecting = false;
              console.log(this.allPlan);
              return;
            }
          } else {
            this.plan.intercity++;
            this.plan.city = 0;
          }
        } else {
          this.plan.city++;
        }

        this.transit.setPolicy(this.trafficType.TransitPolicy[this.plan.city]); //城内换乘
        this.transit.setIntercityPolicy(
          this.trafficType.IntercityPolicy[this.plan.intercity]
        ); //跨城换乘
        this.transit.search(this.startAddress.latLng, this.endAddress.latLng);
        return;
      }
      let URL = `http://epidemic.songcm.cn/api/epidemic/routeCal`;
      axios({
        url: URL,
        method: "post",
        data: {
          routeCalRequestList: this.lines
        },
        headers: {
          "Content-Type": "application/json" //必须设置传输方式
        }
      })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            let citymethod, intercitymethod;
            if (this.trafficType.TransitPolicy[this.plan.city] == 1) {
              citymethod = "最少时间";
            } else if (this.trafficType.TransitPolicy[this.plan.city] == 1) {
              citymethod = "最少换乘";
            } else {
              citymethod = "最少步行";
            }
            if (this.trafficType.IntercityPolicy[this.plan.intercity] == 1) {
              intercitymethod = "时间短";
            } else {
              intercitymethod = "价格低";
            }
            if (this.plan.city == 2) {
              if (this.plan.intercity == 1) {
                if (this.plan.index < 2) {
                  this.plan.city = this.plan.intercity = 0;
                  this.plan.index++;
                } else {
                  this.projecting = false;
                  console.log(this.allPlan);
                  return;
                }
              } else {
                this.plan.intercity++;
                this.plan.city = 0;
              }
            } else {
              this.plan.city++;
            }
            this.lines = null;
            this.lines = [];
            this.construct(res.data.data, citymethod, intercitymethod, allTime);

            this.transit.setPolicy(
              this.trafficType.TransitPolicy[this.plan.city]
            ); //城内换乘
            this.transit.setIntercityPolicy(
              this.trafficType.IntercityPolicy[this.plan.intercity]
            ); //跨城换乘
            this.transit.search(
              this.startAddress.latLng,
              this.endAddress.latLng
            );
            return;
          } else {
            this.$Message.warning(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$Message.warning(`${err}`);
        });
    },
    loadData2() {
      let URL = `http://epidemic.songcm.cn/api/epidemic/pathMap`;
      axios({
        url: URL,
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            this.points = res.data.data;
            this.init();
          } else {
            this.$Message.warning(`${res.data.message}`);
          }
        })
        .catch(err => {
          this.$Message.warning(`${err}`);
        });
    },
    construct(data, citymethod, intercitymethod, allTime) {
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
        lineTemp.finalscore = lineTemp.finalscore.toFixed(2);
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
        policy: citymethod,
        interpolicy: intercitymethod,
        time: allTime,
        lines: doubleLineList
      };
      this.allPlan.push(onePlan);
      console.log(this.allPlan);
    },
    specifics(message, index) {
      this.theIndex = index + 1;
      this.item = message;
      this.drawer = true;
    }
  },
  mounted() {
    this.loadData2();
  },
  watch: {
    drawer(val, oldVal) {
      if (!val) {
        this.expand = -1;
      }
    }
  }
};
</script>



<style scoped lang="scss">
@import "search";
@import "routeMap";
</style>
<style>
@import "changes";
</style>