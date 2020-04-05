<template>
  <div>
    <div class="button">
      <DatePicker
        type="date"
        size="large"
        :value="selectedDate"
        @on-change="changeDate"
        :options="options"
        placeholder="选择日期"
        style="width: 8vw"
      ></DatePicker>
    </div>
    <div
      id="myChart"
      ref="myChart"
      :style="{width: '60vw', height: '70vh', marginLeft:'5vw', marginTop: '5vh'}"
    ></div>
    <Row>
      <Col span="12">
        <Table
          highlight-row
          ref="currentRowTable"
          :columns="columns"
          :data="odd"
          border
        ></Table>
      </Col>
      <Col span="12">
        <Table border highlight-row ref="currentRowTable" :columns="columns" :data="even"></Table>
      </Col>
    </Row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "chinaMap",
  data() {
    return {
      yesterday: new Date(new Date().setDate(new Date().getDate() - 1)),
      selectedDate: "",
      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      allDateInfo: [],
      provinceList: [],
      odd: [],
      even: [],
      check: 0,
      columns: [
        {
          width: 80,
          align: "center",
          title: "序号",
          key: "id"
        },
        {
          title: "省份",
          key: "name"
        },
        {
          title: "人数",
          key: "confirm"
        }
      ]
    };
  },
  watch: {
    selectedDate(oldVal, newVal) {
      this.init(1);
    }
  },
  mounted() {
    this.selectedDate =
      this.yesterday.getFullYear() +
      "-" +
      (this.yesterday.getMonth() > 9
        ? this.yesterday.getMonth() + 1
        : "0" + (this.yesterday.getMonth() + 1)) +
      "-" +
      (this.yesterday.getDate() > 9
        ? this.yesterday.getDate()
        : "0" + this.yesterday.getDate());
    this.init(0);
  },
  methods: {
    sss() {
      console.log(this.even);
    },
    init(num) {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // myChart.showLoading()
      myChart.setOption({
        // 进行相关配置
        title: {
          text: "中国新型冠状病毒患病人数分布图",
          color: "#fff",
          x: "center"
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 0, //最小值
          max: 3000, //最大值
          realtime: false,
          calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
          textStyle: {
            color: "#fff"
          }
        },
        dataRange: {
          x: "left",
          y: "center",
          splitList: [
            {
              start: 0,
              end: 0,
              label: "0人感染或未查询到该地数据",
              color: "#EFEFEF"
            },
            { start: 1, end: 10, label: "1-10人", color: "#F0CA93" },
            { start: 11, end: 50, label: "11-50人", color: "#F59112" },
            { start: 51, end: 100, label: "51-100人", color: "#EE5213" },
            { start: 101, end: 500, label: "101-500人", color: "#E92601" },
            { start: 501, label: ">500人", color: "#A81502" }
          ]
        },
        // 提示框，鼠标移入
        tooltip: {
          show: true, //鼠标移入是否触发数据
          trigger: "item", //触发方式
          formatter: function(params) {
            // console.log(params)
            if (params.data == undefined) {
              return params.name + " 患病人数：缺少该地区患病人数数据";
            } else {
              return params.name + " 患病人数：" + params.data.value;
            }
          }
        },
        //配置地图的数据，并且显示
        series: [
          {
            name: "地图",
            type: "map", //地图种类
            map: "china", //地图类型。
            zoom: 1,
            data: [],
            label: {
              //图形上的文本标签，可用于说明图形的一些数据信息
              show: true
            }
          }
        ]
      });
      myChart.showLoading();
      axios({
        url: apiRoot + "/map/dateInfo",
        method: "get"
      })
        .then(res => {
          if (res.data.code == 200) {
            this.check++;
            this.provinceList =
              res.data.data[res.data.data.length - 1].provinceInfoList;

            if (this.check == 2) {
              for (let i = 0; i < this.provinceList.length; i += 2) {
                this.provinceList[i].id = i + 1;
                this.odd.push(this.provinceList[i]);
              }
              for (let i = 1; i < this.provinceList.length; i += 2) {
                this.provinceList[i].id = i + 1;
                this.even.push(this.provinceList[i]);
              }
              this.check = 0;
            }
            console.log(this.provinceList);
            res.data.data.forEach(item => {
              this.allDateInfo.push(item);
              if (
                new Date(item.date).getTime() ==
                new Date(this.selectedDate).getTime()
              ) {
                let dataList = [];
                item.provinceInfoList.forEach(item2 => {
                  if (
                    item2.name == "黑龙江省" ||
                    item2.name == "内蒙古自治区"
                  ) {
                    dataList.push({
                      name: (item2.name = item2.name.slice(0, 3)),
                      value: item2.confirm
                    });
                  } else
                    dataList.push({
                      name: (item2.name = item2.name.slice(0, 2)),
                      value: item2.confirm
                    });
                });
                myChart.hideLoading();
                myChart.setOption({
                  series: {
                    data: dataList
                  }
                });
                if (num != 0) this.$Message.success("获取数据成功！");
              }
            });
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$Message.error("获取数据失败，请检查网络连接！");
        });
    },
    changeDate(newDate, date) {
      let date1 = new Date(newDate);
      this.selectedDate =
        date1.getFullYear() +
        "-" +
        (date1.getMonth() > 9
          ? date1.getMonth() + 1
          : "0" + (date1.getMonth() + 1)) +
        "-" +
        (date1.getDate() > 9 ? date1.getDate() : "0" + date1.getDate());
    },
    chooseDataByDate() {
      if (
        new Date(item.date).getTime() == new Date(this.selectedDate).getTime()
      ) {
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "chinaMap";
</style>
