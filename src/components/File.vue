<template>
  <g class="node step" transform="matrix(1, 0, 0, 1, 0, 0)" tabindex="-1">
    <g class="core" transform="matrix(1, 0, 0, 1, 0, 0)">
      <circle cx="0" cy="0" r="37" class="outer"></circle>
      <circle cx="0" cy="0" r="27.75" class="inner"></circle>
      <svg class="node-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 499 462.86" x="-11" y="-10" width="20" height="20">
        <path d="M386.06,0H175V58.29l50,50V50H337.81V163.38h25l86.19.24V412.86H225V353.71l-50,50v59.15H499V112.94Zm1.75,113.45v-41l41.1,41.1Z"></path>
        <polygon points="387.81 1.06 387.81 1.75 387.12 1.06 387.81 1.06"></polygon>
        <polygon points="290.36 231 176.68 344.68 141.32 309.32 194.64 256 0 256 0 206 194.64 206 142.32 153.68 177.68 118.32 290.36 231"></polygon>
      </svg>
    </g>
    <text transform="matrix(1.1219, 0, 0, 1.1219, 0, 67)" class="title label"> name </text>
  </g>
</template>

<script>
export default {
  name: 'File'
}
</script>

<style lang="scss" scoped>
.outer {
  fill: #fff;
  stroke: #9a9a9a;
  stroke-width: 2px;
}

.inner {
  fill: #c3c3c3;
}

.node-icon {
  fill: #333;
  stroke: #333;
  stroke-width: 3px;
  stroke-linecap: round;
}

.title {
  fill: #333;
  stroke: #fff;
  stroke-width: 4px;
  text-anchor: middle;
  paint-order: stroke;
  stroke-linecap: butt;
  stroke-linejoin: miter;
}
</style>