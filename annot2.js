;(function ($, window, document, undefined) {

  var annotJS = 'defaultAnnotJS',
    defaults = {
                  printID: true,
                load: [],
                class: "annotjs"
    };

    // constructor
    function Plugin( element, options) {
      this.element = element;
      this.options = $.extend({}, defaults, options);

      this._defaults = defaults;
      this._name = pluginName;

      this.init();  
    }

})( jQuery, window, document);
