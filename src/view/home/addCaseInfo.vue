<template>
    <div class="addCaseInfoPage"> 
        <div class="addCaseInfoList">
            <div class="addCaseInfo">
                <span><i class="iconfont icon-cf-c101"></i>新增</span>
            </div>
            <a-table bordered :columns="columns_dossier"
                :data-source="tableData_dossier" class="tableCaseData" size="middle">
                <template v-slot:operation>
                    <span class="editDate">资料修改</span>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                columns_dossier: [
                    { title: '案件/事件编号', dataIndex: 'number', },
                    { title: '案卷名称', dataIndex: 'name', },
                    { title: '涉案人员', dataIndex: 'personnelInvolved', },
                    { title: '案卷类型', dataIndex: 'type', },
                    { title: '创建日期', dataIndex: 'creatDate', },
                    { title: '主办民警', dataIndex: 'main', },
                    { title: '协办民警', dataIndex: 'operativeCivilian', },
                    { title: '环节时间', dataIndex: 'time', },
                    { title: '主办单位', dataIndex: 'mainOff', },
                    { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' }, },
                ],
                tableData_dossier: [
                    { key: 0, date: '2018-02-11', amount: 120,  type: 'income', note: 'transfer', },
                ],
            }
        },
        methods: {
            confirmData(date, dateString) {
                console.log(date, dateString);
            },
            confirmSearch(dom){
                console.log(this['case'+dom])
            }
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .addCaseInfoPage{
        padding: 20px 0;
        .addCaseInfoList{
            padding: 20px 0;
            background-color: white;
            height: 100%;
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