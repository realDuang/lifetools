//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    searchLoading: true,
    location: {
      altitude: 0,
      latitude: 0,
      longitude: 0,
      speed: 0,
      accuracy: 0,
    },
    city: '',
    area: '',
    now: {
      weatherPic: '',
      weatherTxt: '',
      temperature: '',
      windDir: '',
      windLevel: '',
      humidity: '',
    },
    forecast: [],
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      };
    }
    wx.showLoading({
      title: '夜观星象...',
      mask: true,
    });
    app.getLocation(location => {
      this.setData({
        'location.altitude': location.altitude,
        'location.latitude': location.latitude,
        'location.longitude': location.longitude,
        'location.speed': location.speed,
        'location.accuracy': location.accuracy,
      });
      wx.request({
        url: 'https://free-api.heweather.com/s6/weather/now',
        data: {
          location: `${this.data.location.longitude},${
            this.data.location.latitude
          }`,
          key: 'df3cc12e6f074b24bce8337997cc7641',
          rnd: new Date().getTime(), // 随机数，防止请求缓存
        },
        success: res => {
          const areaBasic = res.data.HeWeather6[0].basic;
          const nowWeather = res.data.HeWeather6[0].now;
          this.setData({
            city: areaBasic[`parent_city`],
            area: areaBasic[`location`],
            'now.weatherPic': `https://cdn.heweather.com/cond_icon/${
              nowWeather[`cond_code`]
            }.png`,
            'now.weatherTxt': nowWeather[`cond_txt`],
            'now.temperature': nowWeather[`tmp`],
            'now.windDir': nowWeather[`wind_dir`],
            'now.windLevel': nowWeather[`wind_sc`],
            'now.humidity': nowWeather[`hum`],
          });
          wx.hideLoading();
        },
      });
      wx.request({
        url: 'https://free-api.heweather.com/s6/weather/forecast',
        data: {
          location: `${this.data.location.longitude},${
            this.data.location.latitude
          }`,
          key: 'df3cc12e6f074b24bce8337997cc7641',
          rnd: new Date().getTime(), // 随机数，防止请求缓存
        },
        success: res => {
          const forecastDatas = res.data.HeWeather6[0][`daily_forecast`];
          let tempDatas = [];
          forecastDatas.forEach((data, index) => {
            let tempData = {};
            tempData.forecastDate = data.date;
            (tempData.forecastPic = `https://cdn.heweather.com/cond_icon/${
              data[`cond_code_d`]
            }.png`),
              (tempData.forecastTmp = data.cond_txt_d);
            tempData.forecastTxt = `${data.tmp_min} ~ ${data.tmp_max}℃`;
            tempDatas.push(tempData);
          });
          this.setData({ forecast: tempDatas });
          wx.hideLoading();
        },
      });
    });
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
});
