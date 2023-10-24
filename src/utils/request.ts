import axios from "axios";

const instance = axios.create({
  baseURL: 'https://devapi.qweather.com',
  timeout: 5000,
});

// 存储取消请求的对象
const controllerMap = new Map()

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 添加controller
  const controller = new AbortController();
  config.signal = controller.signal

  // 取消之前的重复请求
  if(controllerMap.get(config.url)){
    controllerMap.get(config.url).abort()
    controllerMap.delete(config.url)
  }
  controllerMap.set(config.url, controller)

  if(config.url == '/ws/location/v1/ip'){
    return config;
  }
  // 为天气的aip添加key
  config.params.key = '9e220bc1ee024bc78f2e70ccfe04de1c'
  
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 当天气的api到达上限时，提示用户并取消请求
  if(response.data.code == '402'){
    for (let key of controllerMap.keys()) {  
        controllerMap.get(key).abort()
        controllerMap.delete(key);  
    }  
    alert('天气的aip请求到达上限')
    return Promise.reject(response)
  }

  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance