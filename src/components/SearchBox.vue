<template>
  <div id="search">
    <div id="search-logo">
      <img id="search-logo-img" :src="getImgSrc(curEngine.logo)" alt="">
    </div>
    <div id="search-box" :style="'border-color:'+curEngine.color">
      <img id="search-icon" v-if="curEngine.icon" :src="getImgSrc(curEngine.icon)" alt="" />
      <form @submit="checkForm" ref="searchFrom" :action="curEngine.searchlink" id="search-form">
        <input id="search-input" v-model="searchText" type="text" :name="curEngine.searchname"
          :placeholder="curEngine.placeholder" size="100" />
        <img id="search-btn" src="@/assets/img/icon-search.svg" alt="" type="submit" />
      </form>

    </div>
  </div>
</template>

<script lang="ts">
import searchEngine from '../assets/json/searchEngine.json'

export default {
  name: "SearchBox",
  data() {
    return {
      searchEngineList: searchEngine,
      searchText: "",
      curEngine: {
        name: "",
        icon: "",
        logo: "",
        color: "",
        searchlink: "",
        searchname: "",
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
    submit() {
      console.log("do search")
      console.log(this.$refs['searchFrom'])
    },
    checkForm(e: any) {
      if (this.searchText.replace(/\s+/g, "") !== "") {
        return true;
      }
      e.preventDefault();
    }
  },
  watch: {
    searchText: {
      handler: function (val, oldVal) {
        if (val === "") {
          //TODO 清空搜索提示词
        } else {
          //TODO 填充搜索提示词
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#search {

  text-align: center;

  #search-logo {
    #search-logo-img {
      max-width: 80%;
    }
  }

  #search-box {
    margin-top: 6px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 44px;
    border-right: 0;
    background: 0 0;
    padding: 0 8px;
    background-color: #FDFEFE;
    border-radius: 10px;
    border: 1px solid #4E6EF2;

    #search-icon {
      width: 22px;
      height: 22px;
    }

    #search-form {
      display: flex;
      align-items: center;

      #search-input {
        height: 42px;
        width: 100%;
        background-color: #FDFEFE;
        border: none;
        margin: 0 8px;
        font-size: 16px;
        color: #575757;
      }

      #search-btn {
        width: 26px;
        height: 26px;
      }
    }

  }


}
</style>