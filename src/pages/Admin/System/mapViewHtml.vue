<template>
    <div class="ex-pages" style="overflow: hidden">
        <iframe frameborder="0" :src="mapViewUrl" style="width: 100%;height: 100%;"></iframe>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                mapViewUrl:''
            }
        },
        mounted() {
            let token = '23123'
            this.mapViewUrl = '/mapViewHtml/html/mapview.html?token='+token
        }
    }
</script>

<style scoped>

</style>