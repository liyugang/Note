angular.module('rdmNetWork', [])
  .service('rdmApi', function($http, $q) {
    return {
      /**
       * [signup 注册]
       * @return {[type]} [description]
       */
      signup: function(params) {
        var deferred = $q.defer();
        $http.post('/signup', params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [login 登录]
       * @return {[type]} [description]
       */
      login: function(params) {
        var deferred = $q.defer();
        $http.post('/login', params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [logout 登出]
       * @return {[type]} [description]
       */
      logout: function(params) {
        var deferred = $q.defer();
        $http.post('/logout', params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [userinfo 查询用户信息]
       * @return {[type]} [description]
       */
      userinfo: function(params) {
        var deferred = $q.defer();
        var url = '/user/' + params.userId;
        $http.get(url, params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [createGroup 创建分组]
       * @return {[type]} [description]
       */
      createGroup: function(params) {
        var deferred = $q.defer();
        var url = '/group/create';
        $http.post(url, params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [deleteGroup 删除分组]
       * @return {[type]} [description]
       */
      deleteGroup: function(params) {
        var deferred = $q.defer();
        var url = '/group/delete/' + params.groupId;
        $http.post(url, params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [updateGroup 更新分组]
       * @return {[type]} [description]
       */
      updateGroup: function(params) {
        var deferred = $q.defer();
        var url = '/group/update/' + params.groupId;
        $http.post(url, params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [docList 文档列表]
       * @return {[type]} [description]
       */
      docList: function(params) {
        var deferred = $q.defer();
        var url = '/document/list/' + params.group + "/" + params.page + "/" + params.count;
        $http.get(url, params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [createAndUpdateDoc 创建文档]
       * @return {[type]} [description]
       */
      createAndUpdateDoc: function(params) {
        var deferred = $q.defer();
        var url = '/document/createAndUpdate';
        $http.post(url, params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [docInfo 获取文档详情]
       * @return {[type]} [description]
       */
      docInfo: function(params) {
        var deferred = $q.defer();
        var url = '/document/' + params.documentId;
        $http.get(url, params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
      /**
       * [deleteDoc 删除文档]
       * @return {[type]} [description]
       */
      deleteDoc: function(params) {
        var deferred = $q.defer();
        var url = '/document/delete/' + params.documentId;
        $http.post(url, params)
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).error(function(data, status, headers, config) {
            deferred.reject(data);
          });
        return deferred.promise;
      },
    };

  });