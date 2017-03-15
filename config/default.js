/**
 * Created by ren on 2017/3/7.
 */
module.exports = {
  port: 18080,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb:'mongodb://180.76.158.69:32768/myblog'
}