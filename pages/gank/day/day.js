Page({
  data: {
    hidden: false,
    toastHidden: true,
    modalHidden: true,
    toastText: "数据无法正常显示",
    loadingText: "加载中..."
  },

  onLoad: function (options) {
    that = this;
    mData = [];
    if (options == null || options.day == null || options.day.split("-").length != 3) {
      this.setData({ hidden: true, toastHidden: false });
      return;
    }

    wx.setNavigationBarTitle({
      title: options.day,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
    getContentByDay(options.day);
  },

  onImageClick: function (event) {
    // console.log(event.currentTarget);
    mIamgeUrl = event.currentTarget.dataset.src;
    this.setData({ modalHidden: false, imageUrl: mIamgeUrl })
  },

  onSaveClick: function (event) {
    saveIamge();
  },

  onCancelClick: function (event) {
    this.setData({ modalHidden: true });
  },

  onToastChanged: function (event) {
    this.setData({ toastHidden: true });
  },

  /**
   * 某个具体的 条目被点击，跳转页面
   */
  onOneItemClick: function (event) {
    var url = event.currentTarget.dataset.url;
    var title = event.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../detail/detail?url=' + url + "&title=" + title,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
});

var that;
var mIamgeUrl = "";
function saveIamge() {
  that.setData({
    hidden: false,
    toastHidden: true,
    modalHidden: true,
    loadingText: "下载中..."
  });
  wx.downloadFile({
    url: mIamgeUrl,
    type: 'image',
    success: function (res) {
      console.log("download success");
      that.setData({
        hidden: true,
        toastHidden: false,
        toastText: "图片已成功下载"
      });
    },
    fail: function (res) {
      console.log("download fail");
      that.setData({
        hidden: true,
        toastHidden: false,
        toastText: "下载失败，请重试"
      });
    },
  })
}



var mData = [];


/**
 * 获取特定日期的干货
 * 
 * 
 * @params date 特定日期
 * 
 */
function getContentByDay(date) {

  var day = date.replace("-", "/").replace("-", "/");
  wx.request({
    url: 'http://gank.io/api/day/' + day,

    success: function (res) {
      if (res == null ||
        res.data == null ||
        res.data.results == null ||
        res.data.results.length <= 0) {
        console.error("ERROR_DATA_IS_NULL");
        wx.showToast({
          title: '未能正确获取到数据',
          icon: '',
          image: '',
          duration: 0,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        return;
      }

      filterData(res.data);

      // console.log(res.data);

    },
    fail(res) {
      that.setData({ hidden: true, toastHidden: false });
    }
  })
}


/**
  * 筛选数据
  * 
  */
function filterData(itemData) {

  var category = itemData.category;

  var results = itemData.results;


  // for (var i = 0; i < category.length; i++) {
  //   var tag = category[i];
  //   getTagData(tag,results);
  // }



  try {


    var Android = { tag: "Android", singleItems: results.Android }
    mData.push(Android);


    var iOS = { tag: "iOS", singleItems: results.iOS }
    mData.push(iOS);



    //拓展资源
    if (results.\u62d3\u5c55\u8d44\u6e90 != null && results.\u62d3\u5c55\u8d44\u6e90.length != 0) {
      var \u62d3\u5c55\u8d44\u6e90 = { tag: "\u62d3\u5c55\u8d44\u6e90", singleItems: results.\u62d3\u5c55\u8d44\u6e90 }
      mData.push(\u62d3\u5c55\u8d44\u6e90);
      // console.log(\u62d3\u5c55\u8d44\u6e90);
    }

    // 瞎推荐
    if (results.\u778e\u63a8\u8350 != null && results.\u778e\u63a8\u8350.length != 0) {
      var \u778e\u63a8\u8350 = { tag: "\u778e\u63a8\u8350", singleItems: results.\u778e\u63a8\u8350 }
      mData.push(\u778e\u63a8\u8350);
      // console.log(\u778e\u63a8\u8350);
    }


    //休息视频
    var \u4f11\u606f\u89c6\u9891 = { tag: "\u4f11\u606f\u89c6\u9891", singleItems: results.\u4f11\u606f\u89c6\u9891 }
    mData.push(\u4f11\u606f\u89c6\u9891);
    // console.log(\u4f11\u606f\u89c6\u9891);

    //福利
    var meizi = { tag: "\u798f\u5229", singleItems: results.\u798f\u5229 }
    // mData.push(meizi);

    var imgs = [];
    for (var i = 0; i < meizi.singleItems.length; i++) {
      imgs.push(meizi.singleItems[i].url);
    }
    // console.log(imgs);

    that.setData({
      hidden: true,
      toastHidden: true,
      modalHidden: true,
      videoUrl: "",
      data: mData,
      imgs: imgs
    })

  } catch (e) {
    console.error(e)
  }
}




