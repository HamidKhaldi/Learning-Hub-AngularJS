var scsFamilyApp = angular.module('scsFamilyApp', ['ngAnimate', 'ui.router', 'ngSanitize', 'ui.bootstrap', 'ngAnimate', 'ngStorage', 'ui.tinymce', 'ui.rCalendar']);
//var scsFamilyApp = angular.module('scsFamilyApp', []);

var appCacheVersion = '03-08-1535';

//this is to allow the $location.search().q to work when entering a search term
scsFamilyApp.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(
      {
        enabled: true,
        requireBase: false
      });    
  }]);
  
  scsFamilyApp.filter('trusted', ['$sce', function($sce){
      var div = document.createElement('div');
      return function(text) {
          div.innerHTML = text;
          return $sce.trustAsHtml(div.textContent);
      }
  }]);
  
  scsFamilyApp.filter('removeHTMLTags', function() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
  });
  
  scsFamilyApp.filter('limitHtml', function() {
    return function(text, limit) {
  
        var changedString = String(text).replace(/<[^>]+>/gm, '');
        var length = changedString.length;
  
        return length > limit ? changedString.substr(0, limit - 1)+ '....' : changedString;
    }
  });

  scsFamilyApp.filter('offset', function() {
    return function(input, start) {
      start = parseInt(start, 10);
      return input.slice(start);
    };
  });

  scsFamilyApp.run(function($rootScope, $window) {

    $rootScope.$on('$stateChangeSuccess', function () {
  
      var interval = setInterval(function(){
        if (document.readyState == 'complete') {
          $window.scrollTo(0, 0);
          clearInterval(interval);
        }
      }, 200);
  
    });
    
  });

  // scsFamilyApp.run(function($rootScope, $window) {
  //   $rootScope.$on('$stateChangeSuccess', function () {
  //      $window.scrollTo(0, 0);
  //   });
  // });

  
  scsFamilyApp.config(function($locationProvider, $stateProvider, $urlRouterProvider){
    $locationProvider.hashPrefix('!');
    $stateProvider

    .state('/',{
      url: "/SitePages/Family-Home.aspx/",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/homePartial.html?c=" + appCacheVersion
    })
    .state('home', {
      url: "/SitePages/Family-Home.aspx/home",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/homePartial.html?c=" + appCacheVersion
    })
    .state('search', {
      url: "/SitePages/Family-Home.aspx/search/{searchTerm}",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/searchPartial.html?c=" + appCacheVersion
    })
    .state('about', {
      url: "/SitePages/Family-Home.aspx/about-scs",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/aboutPartial.html?c=" + appCacheVersion,
    })
    .state('experience', {
      url: "/SitePages/Family-Home.aspx/scs-experience",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/experiencePartial.html?c=" + appCacheVersion
    })
    .state('impact', {
      url: "/SitePages/Family-Home.aspx/impact-reporting",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/impactPartial.html?c=" + appCacheVersion
    })
    .state('knowledge', {
      url: "/SitePages/Family-Home.aspx/resource-center",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/knowledgePartial.html?c=" + appCacheVersion
    })
    .state('top-stories', {
      url: "/SitePages/Family-Home.aspx/top-stories",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/storiesPartial.html?c=" + appCacheVersion
    })
    .state('top-stories-child', {
      url: "/SitePages/Family-Home.aspx/{articleType}/{articleTitle}",
      params :{
        sessionObj:{
          articleType: 'top-story'
        }
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/storiesChildPartial.html?c=" + appCacheVersion
    })
    .state('other-news', {
      url: "/SitePages/Family-Home.aspx/other-news",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/newsPartial.html?c=" + appCacheVersion
    })
    .state('other-news-child', {     
      url: "/SitePages/Family-Home.aspx/News/:articleType/:articleTitle",
      params :{
        sessionObj:{
          articleType: 'news-article'
        }
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/newsChildPartial.html?c=" + appCacheVersion
    })
    .state('video-template', {
      url: "/SitePages/Family-Home.aspx/Video-Template",
      params :{
        sessionObj:{
          articleType: 'video-story'
        }
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/videoPartial.html?c=" + appCacheVersion
    })
    .state('submit-article', {     
      url: "/SitePages/Family-Home.aspx/submit-article",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/submitArticlePartial.html?c=" + appCacheVersion   
    })
    .state('submit-newsletter', {     
      url: "/SitePages/Family-Home.aspx/submit-newsletter",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/newsletterPartial.html?c=" + appCacheVersion   
    })
    .state('template', {
      url: "/SitePages/Family-Home.aspx/{pageURLName}",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/templatePartial.html?c=" + appCacheVersion
    })
    .state('secondary-template', {
      url: "/SitePages/Family-Home.aspx/Pages/{pageURLName}",
      params :{
        sessionObj:{}
      },
      templateUrl: "siteUrl/SiteAssets/web-assets/assets/js/partials/secondaryTemplatePartial.html?c=" + appCacheVersion
    })
  

  

    $urlRouterProvider.otherwise("/SitePages/Family-Home.aspx/");
  
  });