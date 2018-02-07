Page({

  onLoad: function (options) {
    wx.showNavigationBarLoading();
    if (options == null || options.url == null || options.title == null) {
      wx.setNavigationBarTitle({
        title: '未能正确获取数据',
      });
      wx.hideNavigationBarLoading();
      return;
    }

    wx.setNavigationBarTitle({
      title: options.title,
    })

    wx.setClipboardData({
      data: options.url,
      success(res){
        wx.showToast({
          title: '地址已被复制到系统剪贴板',
          icon: '',
          image: '',
          duration: 1000,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    
    });
    this.setData({ url: options.url });
    setTimeout(function () {
      wx.hideNavigationBarLoading();
    }, 4000);

  },

});

