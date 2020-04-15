<template>
    <div class="alarmStatisPage"> 
        <div class="alarmStatisList">
            <a-row :gutter="16" justify="center" class="pieChartInfo">
                <a-col class="gutter-row" :span="12">
                    <!-- 扇形图 -->
                    <G2Data :charData="lesortData_alarm" id="typeLesort" :typeGShow="typeGShow_type"></G2Data>
                </a-col>
                <a-col class="gutter-row" :span="12">
                    <!-- 柱状图 -->
                    <G2Data :charData="lesortData_alarmHis" id="typeLesort_his" :typeGShow="typeGShow_typeHis"></G2Data>
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
        data(){
            return{ 
                typeGShow_type: {
                    type: 'pieChart',
                    title: '',
                    widthScroll: (window.screen.width - 240)/2 -16 -22 -20,
                    heightScroll: window.screen.height -100 -66 -40 -40 -33 -40
                    //100:浏览器captions, 66:header, 40:box_padding(外层), 40: box_padding(里层)
                },
                typeGShow_typeHis: {
                    type: 'histogram_type',
                    title: '',
                    widthScroll: (window.screen.width - 240)/2 -16 -22 -20,
                    heightScroll: window.screen.height -100 -66 -40 -40 -33 -40
                    //100:浏览器captions, 66:header, 40:box_padding(外层), 40: box_padding(里层)
                },
            }
        },
        computed: {
            ...mapState({
                lesortData_alarm: 'lesortData_alarm',
                lesortData_alarmHis: 'lesortData_alarmHis'
            })
        },
        methods: {
            handleChange(e,a){
                console.log(e,a)
            },
            confirmData(date, dateString) {
                console.log(date, dateString);
            },
            confirmSearch(dom){
                console.log(this['case'+dom])
            },
        },
        mounted() {
            
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .alarmStatisPage{
        padding: 20px 0;
        .alarmStatisList{
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