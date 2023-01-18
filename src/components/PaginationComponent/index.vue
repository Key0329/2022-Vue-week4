<script>
export default {
  name: 'pagination-component',
  props: {
    pages: {
      type: Object,
      required: true
    }
  },
  methods: {
    changePage(page) {
      this.$emit('getProductsData', page)
    }
  }
}
</script>

<template src="./template.html"></template>
