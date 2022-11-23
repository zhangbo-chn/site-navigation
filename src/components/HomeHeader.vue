<script setup lang="ts">
import { ref } from 'vue';

const themeBtnBg = {
  dark: 'img/home/dark.png',
  light: 'img/home/light.png',
}

const menuBtnBg = {
  openDark: 'img/home/menu-open-dark.svg',
  openLight: 'img/home/menu-open-light.svg',
  closeDark: 'img/home/menu-close-dark.svg',
  closeLight: 'img/home/menu-close-light.svg',
}

let btnImg = ref<string>(""),
  curTheme = ref<string>(""),
  isMenuOpen = ref<boolean>(false),
  isThemeAni = ref<boolean>(false);

curTheme.value = localStorage.getItem("theme") || "";
changeTheme(curTheme.value === "dark", true);

function getImgSrc(url: string) {
  return new URL(`../assets/${url}`, import.meta.url).href;
}

function changeTheme(isThemeDark: boolean, init: boolean) {
  if (isThemeDark) {
    curTheme.value = "dark";
    document.documentElement.setAttribute('theme', 'dark');
  } else {
    curTheme.value = "light";
    document.documentElement.removeAttribute('theme');
  }
  if (init) {
    btnImg.value = isThemeDark ? themeBtnBg.dark : themeBtnBg.light;
  } else {
    changeThemeAni(isThemeDark);
  }

  localStorage.setItem("theme", curTheme.value);
}

function changeThemeAni(isThemeDark: boolean) {
  isThemeAni.value = true;
  setTimeout(() => {
    btnImg.value = isThemeDark ? themeBtnBg.dark : themeBtnBg.light;
  }, 1000);
  setTimeout(() => {
    isThemeAni.value = false;
  }, 2000)
}

function openMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

</script>

<template>
  <div id="homeHeader">
    <div id="menu">
      <img
        :src="getImgSrc(isMenuOpen ? (curTheme === 'dark' ? menuBtnBg.openDark : menuBtnBg.openLight) : (curTheme === 'dark' ? menuBtnBg.closeDark : menuBtnBg.closeLight))"
        @click="openMenu" alt="">
    </div>
    <div id="themeBtn" :class="{
      'animation-btn': isThemeAni
    }">
      <img :src="getImgSrc(btnImg)" @click="changeTheme(curTheme === 'dark' ? false : true, false)" class="btnIcon" />
    </div>
  </div>
</template>

<style scoped lang="scss">
#homeHeader {
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;

  #menu {
    >img{
      width: 26px;
    }
  }

  #themeBtn {
    z-index: 9;

    .btnIcon {
      width: 26px;
    }
  }

  .animation-btn {
    animation: btn-up-down 2s;
    -webkit-animation: btn-up-down 2s
  }

  @keyframes btn-up-down {
    0% {
      transform: translateY(0),
    }

    50% {
      transform: translateY(-120%),
    }

    100% {
      transform: translateY(0),
    }
  }

  @-webkit-keyframes btn-up-down {
    0% {
      transform: translateY(0),
    }

    50% {
      transform: translateY(-120%),
    }

    100% {
      transform: translateY(0),
    }
  }
}
</style>