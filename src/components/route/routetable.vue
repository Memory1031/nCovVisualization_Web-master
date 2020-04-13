<template>
  <div style="height:100%">
    <Row>
      <div class="button">
        <!--        <input type="file" placeholder="请选择表格文件" @change="importExcel($event.target)"></input>-->
        <!--        <Upload on-success="importExcel" action="/" :format="['xlsx','xls']" auto-upload="false">-->
        <!--          <Button icon="ios-cloud-upload-outline" size="large">Upload files</Button>-->
        <!--        </Upload>-->
        <el-upload
          ref="upload"
          action="/"
          :show-file-list="false"
          :on-change="importExcel"
          :auto-upload="false"
        >
          <el-button slot="trigger" icon="el-icon-upload" size="small" type="primary">上传文件</el-button>
        </el-upload>
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="无法检索到符合条件的城市信息"
        border
        :loading="loading"
        height="650"
        :columns="columns"
        :data="scoreData"
      ></Table>
      <Page
        :total="this.excelLength"
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
import XLSX from "xlsx";
import expandRow from "./table-expand.vue";
export default {
  components: { expandRow },
  data() {
    return {
      loading: false,
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
      addressData: [],
      excelLength: 0,
      dataCount: 0, //总条数
      pageCurrent: 1, //当前页
      nowData: [],
      scoreData: []
    };
  },
  methods: {
    importExcel(file) {
      this.loading = true;
      this.excelLength = 0;
      this.addressData = [];
      this.pageCurrent = 0;
      this.scoreData = [];
      this.nowData = [];
      let list = [];
      let num = 0;
      let self = this;
      const types = file.name.split(".")[1];
      const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
        item => item === types
      );
      if (!fileType) {
        this.$Message.error("格式错误！请重新选择");
        return;
      }
      this.file2Xce(file).then(tab => {
        if (tab && tab.length > 0) {
          this.tab = tab;
          if (this.tab.length != 0) {
            this.xlscList = [];
            this.excelLength = parseInt(
              this.tab[0].sheet[this.tab[0].sheet.length - 1]
                .split("=")[0]
                .split("AK")[1] - 1
            );
            console.log(this.excelLength);
            let address = "";
            let pd = 0;
            this.tab[0].sheet.forEach((item, index) => {
              if (item.startsWith("J")) {
                address += item.split("'")[1];
              } else if (item.startsWith("K")) {
                address += item.split("'")[1];
              } else if (item.startsWith("L")) {
                address += item.split("'")[1];
              } else if (item.startsWith("M")) {
                address += item.split("'")[1];
              } else if (item.startsWith("N")) {
                address += item.split("'")[1];
                if (pd == 1) {
                  this.addressData.push({
                    address: address
                  });
                  if (num < 10) {
                    list.push(address);
                    num++;
                  }
                }
                pd = 1;
                address = "";
              }
            });
            axios({
              url: apiRoot + "/epidemic/assessment",
              method: "post",
              data: {
                addressList: list
              }
            })
              .then(res => {
                if (res.data.code == 200) {
                    console.log(res)
                  res.data.data.assessmentList.forEach(item => {
                    this.scoreData.push(item);
                  });
                  console.log(this.scoreData);
                  this.loading = false;
                } else {
                  this.$Message.error(res.data.message);
                  this.loading = false;
                }
              })
              .catch(e => {
                this.$Message.error("请检查网络连接！");
                this.loading = false;
              });
          }
        }
      });
    },
    file2Xce(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = e.target.result;
          this.wb = XLSX.read(data, {
            type: "binary"
          });
          const result = [];
          this.wb.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_formulae(this.wb.Sheets[sheetName])
            });
          });
          resolve(result);
        };
        reader.readAsBinaryString(file.raw);
        // reader.readAsBinaryString(file) // 传统input方法
      });
    },
    changepage(index) {
      //需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
      this.scoreData = [];
      this.loading = true;
      let _start = (index - 1) * 10;
      //需要显示结束数据的index
      let _end = index * 10;
      //截取需要显示的数据
      this.nowData = this.addressData.slice(_start, _end);
      let list = [];
      this.nowData.forEach(item => {
        list.push(item.address);
      });
      axios({
        url: apiRoot + "/epidemic/assessment",
        method: "post",
        data: {
          addressList: list
        }
      })
        .then(res => {
          if (res.data.code == 200) {
              console.log(res)
            res.data.data.assessmentList.forEach(item => {
              this.scoreData.push(item);
            });
            console.log(this.scoreData);
            this.loading = false;
          } else {
            this.$Message.error(res.data.message);
            this.loading = false;
          }
        })
        .catch(e => {
          this.$Message.error("请检查网络连接！");
          this.loading = false;
        });
      //储存当前页
      this.pageCurrent = index;
    }
  }
};
</script>

<style scoped lang="scss">
@import "routetable";
</style>


