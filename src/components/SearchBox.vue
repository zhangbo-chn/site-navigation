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
    this.curEngine = engineStr ? JSON.parse(engineStr) : searchEngine[0];
  },
  methods: {
    getImgSrc(img: string) {
      return new URL(`../${img}`, import.meta.url).href;
    },
    doSearch() {
      console.log("do search")
    }
  }
}
</script>

<template>
  <div id="search">
    <div id="search-logo-big">
      <img src="" alt="">
    </div>
    <div id="search-box">
      <div id="search-logo">
        <img v-if="curEngine.icon" :src="getImgSrc(curEngine.icon)" alt="">
      </div>
      <input id="search-input" type="text" :placeholder="curEngine.placeholder" size="50" />
      <img id="search-btn" src="@/assets/img/icon-search.svg" @click="doSearch" alt="">
    </div>
  </div>
</template>

<style lang="less" scoped>
#search {
  #search-log-big {}

  #search-box {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    border-right: 0;
    background: 0 0;
    padding: 0 6px;
    background-color: #F8F8F8;
    border-radius: 10px;
    border: 1px solid #4E6EF2;

    #search-logo img {
      width: 32px;
      height: 32px;
    }

    #search-input {
      height: 38px;
      width: 100%;
      background-color: #F8F8F8;
      border: none;
      margin: 0 8px;
    }

    #search-btn {
      width: 26px;
      height: 26px;
    }
  }


}
</style>