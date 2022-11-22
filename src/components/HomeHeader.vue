<script setup lang="ts">
import { ref } from 'vue';

const themeBtnBg = {
  dark: 'img/home/dark.png',
  light: 'img/home/light.png',
}

let btnImg = ref<string>(""),
  curTheme = ref<string>(""),
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

</script>

<template>
  <div id="homeHeader">
    <div id="themeBtn" :class="{
      'animation-btn': isThemeAni,
    }">
      <img :src="getImgSrc(btnImg)" @click="changeTheme(curTheme === 'dark' ? false : true, false)" class="btnIcon" />
    </div>
  </div>
</template>

<style scoped lang="scss">
#homeHeader {
  width: 100%;
  position: relative;

  #themeBtn {
    z-index: 9;
    position: absolute;
    right: 0;
    top: 10px;

    .btnIcon {
      width: 26px;
      height: 26px;
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