<script setup lang="ts">
import { ref } from 'vue';

const themeBtnBg = {
  dark: 'img/home/dark.png',
  light: 'img/home/light.png',
}

let btnImg = ref<string>(""),
  curTheme = ref<string>(""),
  isThemeDown = ref<boolean>(true);

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
  isThemeDown.value = false;
  setTimeout(() => {
    isThemeDown.value = true;
    btnImg.value = isThemeDark ? themeBtnBg.dark : themeBtnBg.light;
  }, 1000);
}

</script>

<template>
  <div id="homeHeader">
    <div id="themeBtn" :class="{
      'animation-btn-up': !isThemeDown,
      'animation-btn-down': isThemeDown
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
      width: 30px;
      height: 30px;
    }
  }

  .animation-btn-up {
    animation: btnUp 1s;
    -webkit-animation: btnUp 1s
  }

  .animation-btn-down {
    animation: btnDown 1s;
    -webkit-animation: btnDown 1s
  }

  @keyframes btnUp {
    0% {
      top: 10px;
    }

    100% {
      top: -30px;
    }
  }

  @-webkit-keyframes btnUp {
    0% {
      top: 10px;
    }

    100% {
      top: -30px;
    }
  }

  @keyframes btnDown {
    0% {
      top: -30px;
    }

    100% {
      top: 10px;
    }
  }

  @-webkit-keyframes btnDown {
    0% {
      top: -30px;
    }

    100% {
      top: 10px;
    }
  }
}
</style>