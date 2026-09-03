(function () {
  const postFroomlePageView = function () {
    if (window.bg.globalTracking && window.bg.globalTracking.registrationID) {
      const postData = (data) => {
        const method = 'POST';
        let origin = window.location.origin;
        let environment;
        if (origin.includes('localhost') || origin.includes('arc-sandbox')) {
          environment = 'dev_tbg';
        } else {
          environment = 'tbg';
        }
        const url = `https://thebostonglobe.froomle.com/api/${environment}/events`;
        const headers = {
          Accept: 'application/json, text/javascript, */*', 'Content-Type': 'application/json', Authorization: 'Bearer X',
        };
        const body = JSON.stringify(data);
        const options = {
          method, body, headers,
        };
        return fetch(url, options)
          .then((response) => {
            if (!response.success) {
              throw response;
            }
            return response.json();
          }).catch(error => ({error}));
      };

      const postDetailPageView = () => {
        if (typeof window === 'undefined') {
          return Promise.resolve({});
        }
        const layout = window.bg.globalTracking && window.bg.globalTracking.pageLayout;
        const pageType = window.bg.globalTracking && window.bg.globalTracking.storyThread;
        let eventType = '';
        let pageCategory = 'other';
        if (pageType === 'story' || pageType === 'gallery' || pageType === 'video') {
          eventType = 'detail_pageview';
          pageCategory = 'article_detail';
        } else {
          eventType = 'page_visit';
          pageCategory = 'category';
          if (layout === 'HomePage') {
            pageCategory = 'home';
          }
        }
        const data = {
          events: [{
            event_type: eventType,
            page_type: pageCategory,
            device_id: window.bg.globalTracking.BGSessionID || 'not available',
            user_id: window.bg.globalTracking.registrationID || 'logged out',
            action_item: eventType === 'page_visit' ? null : window.bg.globalTracking.articleID,
            action_item_type: eventType === 'page_visit' ? null : 'story',
            channel: window.screen.width >= 960 ? 'www-desktop' : 'www-mobile',
          }],
        };
        postData(data);
      };
      postDetailPageView();
    }
  };

  if (
    window.meterObject &&
    window.meterObject.meterState &&
    window.meterObject.meterState.result
  ) {
    // call `postFroomlePageView` function
    postFroomlePageView();
  } else if (window.meterObject) {
    window.meterObject.observationController.addEventObserver(
      'meterStateChange',
      postFroomlePageView,
    );
  }
})();



