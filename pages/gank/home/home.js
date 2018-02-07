//index.js
Page({
  data: {
    date: '日期',
    items: [],
    hidden: false,
    toastHidden: true,
    toastText: '获取数据出错',
    isHideLoadMore: true
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    mThat = this
    wx.showNavigationBarLoading();
    // getHistory();
    // onDatesReady();

    getOnePageDate();

    wx.onSocketError(callback => {
      mThat.setData({
        items: [{ title: callback }],
        hidden: true,
        toastHidden: false,
        isHideLoadMore: true
      });
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
  },

  onPullDownRefresh: function () {
    // Do something when pull down.
    mCurrentDay = 0;
    mDataList = [];
    // onDatesReady();
    getOnePageDate();
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
    this.setData({
      isHideLoadMore: false
    })
    // onDatesReady();
    getOnePageDate();
  },


  onItemClick: function (event) {
    if (event.currentTarget.dataset.publishTime == null) {
      that.setData({
        hidden: true,
        toastHidden: false,
        isHideLoadMore: true
      });
      return;
    }

    wx.navigateTo({
      url: "../day/day?day=" + event.currentTarget.dataset.publishTime
    });
  },


})

var mThat = null
var mDataList = []
var mCurrentDay = 0
var mDates = [] //发布过gank的日期的数组

/**
 * 获取所有发布过干货的日期
 * 
 */
function getHistory() {
  wx.request({
    url: 'http://gank.io/api/day/history',
    success: function (res) {
      if (res == null ||
        res.data == null ||
        res.data.results == null ||
        res.data.results.length <= 0) {
        console.error("ERROR_DATA_IS_NULL");
        that.setData({
          hidden: true,
          toastHidden: false,
          isHideLoadMore: true
        });
        return;
      }

      var dates = res.data.results;
      if (dates instanceof Array && dates.length != 0)
      { mDates = dates; onDatesReady() }
      // console.log(dates);
      wx.hideNavigationBarLoading();
    }
  })
}


/**
 * 成功获取到时间列表
 */
function onDatesReady() {
  if (mDates == null || mDates.length == 0) {
    that.setData({
      hidden: true,
      toastHidden: false,
      isHideLoadMore: true
    });
    return;
  }
  getOnePageDate();
}


/**
 * 获取特定日期的干货
 * 
 * 
 * @params date 特定日期
 * 
 */
function getContentByDay(date, successed) {

  var day = date.replace("-", "/").replace("-", "/");
  wx.request({
    //http://gank.io/api/day//2016/05/11
    url: 'http://gank.io/api/day/' + day,

    success: function (res) {
      if (res == null ||
        res.data == null ||
        res.data.results == null ||
        res.data.results.length <= 0) {
        console.error("ERROR_DATA_IS_NULL");
        that.setData({
          hidden: true,
          toastHidden: false,
          isHideLoadMore: true
        });
        return;
      }

      for (var i = 0; i < res.data.results.length; i++)
        filterData(res.data.results[i]);

      mCurrentDay++;

      successed.apply();
      // console.log(res.data.results[0]);

    }
  })
}


/**
  * 筛选数据
  * @params itemData Gank的接口返回的content值，里面有各种相关的信息
  */
function filterData(itemData) {

  var re = new RegExp("[a-zA-z]+://[^\"]*");
  //图片URL标志之前的是"img alt"
  var title = itemData.content.split("img alt=")[1].match(re)[0];

  //todo 挺奇怪的，小程序不能显示以 （ww+数字） 开头的图片，把它改成 ws 开头就可以了，不知道为什么
  if (-1 != (title.search("//ww"))) {
    var src = title.replace("//ww", "//ws");
  }
  //早期的URL不一定是ww开头的，不需要转换直接调用
  else {
    var src = title;
  }


  mDataList.push({
    time: itemData.publishedAt.split("T")[0],
    title: itemData.title,
    src: src
  });
}





/**
 * 获取某几日的干货
 * 
 * 
 * @params num 获取几条
 * 
 */
function getContentsByPage(num, page, successed) {

  wx.request({
    //http://gank.io/api/history/content/2/1
    url: 'http://gank.io/api/history/content/' + num + '/' + (page + 1),

    success: function (res) {
      if (res == null ||
        res.data == null ||
        res.data.results == null ||
        res.data.results.length <= 0) {
        console.error("ERROR_DATA_IS_NULL");
        that.setData({
          hidden: true,
          toastHidden: false,
          isHideLoadMore: true
        });
        return;
      }

      for (var i = 0; i < res.data.results.length; i++)
        filterData(res.data.results[i]);

      mCurrentDay++;

      successed.apply();
      // console.log(res.data.results[0]);

    }
    , fail: function (res) {
      mThat.setData({
        items: [],
        hidden: true,
        toastHidden: false,
        isHideLoadMore: true
      });
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  })
}


/**
 * 获取一页数据 （默认5条）
 * 
 */
function getOnePageDate() {
  wx.showNavigationBarLoading();

  getContentsByPage(5, mCurrentDay, function () {
    mThat.setData({
      items: mDataList,
      hidden: true,
      toastHidden: true,
      isHideLoadMore: true
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  })
}