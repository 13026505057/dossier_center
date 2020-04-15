<template>
    <div class="setAlarmPage"> 
        <div class="setAlarmList">
            <a-table bordered :columns="columns_warn" :pagination="pagination"
                :data-source="tableData_warn" class="tableCaseData" size="middle"
                @change="handleTableChange" :loading="loading">
                <template slot="range" slot-scope="text,record">
                    <template v-if="record.editable" >
                        <a-input style="margin: -5px 0;width: 100px" v-model="editDataInfo.warn_guize_num" />
                        {{record.rang_tip}}
                    </template>
                    <template v-else>{{text}}{{record.rang_tip}}</template>
                </template>
                <template slot="switch" slot-scope="text,record">
                    <a-switch checkedChildren="开" unCheckedChildren="关" 
                        :checked="record.enable==0?true:false" @change="switchBtn(record.key,record.enable)"/>
                </template>
                <template slot="operation" slot-scope="text,record">
                    <div class="editable-row-operations">
                        <span v-if="record.editable">
                            <a @click="confirmBtn()" class="editDate">确认</a>
                            <a-popconfirm title="确定取消?" @confirm="resetBtn()">取消</a-popconfirm>
                        </span>
                        <span v-else>
                            <a-button :disabled="editingKey !== ''" type="primary" size="small"
                                @click="() => edit(record.key)">修改</a-button>
                        </span>
                    </div>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                pagination: {
                    pageNum: 1,
                    pageSize: 10
                },
                loading: false,
                columns_warn: [
                    { title: '告警名称', dataIndex: 'name', },
                    { title: '告警规则', dataIndex: 'rule', },
                    { title: '告警范围', dataIndex: 'range', scopedSlots: { customRender: 'range' } },
                    { title: '开/关警告', dataIndex: 'switch', scopedSlots: { customRender: 'switch' } },
                    {
                        title: '操作', dataIndex: 'operation', key: 'operation',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                tableData_warn: [],
                editingKey: '',
                editDataInfo: {
                    warn_guize_num: '',
                    warn_guize_id: 0,
                }
            }
        },
        mounted() {
            this.getWarningListList(this.pagination);
        },
        methods: {
            // 点击修改
            edit(key) {
                const newData = [...this.tableData_warn];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = key;
                if (target) {
                    target.editable = true;
                    this.tableData_warn = newData;
                }
                this.editDataInfo['warn_guize_num'] = target.range;
                this.editDataInfo['warn_guize_id'] = target.key;
            },
            // 确认修改
            async confirmBtn() {
                let returnData_edit = await this.$api.editWarnDataInfo({
                    ...this.editDataInfo
                })
                if(returnData_edit){
                    if(returnData_edit.code == '0')
                        this.getWarningListList(this.pagination);
                        this.resetBtn();
                }
            },
            //重置
            resetBtn(){
                const newData = [...this.tableData_warn];
                const target = newData.filter(item => this.editDataInfo['warn_guize_id'] === item.key)[0];
                this.editingKey = '';
                if (target) {
                    target.editable = false;
                    this.tableData_warn = newData;
                }
                this.editDataInfo['warn_guize_num'] = '';
                this.editDataInfo['warn_guize_id'] = 0;
            },
            // 开关警告
            async switchBtn(key,status){
                let returnData_edit = await this.$api.editWarnDataInfo({
                    is_enable: status==1?0:1,
                    warn_guize_id: key
                })
                console.log(returnData_edit)
                this.getWarningListList(this.pagination);
            },
            handleTableChange(pagination) {
                // console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                pager.pageNum = pagination.current;
                this.pagination = pager;
                this.getWarningListList(this.pagination);
            },
            //获取警告列表
            async getWarningListList(dataInfo){
                this.loading = true;
                const warnList = await this.$api.getWarnList_Page(dataInfo);
                // console.log(departmentList);
                const pagination = { ...this.pagination };
                const queryWarnList = warnList.data.list;
                const warnData = [];
                queryWarnList.forEach(item=>{
                    warnData.push({
                        key: item.warn_guize_id,
                        name: item.warn_guize_name,
                        rule: item.warn_guize_judge,
                        range: item.warn_guize_num,
                        rang_tip: item.warn_guize_danwei_name,
                        enable: item.is_enable
                    })
                })
                this.tableData_warn= warnData;
                pagination.total = warnList.data.total;
                this.pagination = pagination;
                this.loading = false;
            },
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .setAlarmPage{
        padding: 20px 0;
        .setAlarmList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
            overflow: auto;
            .addCaseInfo{
                text-align: left;
                padding-left: 20px; 
                color: white;
                span{
                    display: inline-block;
                    padding: 5px 20px;
                    background-color: @bgBtnColor;
                    border-radius: 5px;
                    i{
                        margin-right: 5px;
                    }
                }
            }
            .tableCaseData{
                margin-top: 20px;
                .ant-table table, .ant-table-thead > tr > th{
                    text-align: center;
                }
                .editDate{
                    margin-right: 5px;
                }
            }
        }
    }
</style>