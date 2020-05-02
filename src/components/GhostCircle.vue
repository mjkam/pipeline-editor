<template>
  <g transform="matrix(1, 0, 0, 1, 100, 100)" data-type="output" class="ghost node">
    <circle class="ghost-circle" cx="0" cy="0" r="20"></circle>
  </g>
</template>

<script>
export default {
  name: 'GhostCircle',
  props: {},
  methods: {},
  computed: {}
}


</script>

<style lang="scss" scoped>
.ghost {
  stroke: #c3c3c3;
  stroke-width: 2px;
  stroke-dasharray: 5 3;
  fill: #fff;
}

</style>