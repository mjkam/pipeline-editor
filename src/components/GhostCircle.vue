<template>
  <g 
    :transform="`matrix(1, 0, 0, 1, ${draggingPort.mouseX}, ${draggingPort.mouseY})`" 
    class="ghost node">
    <circle class="ghost-circle" cx="0" cy="0" r="20"></circle>
  </g>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'GhostCircle',
  computed: {
    ...mapGetters([
      'draggingPort',
    ])
  }
}
</script>

<style lang="scss" scoped>

.ghost {
  stroke: #c3c3c3;
  stroke-width: 2px;
  stroke-dasharray: 5 3;
  fill: transparent;
}

</style>