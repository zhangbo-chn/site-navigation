export function getImgSrc(url: string) {
  return new URL(`../assets/${url}`, import.meta.url).href;
}