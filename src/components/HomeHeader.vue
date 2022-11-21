<script setup lang="ts">
import { ref } from 'vue';

const themeBtnBg = {
  dark: 'img/home/dark.svg',
  light: 'img/home/light.svg',
}

let btnImg = ref<string>("");
let curTheme = ref<string>("");

curTheme.value = localStorage.getItem("theme") || "";
changeTheme(curTheme.value === "dark");

function getImgSrc(url: string) {
  return new URL(`../assets/${url}`, import.meta.url).href;
}

function changeTheme(isThemeDark: boolean) {
  if (isThemeDark) {
    document.documentElement.setAttribute('theme', 'dark');
    curTheme.value = "dark";
    btnImg.value = themeBtnBg.dark;
  } else {
    curTheme.value = "light";
    document.documentElement.removeAttribute('theme');
    btnImg.value = themeBtnBg.light;
  }
  localStorage.setItem("theme", curTheme.value);
}

</script>

<template>
  <div id="homeHeader">
    <div id="header-left"></div>
    <div id="header-right">
      <img :src="getImgSrc(btnImg)" @click="changeTheme(curTheme === 'dark' ? false : true)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
#homeHeader {
  width: 100%;
  display: flex;
  justify-content: space-between;

  #header-right {
    >img {
      width: 50px;
      height: 50px;
    }
  }

}
</style>