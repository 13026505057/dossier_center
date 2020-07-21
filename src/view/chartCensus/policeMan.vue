<template>
    <div class="statusUseCoilPage"> 
        <div class="statusUseCoilList">
            <G2Data :charData="lesortData_police" id="barChartData" :typeGShow="typeGShow_police"></G2Data>
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
        data(){
            return{
                typeGShow_police: {
                    type: 'barChart',
                    title: '办案民警统计数据',
                    heightScroll: window.screen.height -100 -66 -40 -40 -33 -40
                    //100:浏览器captions, 66:header, 40:box_padding(外层), 40: box_padding(里层)
                },
            }
        },
        computed: {
            ...mapState({
                lesortData_police: 'lesortData_police'
            }),
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