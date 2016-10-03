angular.module('hiveInTown').directive('ckEditor', function() {
	  return {
		    require: '?ngModel',
		    link: function(scope, elm, attr, ngModel) {
		    	console.log("in textarea");
		      var ck = CKEDITOR.replace(elm[0], {
		  		toolbar: [
		  				{ name: 'document', items: [ 'Print', 'Preview' ] },	
		  				[ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo','-' ],
		  				{ name: 'styles', items: [ 'Font', 'FontSize' ] },
		  				{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
		  				'/',		
		  				'/',																					// Line break - next group will be placed in new line.
		  				{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ] },
		  				['NumberedList', 'BulletedList', '-','JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
		  				 [ 'Image',  'Table', 'HorizontalRule']
		  		    	    ],
		  		    	    width:'100%'
		  		    });

		      if (!ngModel) return;

		      ck.on('pasteState', function() {
		        scope.$apply(function() {
		          ngModel.$setViewValue(ck.getData());
		        });
		      });

		      ngModel.$render = function(value) {
		        ck.setData(ngModel.$viewValue);
		      };
		    }
		  };
		});