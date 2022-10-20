<script lang="ts">
import searchEngine from '../assets/json/searchEngine.json'

export default {
  name: "SearchBox",
  data() {
    return {
      searchEngineList: searchEngine,
      curEngine: {
        name: "",
        icon: "",
        searchlink: "",
        searchname: "",
        color: "",
        placeholder: ""
      }
    }
  },
  mounted() {
    const engineStr = sessionStorage.getItem("engine");
    if (engineStr) {
      this.curEngine = JSON.parse(engineStr);
    } else {
      this.curEngine = searchEngine[0];
    }
  }

}
</script>

<template>
  <div id="search">
    <div id="search-logo">
      <img v-if="curEngine.icon" :src="curEngine.icon" alt="">
    </div>
    <div id="search-box">
      <input id="search-input" type="text" placeholder="百度一下" />
      <button></button>
    </div>
  </div>
</template>

<style lang="less" scoped>
#search {
  #search-log {}

  #search-box {
    position: relative;
    height: 40px;
    *z-index: 999;
    border-right: 0;
    background: 0 0;
    background-color: #F8F8F8;
    border-radius: 10px 0 0 10px;
    border: 1px solid #4E6EF2;
    border-right: 0;
  }

  #search-input {
    height: 38px;
    widows: 100%;
    background-color: #F8F8F8;
    border: none;
    margin-left: 20px;
  }
}
</style>