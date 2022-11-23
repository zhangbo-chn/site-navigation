<script setup lang="ts">
import { watch, ref } from 'vue'
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

let searchEngineList = searchEngine,
  searchText = ref<string>(""),
  curEngine = ref<Engine>({
    name: "",
    icon: "",
    logo: "",
    color: "",
    searchlink: "",
    searchname: "",
    placeholder: "",
    extra: null
  }),
  searchList = ref<string[]>([]),
  isShowSearchList = ref<boolean>(false),
  curSearchItem = ref<number>(-1),
  isSearchListLock = false,
  oldSearchText = "",
  isShowEngineList = ref<boolean>(false),
  isSearchInputFouce = ref<boolean>(false)

const engineStr = localStorage.getItem("engine");
curEngine.value = engineStr ? JSON.parse(engineStr) : searchEngineList[0];
localStorage.setItem("engine", JSON.stringify(curEngine.value));

function getImgSrc(url: string) {
  return new URL(`../assets/${url}`, import.meta.url).href;
}

function checkForm(e: any) {
  if (searchText.value.replace(/\s+/g, "") !== "") {
    return
  }
  e.preventDefault()
}

function searchListClick(event: any) {
  window.location.href = event.currentTarget.dataset.href
}

function choseSearchItem(event: any) {
  if (searchList.value.length === 0) return;

  if (event.keyCode === 38) {
    if (curSearchItem.value === -1) {
      curSearchItem.value = searchList.value.length - 1
      searchText.value = searchList.value[curSearchItem.value]
    } else {
      curSearchItem.value--
      if (curSearchItem.value === -1) {
        searchText.value = oldSearchText
      } else {
        searchText.value = searchList.value[curSearchItem.value]
      }
    }
    isSearchListLock = true
  } else if (event.keyCode === 40) {
    if (curSearchItem.value === searchList.value.length - 1) {
      curSearchItem.value = -1
      searchText.value = oldSearchText
    } else {
      curSearchItem.value++
      searchText.value = searchList.value[curSearchItem.value]
    }
    isSearchListLock = true
  }
}

function liHover(index: number) {
  curSearchItem.value = index
}

function choseEngine(name: string) {
  if (curEngine.value.name !== name) {
    for (const r of searchEngineList) {
      if (r.name === name) {
        curEngine.value = r
        isShowEngineList.value = false
        localStorage.setItem("engine", JSON.stringify(curEngine.value))
        return
      }
    }
  }
}

function queryString(obj: Record<string, unknown>) {
  const str = Object.keys(obj).map(r => `${r}=${obj[r]}`).join('&')
  return str
}

watch(
  searchText, (val: string) => {
    if (isSearchListLock) {
      isSearchListLock = false
      return
    }
    curSearchItem.value = -1
    oldSearchText = searchText.value
    if (val === "") {
      searchList.value = []
      isShowSearchList.value = false
    } else {
      window.suggestSearch = function (msg: any) {
        if (msg['s'] && msg['s'].length > 0) {
          searchList.value = msg['s']
          isShowSearchList.value = true
        }
      }
      const script = document.createElement('script')
      script.src = "https://www.baidu.com/su?wd=" + val + "&cb=suggestSearch"
      document.head.appendChild(script)
      document.head.removeChild(script)

      document.onclick = () => {
        document.onclick = null
        searchList.value = []
        isShowSearchList.value = false
      }
    }
  }
)

watch(isShowEngineList, (val: any) => {
  if (val) {
    setTimeout(() => {
      document.onclick = () => {
        document.onclick = null
        isShowEngineList.value = false
      }
    })
  }
})
</script>


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
      'search-box-shadow': isSearchInputFouce
    }">
      <img id="search-icon" @click="isShowEngineList = !isShowEngineList" v-if="curEngine.icon"
        :src="getImgSrc(curEngine.icon)" alt="" />
      <form @submit="checkForm" ref="searchFrom" :action="curEngine.searchlink" id="search-form">
        <input id="search-input" v-model="searchText" type="text" autocomplete="new-password"
          :name="curEngine.searchname" :placeholder="curEngine.placeholder" size="100"
          @keydown="choseSearchItem($event)" contenteditable="true" @focus="isSearchInputFouce = true"
          @blur="isSearchInputFouce = false" />
        <template v-if="curEngine.extra">
          <input v-for="(v, k) in curEngine.extra" :key="k" type="hidden" :name="k" :value="v">
        </template>
        <button type="submit">
          <img id="search-btn" :src="getImgSrc(`img/searchBox/icon-search.svg`)" alt="" />
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


<style scoped lang="scss">
#search {
  max-width: 35rem;
  margin: 0 auto;

  #search-logo {
    text-align: center;
    #search-logo-img {
      max-width: 60%;
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

  .search-box-shadow {
    box-shadow: 0 0 8px;
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