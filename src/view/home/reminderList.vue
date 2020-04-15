<template>
    <div class="warningPage">
        <div class="warningList">
            <a-tabs :defaultActiveKey="1" tabPosition="top" @change="tabActiveInfo" style="text-align: left;">
                <a-tab-pane v-for="item in warnBtnTab" :tab="item.name" :key="item.key">
                    <a-table bordered :columns="columns_warn" :pagination="pagination"
                        :data-source="tableData_warn" class="tableCaseData" size="middle"
                        @change="handleTableChange" :loading="loading" >
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        data(){
            return{
                //催办警告tab
                warnBtnTab: [],
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                },
                loading: false,
                columns_warn: [
                    { title: '#', dataIndex: 'index', },
                    { title: '催办内容', dataIndex: 'warn_content', },
                    { title: '催办时间', dataIndex: 'warn_time', },
                    { title: '催办结果', dataIndex: 'warn_result', },
                ],
                tableData_warn: [],
            }
        },
        computed: {
            // 权限认证
            ...mapState(['roleData']),
        },
        methods: {
            //分页
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getWarningList({
                    ...this.pagination,
                    msg_type: this.warnBtnTab[0].code,
                });
            },
            //获取警告tab信息
            getWarningTabList(dataInfo){
                this.$api.getWarnList_Page(dataInfo).then((warnList)=>{
                    const queryWarnList = warnList.data.list;
                    const warnData = [];
                    queryWarnList.forEach(item=>{
                        warnData.push({
                            key: item.warn_guize_id,
                            name: item.warn_guize_name,
                            code: item.warn_guize_code
                        })
                    })
                    this.warnBtnTab = warnData;
                    if(!this.roleData.includes('3'))
                        this.warnBtnTab.splice(2,4);
                    if(!this.roleData.includes('4'))
                        this.warnBtnTab.pop(1)

                    this.getWarningList({
                        ...this.pagination,
                        msg_type: this.warnBtnTab[0].code,
                    });
                });    
            },
            //获取催办列表
            async getWarningList(dataInfo){
                this.loading = true;
                const warnList = await this.$api.getAlarmTipList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryCaseList = warnList.data.list;
                const warnData = [];
                queryCaseList.forEach((item,index)=>{
                    warnData.push({
                        key: item.msg_id,
                        index: index+1,
                        warn_content: item.msg_content,
                        warn_time: item.msg_create_time,
                        warn_result: item.msg_readed=='1'?'已处理':'未处理'
                    })
                })
                this.tableData_warn= warnData;
                pagination.total = warnList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
            tabActiveInfo(e){
                console.log(e);
                this.warnBtnTab.forEach(item=>{
                    if(item.key == e){
                        this.pagination.pageNum = 1;
                        this.getWarningList({
                            ...this.pagination,
                            msg_type: item.code,
                        });
                    }    
                })
            },
        },
        mounted() {
            this.getWarningTabList({ pageNum:1,pageSize:100 });
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .warningPage{
        padding: 20px 0;
        .warningList{
            padding: 20px 0;
            height: 100%;
            background-color: white;
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