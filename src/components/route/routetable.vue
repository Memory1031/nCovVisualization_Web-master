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
          :auto-upload="false">
          <el-button
            slot="trigger"
            icon="el-icon-upload"
            size="small"
            type="primary">
            上传文件
          </el-button>
        </el-upload>
      </div>
    </Row>
    <Row>
      <Table
        size="large"
        no-data-text="无法检索到符合条件的城市信息"
        stripe
        border
        :loading="loading"
        height="650"
        :columns="columns"
        :data="nowData"
      ></Table>
      <Page :total="this.excelLength" :page-size="10" @on-change="changepage" style="text-align: center"
            show-total show-elevator/>
    </Row>

  </div>
</template>

<script>
  import axios from 'axios';
  import XLSX from 'xlsx'

export default {
    data() {
        return {
            loading: false,
            columns: [
                // {
                //     type: "expand",
                //     width: 50,
                //     render: (h, params) => {
                //         return h(expandRow, {
                //             props: {
                //                 row: params.row
                //             }
                //         });
                //     }
                // },
                // {
                //     type: "index",
                //     width: 75,
                //     align: "center",
                //     title: '序号'
                // },
                {
                    title: "地址",
                    key: "address",
                    align: 'center',
                    // width: 200
                },
                // {
                //     title: "城市",
                //     key: "city"
                // },
                // {
                //     title: "城市评分",
                //     key: "cityscore"
                // },
                // {
                //     title: "校区",
                //     key: "campus"
                // },
                // {
                //     title: "校区评分",
                //     key: "campusscore"
                // },
                // {
                //     title: "总分（火车）",
                //     key: "tfinal"
                // },
                // {
                //     title: "总分（飞机）",
                //     key: "pfinal"
                // },
                // {
                //     title: "危险指数",
                //     key: "grade"
                // }
            ],
            addressData: [
            ],
            excelLength: 0,
            dataCount: 0,//总条数
            pageCurrent: 1,//当前页
            nowData: [],
        };
    },
    methods: {
        importExcel(file) {
            this.loading = true;
            this.excelLength = 0;
            this.addressData = [];
            this.pageCurrent = 0;
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
                        this.excelLength = parseInt(this.tab[0].sheet[this.tab[0].sheet.length - 1].split('=')[0].split('AK')[1] - 1)
                        console.log(this.excelLength)
                        let address = '';
                        let pd = 0;
                        this.tab[0].sheet.forEach((item, index) => {
                            if(item.startsWith('J')){
                                address += item.split('\'')[1]
                            }else if(item.startsWith('K')){
                                address += item.split('\'')[1]
                            }else if(item.startsWith('L')){
                                address += item.split('\'')[1]
                            }else if(item.startsWith('M')){
                                address += item.split('\'')[1]
                            }else if(item.startsWith('N')){
                                address += item.split('\'')[1]
                                if(pd == 1){
                                    this.addressData.push({
                                        address: address
                                    })
                                    if(num < 10){
                                        this.nowData.push({
                                            address: address
                                        })
                                        num++;
                                    }
                                }
                                pd = 1;
                                address = ''
                            }
                        });
                        this.loading = false;
                        console.log(this.addressData)
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
            let _start = (index - 1) * 10;
            //需要显示结束数据的index
            let _end = index * 10;
            //截取需要显示的数据
            this.nowData = this.addressData.slice(_start, _end);
            //储存当前页
            this.pageCurrent = index;
        },
    }
}
</script>

<style scoped lang="scss">
  @import "routetable";
</style>
