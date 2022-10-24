<template>
  <div id="search">
    <div id="search-logo">
      <img id="search-logo-img" :src="getImgSrc(curEngine.logo)" alt="">
    </div>
    <div id="search-box" :style="'border-color:'+curEngine.color"
      :class="isShowSearchList?'search-box-active':'search-box'">
      <img id="search-icon" v-if="curEngine.icon" :src="getImgSrc(curEngine.icon)" alt="" />
      <form @submit="checkForm" ref="searchFrom" :action="curEngine.searchlink" id="search-form">
        <input id="search-input" v-model="searchText" type="text" autocomplete="new-password"
          :name="curEngine.searchname" :placeholder="curEngine.placeholder" size="100"
          @keydown="choseSearchItem($event)" />
        <button type="submit">
          <img id="search-btn" src="@/assets/img/icon-search.svg" alt="" />
        </button>
      </form>
    </div>
    <div id="search-list" v-show="searchList.length>0" :style="'border-color:'+curEngine.color">
      <ul>
        <li v-for="(item,index) in searchList" :key="index"
          :data-href="curEngine.searchlink+'?'+curEngine.searchname+'='+item" :data-key="index"
          @click="searchListClick($event)" @mouseenter="liHover($event)" :class="{'li-active': curSearchItem===index}">
          <!-- <a :href="curEngine.searchlink+'?'+curEngine.searchname+'='+item"> -->
          {{item}}
          <!-- </a> -->
        </li>
      </ul>
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
      },
      searchList: [],
      isShowSearchList: false,
      curSearchItem: -1,
      isSearchListLock: false,
      oldSearchText: ""
    }
  },
  mounted() {
    const engineStr = sessionStorage.getItem("engine")
    this.curEngine = engineStr ? JSON.parse(engineStr) : searchEngine[0]
  },
  methods: {
    getImgSrc(img: string) {
      return new URL(`../${img}`, import.meta.url).href
    },
    checkForm(e: any) {
      if (this.searchText.replace(/\s+/g, "") !== "") {
        return
      }
      e.preventDefault()
    },
    searchListClick(event: any) {
      window.location.href = event.currentTarget.dataset.href
    },
    choseSearchItem(event: any) {
      if (this.searchList.length === 0) return;

      if (event.keyCode === 38) {
        if (this.curSearchItem === -1) this.oldSearchText = this.searchText
        if (this.curSearchItem === -1) {
          this.curSearchItem = this.searchList.length - 1
          this.searchText = this.searchList[this.curSearchItem]
        } else {
          this.curSearchItem--
          if (this.curSearchItem === -1) {
            this.searchText = this.oldSearchText
          } else {
            this.searchText = this.searchList[this.curSearchItem]
          }
        }
        this.isSearchListLock = true
      } else if (event.keyCode === 40) {
        if (this.curSearchItem === -1) this.oldSearchText = this.searchText
        if (this.curSearchItem === this.searchList.length - 1) {
          this.curSearchItem = -1
          this.searchText = this.oldSearchText
        } else {
          this.curSearchItem++
          this.searchText = this.searchList[this.curSearchItem]
        }
        this.isSearchListLock = true
      }
    },
    liHover(event: any) {
      this.curSearchItem = event.currentTarget.dataset.key
    }
  },
  watch: {
    searchText: {
      handler: function (val) {
        if (this.isSearchListLock) {
          this.isSearchListLock = false
          return
        }
        if (val === "") {
          this.searchList = []
          this.isShowSearchList = false
        } else {
          let self = this
          window.suggestSearch = function (msg: any) {
            if (msg['s'] && msg['s'].length > 0) {
              self.searchList = msg['s']
              self.isShowSearchList = true
            }
          }
          const script = document.createElement('script')
          script.src = "https://www.baidu.com/su?wd=" + val + "&cb=suggestSearch"
          document.head.appendChild(script)
          document.head.removeChild(script)

          document.onclick = () => {
            this.searchList = []
            this.isShowSearchList = false
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
#search {

  max-width: 550px;

  #search-logo {
    width: 100%;
    text-align: center;

    #search-logo-img {
      max-width: 80%;
    }
  }

  .search-box-active {
    border: 1px solid;
    border-bottom: none;
    border-radius: 10px 10px 0 0;
  }

  .search-box {
    border-radius: 10px;
    border: 1px solid;
  }

  #search-box {
    margin: 0 auto;
    display: flex;
    align-items: center;
    width: 100%;
    height: 42px;
    border-right: 0;
    background: 0 0;
    padding: 0 8px;
    background-color: #FDFEFE;

    #search-icon {
      width: 22px;
      height: 22px;
    }

    #search-form {
      display: flex;
      align-items: center;
      width: 100%;

      #search-input {
        height: 40px;
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

  #search-list {
    border: 1px solid #FFF;
    border-top: none;
    margin: 0 auto;
    text-align: left;
    width: 100%;
    background-color: #FDFEFE;
    padding: 8px;
    border-radius: 0 0 10px 10px;

    ul {
      width: 100%;

      li {
        height: 24px;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-pack: nowrap;
        color: #575757;
        margin-bottom: 4px;
        border-radius: 6px;
      }

      .li-active {
        color: rgb(48, 117, 237);
        background-color: #8FBC8F;
        cursor: pointer;
      }
    }


  }
}
</style>