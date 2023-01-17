<template>
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="modelHandler('createBtn')">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-start">NT$ {{ product.origin_price }}</td>
          <td class="text-start">NT$ {{ product.price }}</td>
          <td>
            <span v-if="product.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="modelHandler('editBtn', product)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="modelHandler('deleteBtn', product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination-component
      :pages="pages"
      @get-products-data="getProductsData"
    ></pagination-component>
  </div>

  <!-- Modal start-->

  <product-modal-component
    ref="productModal"
    :is-new="isNew"
    :images-url="tempProduct.imagesUrl"
    :temp-product="tempProduct"
    v-model:title="tempProduct.title"
    v-model:category="tempProduct.category"
    v-model:content="tempProduct.content"
    v-model:description="tempProduct.description"
    v-model:image-url="tempProduct.imageUrl"
    v-model:num="tempProduct.num"
    v-model:origin_price="tempProduct.origin_price"
    v-model:price="tempProduct.price"
    v-model:unit="tempProduct.unit"
    v-model:is_enabled="tempProduct.is_enabled"
    @emit-add-image="addImage"
    @emit-create-image="createImage"
    @emit-delete-image="deleteImage"
    @emit-images-url-update="updateImagesUrl"
  ></product-modal-component>
  <!-- @emit-images-url-input="updateImagesUrl" -->
  <div
    id="delProductModal"
    ref="delProductModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{ tempProduct.title }}</strong>
          商品<br />
          (刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteProduct">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaginationComponent from '../components/PaginationComponent.vue'
import ProductModalComponent from '../components/ProductModalComponent.vue'

export default {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'key0329',
      products: [],
      tempProduct: {
        imageUrl: '',
        imagesUrl: []
      },
      isNew: false,
      pages: {}
    }
  },
  components: {
    PaginationComponent,
    ProductModalComponent
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexVueWeek3Token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    this.$http.defaults.headers.common.Authorization = token
    this.checkAdmin()
  },
  methods: {
    checkAdmin() {
      this.$http
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getProductsData()
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html'
        })
    },
    getProductsData(page = 1) {
      this.$http
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
        .then((res) => {
          this.products = res.data.products
          this.pages = res.data.pagination
          console.log(this.pages)
        })
        .catch((err) => {
          alert(err)
        })
    },
    addImage() {
      this.tempProduct.imagesUrl.push('')
    },
    deleteImage() {
      this.tempProduct.imagesUrl.pop()
    },
    createImage() {
      this.tempProduct.imagesUrl = []
      this.tempProduct.imagesUrl.push('')
    },
    modelHandler(button, product) {
      if (button === 'createBtn') {
        this.tempProduct = {
          imagesUrl: []
        }
        this.isNew = true
        this.$refs.productModal.openModal()
      } else if (button === 'editBtn') {
        this.tempProduct = { ...product }
        this.isNew = false
        this.$refs.productModal.openModal()
      } else if (button === 'deleteBtn') {
        this.tempProduct = { ...product }
        // delProductModal.show()
      }
    },
    addNewProduct() {
      const data = this.tempProduct

      if (
        !this.tempProduct.title ||
        !this.tempProduct.category ||
        !this.tempProduct.unit ||
        !this.tempProduct.price ||
        !this.tempProduct.origin_price
      ) {
        alert('標題 / 分類 / 單位 / 原價 / 售價 為必填欄位')

        // eslint-disable-next-line no-useless-return
        return
      } else {
        this.$http
          .post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, { data })
          .then((res) => {
            alert(res.data.message)
            this.getProductsData()
            this.$refs.productModal.closeModal()
          })
          .catch((err) => {
            alert(err.data.message)
          })
      }
    },
    updateProduct() {
      const data = this.tempProduct
      const id = this.tempProduct.id

      if (
        !this.tempProduct.title ||
        !this.tempProduct.category ||
        !this.tempProduct.unit ||
        !this.tempProduct.price ||
        !this.tempProduct.origin_price
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
            this.getProductsData()
            this.$refs.productModal.closeModal()
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

      // 以下為範例更簡潔作法

      // let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      // let http = "post";
      // const data = this.tempProduct;
      // const id = this.tempProduct.id;

      // if (!this.isNew) {
      //   url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`;
      //   http = "put";
      // }

      // this.$http[http](url, { data })
      //   .then((res) => {
      //     alert(res.data.message);
      //     productModal.hide();
      //     this.getProductsData();
      //   })
      //   .catch((err) => {
      //     alert(err.data.message);
      //   });
    },
    deleteProduct() {
      const id = this.tempProduct.id
      this.$http
        .delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`)
        .then((res) => {
          alert(res.data.message)
          this.getProductsData()
          // delProductModal.hide()
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    updateImagesUrl(key, e) {
      console.log(key, e)
      this.tempProduct.imagesUrl[key] = e
    }
  }
}
</script>

<style scoped></style>

<!-- 184.289 -->
