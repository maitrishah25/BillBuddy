$(function() {
  $( "#datepicker" ).datepicker();
});

var apiToken = $('#api-token').val();
$.ajaxSetup({
  headers: {
    'token': apiToken
  }
});

var Bill = Backbone.Model.extend({});
var BillCollection = Backbone.Collection.extend({
  model: Bill,
  url: '/api/bills'
});
var BillView = Backbone.View.extend({
  tagName: 'tr',
  className: 'billRow',
  render: function(){
    this.$el.empty();
    var name = this.model.get('name');
    var due_date = this.model.get('due_date');
    var amount = this.model.get('amount');
    // var user_id = this.model.get('user_id');
    this.$el.append(
      '<td>' + name + '</td>' +
      '<td>' + due_date + '</td>' +
      '<td>' + amount + '</td>'
      // '<td>' + user_id + '</td>'
      + '<td>' + '<button class="remove">' + 'PAID' + '</button>' + '</td>'
    )
  },
  events: {
    'click button.remove': 'removeBill'
  },
  removeBill: function(){
    this.$el.remove();
    this.model.set('paid_status', true);
    this.model.save();
  }
})
var BillListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.collection, 'add', this.render);
  },
  render: function(){
    this.$el.empty();
    var bills = this.collection.models;
    var view;
    for (var i = 0; i < bills.length; i++) {
      if (bills[i].attributes.paid_status === true) {
      // render nothing: true;
    } else if (bills[i].attributes.paid_status === false) {
      view = new BillView({model: bills[i]});
      view.render();
      this.$el.append(view.$el);
      }
    }
  }
});

var allTheBills = new BillCollection();
var billsPainter = new BillListView({
  collection: allTheBills,
  el: $('.bills')
});
allTheBills.fetch();

$('form.new-bill').on('submit', function(e){
  e.preventDefault();
  var newName = $(this).find('input[name="bill[name]"]').val();
  var newDueDate = $(this).find('input[name="bill[due_date]"]').val();
  var newAmount = $(this).find('input[name="bill[amount]"]').val();
  allTheBills.create({
    name: newName,
    due_date: newDueDate,
    amount: newAmount
  }, {wait: true});
});
