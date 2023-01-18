<script>
import Modal from 'bootstrap/js/dist/modal'

export default {
  name: 'product-modal-component',
  props: {
    isNew: {
      type: Boolean,
      required: true
    },
    tempProduct: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'key0329',
      bsModal: '',
      product: {}
    }
  },
  methods: {
    openModal() {
      this.bsModal.show()
    },
    closeModal() {
      this.bsModal.hide()
    },
    addImage() {
      this.product.imagesUrl.push('')
    },
    createImage() {
      this.product.imagesUrl = []
      this.product.imagesUrl.push('')
    },
    deleteImage() {
      this.product.imagesUrl.pop()
    },
    updateImage(key, e) {
      this.product.imagesUrl[key] = e
    },
    addNewProduct() {
      const data = this.product

      if (
        !this.product.title ||
        !this.product.category ||
        !this.product.unit ||
        !this.product.price ||
        !this.product.origin_price
      ) {
        alert('標題 / 分類 / 單位 / 原價 / 售價 為必填欄位')

        // eslint-disable-next-line no-useless-return
        return
      } else {
        this.$http
          .post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, { data })
          .then((res) => {
            alert(res.data.message)
            this.$emit('get-products-data')
            this.closeModal()
          })
          .catch((err) => {
            alert(err.data.message)
          })
      }
    },
    updateProduct() {
      const data = this.product
      const id = this.product.id

      if (
        !this.product.title ||
        !this.product.category ||
        !this.product.unit ||
        !this.product.price ||
        !this.product.origin_price
      ) {
        alert('標題 / 分類 / 單位 / 原價 / 售價 為必填欄位')
        // eslint-disable-next-line no-useless-return
        return
      } else {
        this.$http
          .put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`, {
            data
          })
          .then((res) => {
            alert(res.data.message)
            this.$emit('get-products-data')
            this.closeModal()
          })
          .catch((err) => {
            alert(err.data.message)
          })
      }
    },
    updateProductHandler() {
      if (this.isNew) {
        this.addNewProduct()
      } else {
        this.updateProduct()
      }
    },
    handleSubmit(type, key, e) {
      const form = new FormData(e.target)
      this.sendFormData(type, key, form)
    },
    sendFormData(type, key, form) {
      this.$http
        .post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, form)
        .then((res) => {
          const url = res.data.imageUrl
          if (type === 'multi') {
            this.product.imagesUrl[key] = url
          } else if (type === 'main') {
            this.product.imageUrl = url
          }
        })
        .catch((err) => {
          console.log(err)
          alert(err.message)
        })
    }
  },
  watch: {
    tempProduct: {
      handler(newVal) {
        this.product = {
          ...newVal
        }
      },
      deep: true
    }
  },
  mounted() {
    this.bsModal = new Modal(this.$refs.productModal)
  }
}
</script>

<template src="./template.html"></template>
