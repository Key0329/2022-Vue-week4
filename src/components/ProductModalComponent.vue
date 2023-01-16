<template>
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
                  :value="imagesUrl"
                  @input="$emit('update:imagesUrl', $event.target.value)"
                />
                {{ imagesUrl }}
              </div>
              <img
                class="img-fluid"
                :src="imagesUrl"
                alt="mainImg"
                v-if="imagesUrl"
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
                  <label for="imageUrl" class="form-label">輸入圖片網址</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="請輸入圖片連結"
                    :value="tempProduct.imagesUrl[key]"
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
                :value="tempProduct.title"
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
                  :value="tempProduct.category"
                />
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">單位</label>
                <input
                  id="unit"
                  type="text"
                  class="form-control"
                  placeholder="請輸入單位"
                  :value="tempProduct.unit"
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
                  :value="tempProduct.origin_price"
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
                  :value="tempProduct.price"
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
                :value="tempProduct.description"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">說明內容</label>
              <textarea
                id="description"
                type="text"
                class="form-control"
                placeholder="請輸入說明內容"
                :value="tempProduct.content"
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
                  :value="tempProduct.is_enabled"
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
</template>

<script>
export default {
  props: ['isNew', 'category', 'content', 'title', 'imagesUrl']

  // data() {
  //   return {
  //     tempProduct: {
  //       title: this.title,
  //       imagesUrl: this.imagesUrl,
  //       content: this.content
  //     }
  //   }
  // }
}
</script>
