
(function() {

var html = $('html').attr('id');
var file = html.split('/')[1]; 

// Set viewport for mobile phones
$('head').append('<meta name="viewport" content="width=device-width,'
  + 'initial-scale=1.0,minimum-scale=0.25,user-scalable=yes"/>');

var array = [];
var total = 6;
var page = 1; 
var perpage = 5;
while(array.length < total) {
  var rand = Math.floor(Math.random() * total);
  var found = false;
  for(var i = 0; i < array.length; i++) {
    if(array[i] == rand) {
      found = true;
      break;
    }
  }
  if(!found) {
    array[array.length] = rand;
  }  
} 

$(document).ready(function() {
  var width = $(window).width();
  var font = Math.floor(width / 200) + 5;
  $('body').css('font-size', font.toString() + 'px');
  
  var answers = '';
  $.getJSON('../txt/' + file + '.json', function(t) {
    for(var i = 0; i < total; i++) {
      var n = array[i];
      var content = t.items[n].question + '<br/>';
      var newline = (t.items[n].newline) ? '<br/>' : '';
      var choice = '<input type="radio" name="' + t.items[n].key + '" value="';
      content += choice + 'A"/>' + t.items[n].choices[0] + newline 
        + choice + 'B"/>' + t.items[n].choices[1] + newline
        + choice + 'C"/>' + t.items[n].choices[2] + newline
        + choice + 'D"/>' + t.items[n].choices[3] + newline
        + choice + 'E"/>' + t.items[n].choices[4];  
      $('article ol').append('<li class="hidden">' + content + '</li>');
      answers += t.items[n].answer;
    }
    $('article li').slice(0, perpage).removeClass('hidden'); 
  });
  
  $('#prev').on('click', function() {
    if(page > 1) {
      page -= 1;
      var num = perpage * page; 
      $('article li').slice(num, num + perpage).addClass('hidden');
      $('article li').slice(num - perpage, num).removeClass('hidden');
      $('article ol').attr('start', num - perpage + 1);
    }
  });
  
  $('#next').on('click', function() {
    if(page < total / perpage) {
      var num = perpage * page; 
      $('article li').slice(num - perpage, num).addClass('hidden');
      $('article li').slice(num, num + perpage).removeClass('hidden');
      $('article ol').attr('start', num + 1);
      page += 1;
    }
  });
  
  $('#first').on('click', function() {
    $('article li').addClass('hidden');
    page = 2;
    $('#prev').click();
  });
  
  $('#last').on('click', function() {
    $('article li').addClass('hidden');
    page = Math.max(1, total / perpage - 1);
    $('#next').click();
  });
  
  $('#submit').one('click', function() {
    var score = 0;  
    var correct = 0;
    var incorrect = 0;
    var unsolved = 0;
    var numbers = answers.length;
    var questions = $('input:radio');

    for(var i = 0; i < numbers; i ++) {
      for(var j = 0; j < 5; j ++) {
        if(questions[5 * i + j].checked == true) {
          if(questions[5 * i + j].value == answers[i]) {
            correct ++;
          } else {
            incorrect ++;
          }  
        }  
      }     
    }      
    unsolved = numbers - correct - incorrect;
    score = numbers * 2 + (correct - 0.25 * incorrect) * 8;
    if($('span.scoring') != null) {
      $('span.scoring').remove();
    }  
    $('<span class="scoring">正确：' + correct + '&emsp; 错误：'
      + incorrect + '&emsp; 未作答：' + unsolved + '&emsp; 得分：'
      + score + '</span>').insertAfter(this);
  });
  
});

})();
