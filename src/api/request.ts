import axios from 'axios';

const Axios = axios.create({
  // baseURL: 'http://127.0.0.1:1234',
  timeout: 3000,
  /*也可以不设置Content-Type，影响是在你发送请求时
  Vue会先发送OPTIONS包探测路由是否存在，需要后端也做设置响应OPTIONS
  方法，否则会报跨域错误；我这里用的Beego2，路由里不响应OPTIONS方法，
  所以我在这块设置Content-Type*/
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded'
  },
  /*这个配置很重要，允许axios携带用户Cookie到后端，不设置这个的话
  Set-Cookie是无效的,除此之外,Chrome默认开启了SameSite检查，如果
  后端不主动设置SameSite = none,Set-Cookie是无效的。详情请文章末尾
  参考阮老师的SameSite讲解*/
  withCredentials: true
});

Axios.interceptors.request.use(req => {
  // 请求拦截处理
  return req;
}, err => {
  console.log('在发送请求时发生错误，错误为', err);
  return Promise.reject(err);
})

Axios.interceptors.response.use(res => {
  // 响应拦截处理
  return res.data;
}, error => {
  const err = error.toString();
  switch (true) {
    case err.indexOf('Network') !== -1:
      console.log('后端服务器无响应或者URL错误', err);
      break;
    case err.indexOf('timeout') !== -1:
      console.log('请求后端服务器超时！', err);
      break;
  }
  return Promise.reject(error);
})

export default Axios;
