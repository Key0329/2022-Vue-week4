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
  </div>

  <!-- Modal start-->
  <div
    id="productModal"
    ref="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span>{{ isNew ? '新增產品' : '編輯產品' }}</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <!-- 主要圖片 -->
              <div class="mb-3">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">主要圖片</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="請輸入圖片連結"
                    v-model="tempProduct.imagesUrl"
                  />
                </div>
                <img
                  class="img-fluid"
                  :src="tempProduct.imagesUrl"
                  alt="mainImg"
                  v-if="tempProduct.imagesUrl"
                />
              </div>
              <!-- 多圖新增 -->
              <h3 class="mb-3">多圖新增</h3>
              <!-- 因為內層直接用 length 判斷會造成渲染錯誤，所以要多包一層 if 讓 imagesUrl 確定有東西才渲染 -->
              <div v-if="Array.isArray(tempProduct.imagesUrl)">
                <div
                  class="mb-2"
                  v-for="(img, key) in tempProduct.imagesUrl"
                  :key="key"
                >
                  <div class="mb-3">
                    <label for="imageUrl" class="form-label"
                      >輸入圖片網址</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      placeholder="請輸入圖片連結"
                      v-model="tempProduct.imagesUrl[key]"
                    />
                  </div>
                  <img class="img-fluid" :src="img" :alt="'img' + key" />
                </div>
                <!-- 判斷是否有陣列或是陣列最後一筆是否有值 -->
                <div
                  v-if="
                    !tempProduct.imagesUrl.length ||
                    tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]
                  "
                >
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="addImage"
                  >
                    新增圖片
                  </button>
                </div>
                <div v-else>
                  <button
                    class="btn btn-outline-danger btn-sm d-block w-100"
                    @click="deleteImage"
                  >
                    刪除圖片
                  </button>
                </div>
              </div>
              <div v-else>
                <button
                  class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="createImage"
                >
                  新增圖片
                </button>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  id="title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                  v-model="tempProduct.title"
                />
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    id="category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                    v-model="tempProduct.category"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    id="unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                    v-model="tempProduct.unit"
                  />
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    id="origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                    v-model="tempProduct.origin_price"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                    v-model="tempProduct.price"
                  />
                </div>
              </div>
              <hr />

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                  v-model="tempProduct.description"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                  v-model="tempProduct.content"
                ></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                    v-model="tempProduct.is_enabled"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateProductHandler"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>

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
          <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
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
import modal from 'bootstrap/js/dist/modal'

let productModal = null
let delProductModal = null

export default {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'key0329',
      products: [],
      tempProduct: {
        imagesUrl: []
      },
      isNew: false
    }
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexVueWeek3Token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    this.$http.defaults.headers.common.Authorization = token
    this.checkAdmin()

    // eslint-disable-next-line new-cap
    productModal = new modal(document.querySelector('#productModal'))
    // eslint-disable-next-line new-cap
    delProductModal = new modal(document.querySelector('#delProductModal'))
  },
  methods: {
    checkAdmin() {
      this.$http
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getData()
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html'
        })
    },
    getData() {
      this.$http
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          this.products = res.data.products
          console.log(this.products)
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    modelHandler(button, item) {
      if (button === 'createBtn') {
        this.tempProduct = {
          imagesUrl: []
        }
        this.isNew = true
        productModal.show()
      } else if (button === 'editBtn') {
        this.tempProduct = { ...item }
        this.isNew = false
        productModal.show()
      } else if (button === 'deleteBtn') {
        this.tempProduct = { ...item }
        delProductModal.show()
      }
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
            this.getData()
            productModal.hide()
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
            this.getData()
            productModal.hide()
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
      //     this.getData();
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
          this.getData()
          delProductModal.hide()
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  }
}
</script>

<style scoped></style>
