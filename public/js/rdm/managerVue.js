Vue.component('todo-item', {
  props: ['tododata'],
  template: '<li>{{ tododata.name }}</li>'
});


var app = new Vue({
  el: '#app',
  data: {
    message: 'One Day!',
    number: '23.12321',
    isButtonDisabled: true,
    isselect: false,
    todolist: [{
      name: "找投资",
    }, {
      name: "买电动车"
    }, {
      name: "买拖鞋"
    }]
  },
  methods: {
    commit: function(num) {
      alert(num);
    }
  },
  created: function() {
    console.log('--------------------------created--------------------------');
  },
  mounted: function() {
    console.log('--------------------------mounted--------------------------');
  },
  updated: function() {
    console.log('--------------------------updated--------------------------');
  },
  destroyed: function() {
    console.log('--------------------------destroyed--------------------------');
  },
  filters: {
    fixed: function(num) {
      return Number(num).toFixed(2);
    }
  }
});