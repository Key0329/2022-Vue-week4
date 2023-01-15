<template>
  <div class="container">
    <div class="row justify-content-center">
      <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
      <div class="col-8">
        <form id="form" class="form-signin" @submit.prevent="login">
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="username"
              placeholder="name@example.com"
              required
              autofocus
              v-model.trim="user.username"
            />
            <label for="username">Email address</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              required
              v-model.trim="user.password"
            />
            <label for="password">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted">&copy; 2021~∞ - 六角學院</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      apiUrl: 'https://vue3-course-api.hexschool.io/v2'
    }
  },
  methods: {
    login() {
      this.$http
        .post(`${this.apiUrl}/admin/signin`, this.user)
        .then((res) => {
          // console.log(res);
          const { token, expired } = res.data
          document.cookie = `hexVueWeek3Token=${token};expires=${new Date(
            expired
          )};`
          this.$router.replace({ path: '/products' })
        })
        .catch((err) => {
          // console.log(err.response);
          alert(err.response.data.message)
        })
    }
  }
}
</script>

<style scoped></style>
