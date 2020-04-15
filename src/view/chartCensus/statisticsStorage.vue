<template>
    <div class="statisticsStorPage"> 
        <div class="statisticsStorList">
            <a-row :gutter="16" justify="center" class="pieChartInfo">
                <a-col class="gutter-row" :span="12">
                    <!-- 柜子案件 -->
                    <G2Data :charData="lesortData_cabinet" id="cabinetCase" :typeGShow="typeGShow_cabinet"></G2Data>
                </a-col>
                <a-col class="gutter-row" :span="12">
                    <!-- 货柜案件 -->
                    <!--<G2Data :charData="lesortData_container" id="containerCase" :typeGShow="typeGShow_container"></G2Data>-->
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
                lesortData_cabinet: 'lesortData_cabinet',
            }),
        },
        data(){
            return{
                typeGShow_cabinet: {
                    type: 'pieChart',
                    title: '卷柜使用资源统计',
                    widthScroll: (window.screen.width - 240)/2 -16 -22 -20,
                    heightScroll: window.screen.height -100 -66 -40 -40 -33 -40
                    //100:浏览器captions, 66:header, 40:box_padding(外层), 40: box_padding(里层)
                },
            }
        },
        methods: {
            
        },
        mounted() {
            // console.log(window.screen.height - 66 -40 -40 -33)
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .statisticsStorPage{
        padding: 20px 0;
        .statisticsStorList{
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