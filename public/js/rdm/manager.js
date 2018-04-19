angular.module('com.rdm.manager', ['rdmNetWork'])

.controller('loginController', function($window, $scope, rdmApi) {
  $scope.account = '';
  $scope.password = '';
  $scope.$ = $;

  $scope.login = function() {
    var params = {
      email: $scope.account,
      password: $scope.password,
    };
    rdmApi.login(params).then(function(data) {
      if (data && data.code === '000') {
        window.location.href = "/manager";
      }
    });
  };

})

.controller('signupController', function($window, $scope, rdmApi) {
  $scope.account = '';
  $scope.password = '';
  $scope.$ = $;

  $scope.signup = function() {
    var params = {
      email: $scope.account,
      password: $scope.password,
    };
    rdmApi.signup(params).then(function(data) {
      console.log(data);
      if (data && data.data && data.code === '000') {
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    });
  };

})

.controller('managerController', function($window, $scope, rdmApi) {
  var editor;
  var userId = $('#userId').val();
  $scope.currentGroupPage = 1;
  $scope.currentGroupCount = 10;
  $scope.docType = "save"; //create-创建；update-更新
  $scope.initGroupType = "init"; //init-创建；update-更新
  $scope.initDocType = "init"; //init-创建；update-更新
  initEditor();
  //初始化个人信息
  refreshUserInfo();

  //刷新分组列表
  function refreshUserInfo() {
    var params = { userId: userId };
    rdmApi.userinfo(params).then(function(resp) {
      if (resp && resp.code === '000') {
        $scope.email = resp.data.email;
        $scope.grouplist = resp.data.grouplist;
        if ($scope.initGroupType === "init") {
          if (resp.data.grouplist && resp.data.grouplist.length) {
            $scope.currentGroupId = resp.data.grouplist[0]._id;
            $scope.currentGroupName = resp.data.grouplist[0].name;
          }
        }
        refreshGroupInfo();
      }
    });
  }

  //刷新分组的文档列表
  function refreshGroupInfo() {
    var params = {
      group: $scope.currentGroupId,
      page: $scope.currentGroupPage,
      count: $scope.currentGroupCount
    };
    rdmApi.docList(params).then(function(resp) {
      if (resp && resp.code === '000') {
        $scope.currentdoclist = resp.data;
        $scope.currentdoclist.forEach(function(item, index) {
          $scope.currentdoclist[index].haveImg = false;
          if (item.content && item.content.indexOf('img') != -1) {
            $scope.currentdoclist[index].haveImg = true;
          }
        });
        if ($scope.initDocType === "init") {
          if (resp.data && resp.data.length) {
            $scope.currentDocId = resp.data[0]._id;
          } else {
            $scope.currentDocId = '';
          }
        }
        refreshDocInfo();
      }
      isLoginHref(resp);
    });
  }

  //刷新文档页面
  function refreshDocInfo() {
    var params = {
      documentId: $scope.currentDocId
    };
    if ($scope.currentDocId) {
      rdmApi.docInfo(params).then(function(resp) {
        if (resp && resp.code === '000') {
          $scope.currentDocTitle = resp.data.title;
          editor.setValue(resp.data.content ? resp.data.content : '');
        }
        isLoginHref(resp);
      });
    } else {
      $scope.currentDocTitle = "";
      editor.setValue('');
    }
  }

  //创建分组
  function createAndUpdateGroup(type) {
    var params = {
      name: $scope.groupName
    };
    if (String(type) === '0') {
      $scope.modalTitle = "新建文件夹";
      $scope.groupName = '';
      $("#myModal").modal();
    } else if (String(type) === '1') {
      $scope.docType = 'create';
      rdmApi.createGroup(params).then(function(resp) {
        $scope.groupName = '';
        if (resp && resp.code === '000') {
          $scope.currentGroupId = resp.data._id;
          refreshUserInfo();
          $("#myModal").modal('hide');
        }
        isLoginHref(resp);
      });
    } else if (String(type) === '2') {
      $scope.$apply(function() {
        $scope.modalTitle = "编辑文件夹";
        $scope.groupName = $scope.rCurrentGroupName;
        $("#myModal").modal();
      });
    } else if (String(type) === '3') {
      params.groupId = $scope.rCurrentGroupId;
      rdmApi.updateGroup(params).then(function(resp) {
        if (resp && resp.code === '000') {
          $("#myModal").modal('hide');
          $scope.initGroupType = "update";
          refreshUserInfo();
        }
        isLoginHref(resp);
      });
    }
  }

  //创建文档
  function createDoc() {
    $scope.currentDocTitle = "新建文档";
    var params = {
      title: $scope.currentDocTitle,
      group: $scope.currentGroupId,
      userId: userId
    };
    rdmApi.createAndUpdateDoc(params).then(function(resp) {
      if (resp && resp.code === '000') {
        $scope.currentDocId = resp.data._id;
        $scope.initDocType = "update";
        refreshGroupInfo();
      }
      isLoginHref(resp);
    });
  }

  //保存、更新文档
  function updateDoc() {
    var params = {};
    if (String($scope.docType) === 'create') {
      params = {
        title: $scope.currentDocTitle,
        content: $('#editor').val()
      };
    } else {
      params = {
        docId: $scope.currentDocId,
        title: $scope.currentDocTitle,
        content: $('#editor').val()
      };
    }
    rdmApi.createAndUpdateDoc(params).then(function(resp) {
      if (resp && resp.code === '000') {
        $scope.initDocType = "update";
        refreshGroupInfo();
      }
      isLoginHref(resp);
    });
  }

  //删除文档
  function delDoc() {
    var params = {
      documentId: $scope.rCurrentDocId,
    };
    rdmApi.deleteDoc(params).then(function(resp) {
      if (resp && resp.code === '000') {
        $scope.initDocType = "init";
        refreshGroupInfo();
      }
      isLoginHref(resp);
    });
  }

  //删除文件夹
  function delGroup() {
    var params = {
      groupId: $scope.rCurrentGroupId,
    };
    rdmApi.deleteGroup(params).then(function(resp) {
      if (resp && resp.code === '000') {
        $scope.initGroupType = "init";
        refreshUserInfo();
      }
      isLoginHref(resp);
    });
  }

  //点分组
  $scope.clickGroup = function(currentGroupId, currentGroupName) {
    $scope.currentGroupId = currentGroupId;
    $scope.currentGroupName = currentGroupName;
    $scope.initGroupType = "init";
    $scope.initDocType = "init";
    refreshGroupInfo();
  };

  //右击分组
  $scope.rClickGroup = function(currentGroupId, currentGroupName) {
    $scope.rCurrentGroupId = currentGroupId;
    $scope.rCurrentGroupName = currentGroupName;
  };

  //点文档
  $scope.clickDoc = function(currentDocId) {
    $scope.currentDocId = currentDocId;
    $scope.docType = 'save';
    $scope.initGroupType = "init";
    $scope.initDocType = "init";
    refreshDocInfo();
  };

  //右击文档
  $scope.rClickDoc = function(documentId) {
    $scope.rCurrentDocId = documentId;
  };

  //新建文件夹、修改文件夹
  $scope.createAndUpdateGroup = function(type) {
    createAndUpdateGroup(type);
  };

  //新建笔记
  $scope.createDoc = function() {
    $scope.docType = 'save';
    createDoc();
  };

  //保存笔记
  $scope.updateDoc = function() {
    updateDoc();
  };

  $('#mygroup').contextPopup({
    title: '',
    items: [{
        label: '修改',
        icon: '',
        action: function() {
          createAndUpdateGroup('2');
        }
      },
      null, // divider
      {
        label: '删除',
        icon: '',
        action: function() {
          if ($scope.currentdoclist && $scope.currentdoclist.length) {
            alert('文件夹内有文章，无法删除');
          } else {
            delGroup();
          }
        }
      },
    ]
  });

  $('#mygroupdoc').contextPopup({
    title: '',
    items: [{
      label: '删除',
      icon: '',
      action: function() {
        delDoc();
      }
    }, ]
  });

  //文档输入框失去焦点
  $('.save').click(function() {
    updateDoc();
  });

  $scope.logout = function() {
    var params = {};
    rdmApi.logout(params).then(function(data) {
      if (data && data.code === '000') {
        window.location.href = "/login";
      }
    });
  };

  function initEditor() {
    //init editor
    editor = new Simditor({
      textarea: $('#editor'),
      toolbar: [
        'title',
        'bold',
        'italic',
        // 'underline',
        'strikethrough',
        'fontScale',
        'color',
        // 'ol',
        // 'ul',
        // 'blockquote',
        // 'code',
        // 'table',
        'link',
        'image',
        'hr',
        'indent',
        'outdent',
        'alignment',
      ]
    });
    $('.simditor').css('border', 'none');
  }

  function isLoginHref(data) {
    if (data && data.code === "011") {
      window.location.href = "/login";
    }
  }

})

// 
.filter('contentFormat', function() {
  return function(content) {
    var d = document.createElement('contentFormat');

    d.innerHTML = content ? content : '';

    var contentDoc = d.innerText || d.textContent;

    d.innerHTML = '';

    return contentDoc.length > 50 ? (contentDoc.substring(0, 50) + "...") : contentDoc;
  };
})

// 
.filter('imgFormat', function() {
  return function(content) {
    var d = document.createElement('contentFormat');

    d.innerHTML = content ? content : '';

    var contentDoc = d.innerText || d.textContent;

    var src = d.innerHTML.split('src="');

    src = src.length > 1 ? src[1].split('"')[0] : '';

    return src;
  };
})

// 定义过滤器:数值转换
.filter('numberFilterFixed', function() {
  return function(number) {
    return Number(number).toFixed(2);
  };
})

.directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
        fn(scope, { $event: event });
      });
    });
  };
});