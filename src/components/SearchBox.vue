<template>
  <div id="search">
    <div id="search-logo">
      <img id="search-logo-img" :src="getImgSrc(curEngine.logo)" alt="">
    </div>
    <div id="search-box" :style="'border-color:' + curEngine.color" :class="{
      'search-box-active': isShowSearchList,
      'search-box': !isShowSearchList,
      'search-box-radius-0': !isShowSearchList && !isShowEngineList,
      'search-box-radius-1': isShowSearchList,
      'search-box-radius-2': isShowEngineList,
    }">
      <img id="search-icon" @click="isShowEngineList = !isShowEngineList" v-if="curEngine.icon"
        :src="getImgSrc(curEngine.icon)" alt="" />
      <form @submit="checkForm" ref="searchFrom" :action="curEngine.searchlink" id="search-form">
        <input id="search-input" v-model="searchText" type="text" autocomplete="new-password"
          :name="curEngine.searchname" :placeholder="curEngine.placeholder" size="100"
          @keydown="choseSearchItem($event)" contenteditable="true" />
        <template v-if="curEngine.extra">
          <input v-for="(v, k) in curEngine.extra" :key="k" type="hidden" :name="k" :value="v">
        </template>
        <button type="submit">
          <img id="search-btn" src="@/assets/img/searchBox/icon-search.svg" alt="" />
        </button>
      </form>
    </div>
    <div id="search-list" v-show="searchList.length > 0" :style="'border-color:' + curEngine.color">
      <ul>
        <li v-for="(item, index) in searchList" :key="index"
          :data-href="curEngine.searchlink + '?' + curEngine.searchname + '=' + item + (curEngine.extra ? '&' + queryString(curEngine.extra) : '')"
          @click="searchListClick($event)" @mouseenter="liHover(index)"
          :class="{ 'li-active': curSearchItem === index }">
          {{ item }}
        </li>
      </ul>
    </div>
    <div id="engine-list" v-if="isShowEngineList" :style="'border-color:' + curEngine.color">
      <ul>
        <template v-for="(item, index) in searchEngineList" :key="index">
          <li v-if="curEngine.name !== item.name" @click="choseEngine(item.name)">
            <img class="engine-icon" :src="getImgSrc(item.icon)" alt="">
            <span class="engine-name">{{ item.name }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import searchEngine from '../assets/json/searchEngine.json'

interface Engine {
  name: string,
  icon: string,
  logo: string,
  color: string,
  searchlink: string,
  searchname: string,
  placeholder: string,
  extra: Record<string, unknown> | null
}

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
        placeholder: "",
        extra: null
      } as Engine,
      searchList: [],
      isShowSearchList: false,
      curSearchItem: -1,
      isSearchListLock: false,
      oldSearchText: "",
      isShowEngineList: false
    }
  },
  mounted() {
    const engineStr = localStorage.getItem("engine")
    this.curEngine = engineStr ? JSON.parse(engineStr) : this.searchEngineList[0]
    localStorage.setItem("engine", JSON.stringify(this.curEngine))
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
    liHover(index: number) {
      this.curSearchItem = index
    },
    choseEngine(name: string) {
      if (this.curEngine.name !== name) {
        for (const r of this.searchEngineList) {
          if (r.name === name) {
            this.curEngine = r
            this.isShowEngineList = false
            localStorage.setItem("engine", JSON.stringify(this.curEngine))
            return
          }
        }
      }
    },
    queryString(obj: Record<string, unknown>) {
      const str = Object.keys(obj).map(r => `${r}=${obj[r]}`).join('&')
      return str
    }
  },
  watch: {
    searchText: {
      handler: function (val) {
        if (this.isSearchListLock) {
          this.isSearchListLock = false
          return
        }
        this.curSearchItem = -1
        this.oldSearchText = this.searchText
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
            document.onclick = null
            this.searchList = []
            this.isShowSearchList = false
          }
        }
      }
    },
    isShowEngineList: function (val) {
      if (val) {
        setTimeout(() => {
          document.onclick = () => {
            document.onclick = null
            this.isShowEngineList = false
          }
        })
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
    border-top: 1px solid;
    border-left: 1px solid;
    border-right: 1px solid;
  }

  .search-box {
    border: 1px solid;
  }

  .search-box-radius-0 {
    border-radius: 10px;
  }

  .search-box-radius-1 {
    border-radius: 10px 10px 0 0;
  }

  .search-box-radius-2 {
    border-radius: 10px 10px 10px 0;
  }

  #search-box {
    margin: 0 auto;
    display: flex;
    align-items: center;
    width: 100%;
    height: 42px;
    background: 0 0;
    padding: 0 10px;
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
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;

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
        background-color: #d0f7d0;
        cursor: pointer;
      }
    }
  }

  #engine-list {
    border-left: 1px solid;
    border-right: 1px solid;
    border-bottom: 1px solid;
    border-radius: 0 0 10px 10px;
    margin-top: -1px;
    background-color: #FDFEFE;
    padding-top: 1px;
    padding-bottom: 6px;
    width: 100px;

    ul {
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -khtml-user-select: none;
      user-select: none;

      li {
        width: 100%;
        padding-left: 10px;
        height: 26px;
        line-height: 26px;
        display: flex;
        justify-items: center;
        align-items: center;
        cursor: pointer;
      }

      li:hover {
        background-color: aqua;
        border-radius: 10px;
      }
    }

    .engine-icon {
      width: 22px;
      height: 22px;
    }

    .engine-name {
      margin-left: 8px;
      font-size: 16px;
      color: #575757;
    }
  }
}
</style>