<template>
    <div class="caseAppDetailPage"> 
        <div class="caseAppDetailList">
            <h3 class="itemData">出库申请</h3>
            <a-row :gutter="0">
                <a-col class="gutter-row itemData" :span="8" v-for="(item,index) in tableDataList" 
                    :key="index">
                    <div class="gutter-box">
                        <span class="titleItem">{{ item.title }}: </span>
                        <span class="valueItem">{{ item.value }}</span>
                    </div>
                </a-col>
            </a-row>
            <div class="settingBtn">
                <a-button type="primary" class="itemBtn" @click="appearBtn('agree')">同意</a-button>
                <a-button type="primary" class="itemBtn" @click="appearBtn('disAgree')">不同意</a-button>
                <a-button class="itemBtn" @click="goback">返回</a-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                itemDetail: {},
                tableDataList: [],
            }
        },
        created() {
            this.itemDetail = JSON.parse(this.$route.query.itemDetail);
        },
        mounted() {
            console.log(this.itemDetail)
            this.getDataDetail();
        },
        methods: {
            getDataDetail(){
                let data = [
                    { dom: 'case_police_nm',title: '案件编号' },
                    { dom: 'case_name',title: '案件名称' },
                    { dom: 'case_from',title: '案件来源' },
                    { dom: 'case_type_name',title: '案件类型' },
                    { dom: 'create_time',title: '申请时间' },
                    { dom: 'create_user_name',title: '申请人' },
                    { dom: 'sa_org_name',title: '主办单位' },
                    { dom: 'case_status_name',title: '案件状态' },
                    { dom: 'location',title: '存放位置' },
                    { dom: 'borrow_time',title: '归还时间' },
                    { dom: 'flow_type_name',title: '借阅类型' },
                ];
                let dataDom = []
                data.forEach((item,index)=>{
                    dataDom.push({
                        value: this.itemDetail[data[index].dom],
                        title: data[index].title
                    })
                })
                this.tableDataList = dataDom;
            },
            //返回上一层
            goback(){
                this.$router.go(-1);
            },
            appearBtn(data){
                this.$api.setApproveData({
                    user_approve_user_id: this.itemDetail.key,
                    approve_result: data
                }).then(()=>{
                    this.goback();
                })
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    @activeHading: #e6a23c;
    .caseAppDetailPage{
        padding: 20px 0;
        .caseAppDetailList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            overflow: auto;
            position: relative;
            .itemData{
                padding: 1% 0 1% 5%;
                text-align: left;
                .titleItem{
                    color: #666;
                    margin-right: 4%;
                    display: inline-block;
                }
            }
            h3.itemData{
                font-weight: 600;
            }
            .settingBtn{
                position: absolute;
                bottom: 20px;
                right: 20px;
                .itemBtn{
                    margin: 10px 20px;
                }
            }
        }
    }
</style>