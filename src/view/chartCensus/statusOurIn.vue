<template>
    <div class="statusOutInPage"> 
        <div class="statusOutInList">
            <G2Data :charData="lesortData_outIn" id="outInChart" :typeGShow="typeGShow_histogramD"></G2Data>
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
                typeGShow_histogramD: {
                    type: 'histogram_d',
                    title: '',
                    heightScroll: window.screen.height -100 -66 -40 -40 -33 -40
                    //100:浏览器captions, 66:header, 40:box_padding(外层), 40: box_padding(里层)
                },
            }
        },
        computed: {
            ...mapState({
                lesortData_outIn: 'lesortData_outIn'
            }),
        },
        methods: {
            
        },
        mounted() {
            console.log(window.screen.height - 66 -40 -40 -33)
        },
    }
</script>

<style lang="less" scope>
    @bgBtnColor: #1F62D1;
    .statusOutInPage{
        padding: 20px 0;
        .statusOutInList{
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