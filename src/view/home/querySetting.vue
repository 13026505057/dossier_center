<template>
    <div class="querySettingPages">
        <div class="querySettingList">
            <a-row :gutter="16" justify="center" class="searchBtnInfo">
                <a-col class="gutter-row" :span="8">
                    <a-range-picker @change="confirmData" separator="至" :placeholder="['开始时间','结束时间']">
                        <i class="iconfont icon-yemian" slot="suffixIcon"></i>
                    </a-range-picker>
                </a-col>
            </a-row>
            <a-table bordered :columns="columns_caseLog" :loading="loading" :pagination="pagination"
                :data-source="tableData_caseLog" class="tableCaseData" size="middle" @change="handleTableChange">
            </a-table>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import 'moment/locale/zh-cn';
    moment.locale('zh-cn');

    export default {
        data(){
            return{
                columns_caseLog: [
                    { title: '操作时间', dataIndex: 'time', },
                    { title: '操作内容', dataIndex: 'content', },
                    { title: '操作模块', dataIndex: 'model', },
                    { title: '操作具体动作', dataIndex: 'action', },
                    { title: '操作信息描述', dataIndex: 'desc', },
                    { title: '结果', dataIndex: 'result', },
                ],
                tableData_caseLog: [],
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                loading: false,
            }
        },
        mounted() {
            this.systemLogList_Page(this.pagination);
        },
        methods: {
            confirmData(date, dateString) {
                console.log(dateString)
                this.pagination.pageNum = 1;
                this.pagination.current = 1;
                this.systemLogList_Page({
                    pageNum: 1,
                    pageSize: 10,
                    begin_create_time: dateString[0],
                    end_create_time: dateString[1],
                })
            },
            // 分页操作
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.systemLogList_Page(this.pagination);
            },
            //获取操作记录列表
            async systemLogList_Page(dataInfo){
                this.loading = true;
                const queryListData = await this.$api.systemLogList_Page(dataInfo);
                // console.log(queryListData);
                const pagination = { ...this.pagination };
                const queryCaseList = queryListData.data.list;
                const queryData = [];
                queryCaseList.forEach(item=>{
                    queryData.push({
                        key: item.log_id,
                        time: item.create_time,
                        content: item.log_content,
                        model: item.log_model,
                        action: item.log_action,
                        desc: item.log_desc,
                        result: item.result,
                    })
                })
                this.tableData_caseLog = queryData;
                pagination.total = queryListData.data.total;
                this.pagination = pagination;
                this.loading = false;
                
            },
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .querySettingPages{
        padding: 20px 0;
        .querySettingList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            .searchBtnInfo{
                padding: 0 10px;
            }
            .tableCaseData{
                margin-top: 20px;
                .ant-table table, .ant-table-thead > tr > th{
                    text-align: center;
                }
                .printQr{
                    display: inline-block;
                    padding: 0 5px;
                    background-color: @bgBtnColor;
                    color: white;
                    border-radius: 5px;
                }
            }
        }
    }
</style>