(function($) {
    $.fn.listElement = function(e) {
        var nbMaxElem = e.nbMaxElem;

        $(this).html(
            "<textarea class='fw-textarea'></textarea>"
        );
        
        var textarea = $('.fw-textarea', this);
        var thisElem = $(this);
        resizeTextArea();

        $(textarea).focusout(function(e) { newElement(); });

        $(textarea).keydown(function(e) {
            if(e.keyCode == 13) {
                e.preventDefault();
                newElement(); 
            }
            else if(e.keyCode == 8) {
                if($(textarea).val() == '')
                    deleteElement($(".fw-elem:nth-last-child(2)", thisElem));
            }

            resizeTextArea();
        });

        $(thisElem).click(function(e) {
            $(textarea).focus();
        });

        $( window ).resize(function() {            
            resizeTextArea();
        });


        function deleteElement(elem) {
            $(elem).remove();

            if($(".fw-elem", thisElem).length < nbMaxElem)
                $(textarea).show();                
            
            resizeTextArea();
        }

        function newElement() {
            if($(textarea).val() != '') {
                $("<div class='fw-elem'><div><span class='text'>"+$(textarea).val()+"</span><span class='delete'>×</span></div></div>").insertBefore(textarea);
                $(textarea).val('');

                $('.delete', thisElem).click(function(e) { deleteElement($(this).parent().parent()); });
            }

            if($(".fw-elem", thisElem).length >= nbMaxElem)
                $(textarea).hide();

            resizeTextArea();
        }

        function resizeTextArea() {
            var thisElemWidth = $(thisElem).outerWidth();
            var tmpElemsWidth = 0;
            for (var i = 0; i < $(".fw-elem", thisElem).length; i++) {
                var elemWidth = $('.fw-elem:nth-child('+(i+1)+')', thisElem).outerWidth();
                if($(thisElem).width() < (tmpElemsWidth + elemWidth))
                    tmpElemsWidth = 0;
                if($(thisElem).width()-tmpElemsWidth < 30)
                    tmpElemsWidth = 0;
                
                if(elemWidth < $(thisElem).width())
                    tmpElemsWidth += elemWidth;
                else 
                    tmpElemsWidth = 0;
            }
            
            $(textarea).outerWidth($(thisElem).width()-tmpElemsWidth);
        }
    };


    $.fn.getElements = function(e) {
        var target = $(this)
        var elements = [];

        for (let index = 0; index < target.find(".text").length; index++) {
            elements.push($(target.find(".text")[index]).html());
        }
        return elements;
    };
})(jQuery); 
