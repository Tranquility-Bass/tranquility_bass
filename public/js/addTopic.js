(function ($) {
    var addTopicForm = $('#addTopic-form'),
      type = $('#type');
  
    addTopicForm.submit(function (event) {
      event.preventDefault();
  
      var newType = type.val();
      var actionUrl = addTopicForm.attr('action');

      var errorP = $('#errorP');
      if (newType) {
        if (newType != "artist" && newType != "album") {
          errorP.text("Must select a value");
        }
        else {
          errorP.text("");
          var requestConfig = {
              method: 'POST',
              url: actionUrl,
              data: addTopicForm.serialize()
          };

            $.ajax(requestConfig).then(function (responseMessage) {
              console.log(responseMessage);
              var newElement = $(responseMessage);
              var nextStep = $('#nextStep');
              nextStep.html(newElement);
            });
          }
        }
      }
    );
  })(window.jQuery);