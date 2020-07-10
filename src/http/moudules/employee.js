import axios from '../axios'
export const weiOauth = () => {
    return axios({
        url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf37d4be6ad7fd59f&redirect_uri=https://1e27a0a4.ngrok.io/public/oauth&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
        method: 'get'   
    })
}