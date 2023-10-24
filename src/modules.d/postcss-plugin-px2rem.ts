declare module 'postcss-plugin-px2rem'{
  const content: any
  /// 这里的 content 可以根据自己的需要，添加需要的类型，这的话可以让 ts 更好的提示
  /**
  type content = {
    test: string
  }
 */
  export = content
}

declare module "*.json" {
  const value: any;
  export default value;
}
declare module "*.csv" {
  const value: any;
  export default value;
}

declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
