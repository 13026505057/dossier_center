<template>
    <div class="statusUseCoilPage"> 
        <div class="statusUseCoilList">
            <a-row :gutter="16" justify="center" class="pieChartInfo">
                <a-col class="gutter-row" :span="12">
                    <!-- 刑事案件 -->
                    <G2Data :charData="lesortData_criminal" id="criminalCase" :typeGShow="typeGShow_criminal"></G2Data>
                </a-col>
                <a-col class="gutter-row" :span="12">
                    <!-- 行政案件 -->
                    <G2Data :charData="lesortData_administra" id="administraCase" :typeGShow="typeGShow_administra"></G2Data>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
    import G2Data from '@/components/G2Data.vue';
    import { mapState } from 'vuex'
    export default {
        components: {
            G2Data
        },
        computed: {
            ...mapState({
                lesortData_criminal: 'lesortData_criminal',
                lesortData_administra: 'lesortData_administra'
            }),
        },
        data(){
            return{
                checkedInfo: {
                    checkedEarly: '全部',
                    earlyTypeList: [
                        { title: '全部', itemId: 0 },
                        { title: '类型1', itemId: 1 },
                        { title: '类型2', itemId: 2 },
                    ],
                },
                tableData_dossier: [
                    { key: 0, date: '2018-02-11', amount: 120,  type: 'income', note: 'transfer', },
                ],
                typeGShow_criminal: {
                    type: 'pieChart',
                    title: '刑事案件统计',
                    widthScroll: (window.screen.width - 240)/2 -16 -22 -20,
                    heightScroll: window.screen.height -100 -66 -40 -40 -33 -40
                    //100:浏览器captions, 66:header, 40:box_padding(外层), 40: box_padding(里层)
                },
                typeGShow_administra: {
                    type: 'pieChart',
                    title: '行政案件统计',
                    widthScroll: (window.screen.width - 240)/2 -16 -22 -20,
                    heightScroll: window.screen.height -100 -66 -40 -40 -33 -40
                    //100:浏览器captions, 66:header, 40:box_padding(外层), 40: box_padding(里层)
                },
                // profitData: {
                //     data: [
                //         { item: '事例一', count: 40, percent: 40 },
                //         { item: '事例二', count: 21, percent: 21 },
                //         { item: '事例三', count: 17, percent: 17 },
                //         { item: '事例四', count: 13, percent: 13 },
                //         { item: '事例五', count: 9, percent: 9 },
                //     ],
                //     maxNum: 100
                // }
            }
        },
        methods: {
            
        },
        mounted() {
            // console.log(window.screen.height - 66 -40 -40 -33)data.forEach((itemData)=>{
            
            let returnData_cn = ['最高温度','最低温度'];
            let returnData_en = ['zgwd','zdwd'];
            let data = [
                { title: 'zgwd', value: 1 },
                { title: 'zdwd', value: 2 }
            ];
            data.forEach((itemData)=>{
                returnData_en.forEach((item,index)=>{
                    if(itemData.title == item) 
                        itemData.title = returnData_cn[index]
                })
            })
            console.log(data)
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .statusUseCoilPage{
        padding: 20px 0;
        .statusUseCoilList{
            padding: 20px 0;
            height: 100%;
            background-color: white;
            .searchBtnInfo{
                padding: 0 10px;
                text-align: left;
                padding-left: 20px;
                .marginBtn{
                    margin-right: 20px;
                }
                .comfirmAdd{
                    color: white;
                    background-color: @bgBtnColor;
                }
            }
            .pieChartInfo{
                // margin-top: 20px;
            }
        }
    }
</style>