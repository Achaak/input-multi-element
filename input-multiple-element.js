function InputMultiElement() {
    var inputMultiElementDOM = undefined;
    var textareaDOM          = $('<textarea class="ime-text-zone activate"></textarea>');
    var opts = {
        maxElement: 1000000
    };



    /**
     * Used to create the input mutli element
     *
     * @public
     * @param {string} _elem Class or id of the input mutli element
     * @param {Array} _opts List of options
     */
    function init(_elem, _opts) {
        // Defind variable
        inputMultiElementDOM = $(_elem);
        inputMultiElementDOM.empty(); // Clear element DOM
        inputMultiElementDOM.addClass("input-multi-element");
        $.extend(opts, _opts);

        // Add the textarea on the DOM
        inputMultiElementDOM.append(textareaDOM);

        // Bind this
        bindInputMultiElement();
    }


    /**
     * Used to create the input mutli element
     *
     * @private
     * @param {string} _elem Class or id of the input mutli element
     * @param {Array} _opts List of options
     */
    function bindInputMultiElement() {
        // Add a new elemetn if the textarea is focus out
        textareaDOM.focusout(function(_e) { 
            // Get target
            var _target = $(_e.currentTarget);

            // Get value
            var _value = _target.val();

            // Verif if the value is not null
            if (_value != "") {
                // Add the new element
                setElement(_value);

                // Reset the textarea
                clearTextZone()
            }
            
        });

        // Add a new element if press enter in the textarea or delete if the textarea is empty and the backspace key is press
        textareaDOM.keydown(function(_e) {
            if(_e.keyCode == 13) { // Return
                _e.preventDefault();

                // Get target
                var _target = $(_e.currentTarget);

                // Get value
                var _value = _target.val();

                // Verif if the value is not null
                if (_value != "") {
                    // Add the new element
                    setElement(_value);

                    // Reset the textarea
                    clearTextZone()
                }
            }
            else if(_e.keyCode == 8) { // Backspace
                // Get target
                var _target = $(_e.currentTarget);

                // Get value
                var _value = _target.val();
                
                // Verif if the value is null
                if (_value == "") {
                    // Delete the last element
                    deleteLastElement();
                }
            }
        });

        // Focus if input mutli element is clicked
        inputMultiElementDOM.click(function(_e) {
            if (!$(_e.target).closest(".ime-elem").length)
                textareaDOM.focus();
        });
    }



    /**
     * Used to clear the text zone
     *
     * @public
     */
    function clearTextZone() {
        textareaDOM.val("");
    }



    /**
     * Used to set a element with a index or not
     *
     * @public
     * @param {string} _text Text of the element
     * @param {number} _index Index of the element
     */
    function setElement(_text, _index) {
        // Verif max element
        if (getNbElements() < opts.maxElement) {

            // Create the new element
            var _newElement = $("<div class='ime-elem'><span class='ime-text'>"+_text+"</span><span class='ime-delete'>×</span></div>");

            // Bind the cross
            _newElement.find(".ime-delete").click(function(_e) {
                // Get target
                var _target = $(_e.currentTarget);

                // Remove element
                _target.closest(".ime-elem").remove();

                onDeleteElement();
            });

            // Bind the text
            _newElement.find(".ime-text").click(function(_e) {
                if ($(_e.target).hasClass("ime-textarea-elem"))
                    return false;

                // Get target
                var _target = $(_e.currentTarget);

                // Get value
                var _value = _target.text()

                // Create the textarea
                var _textareaElemDOM = $("<textarea class='ime-textarea-elem'>"+_value+"</textarea>");
                
                _target.html(_textareaElemDOM);

                // Focus the textarea
                _textareaElemDOM.select();



                // Bind focus out
                _textareaElemDOM.focusout(function(_e) {
                    // Get target
                    var _target = $(_e.currentTarget);

                    // Get value
                    var _value = _target.val();

                    updateElementsById(_value, _target.closest(".ime-elem").index())
                });


                
                // Bind focus out key enter
                _textareaElemDOM.keydown(function(_e) {
                    if(_e.keyCode == 13) { // Return
                        _e.preventDefault();

                        // Get target
                        var _target = $(_e.currentTarget);
    
                        // Get value
                        var _value = _target.val();
    
                        updateElementsById(_value, _target.closest(".ime-elem").index())
                    }
                });
            });

            // Insert the new element
            if( !_index && _index != 0) { // If has not a index
                _newElement.insertBefore(textareaDOM);
            }
            else { // If has a index
                var _elementAfter = $(inputMultiElementDOM.find(".ime-elem")[_index]);
                
                if (_elementAfter.length) _newElement.insertBefore(_elementAfter);
                else                      _newElement.insertBefore(textareaDOM);
            }


            // Event
            onSetElement(_newElement);
        }
    }



    /**
     * Used to set a array of elements with a index or not
     *
     * @public
     * @param {Array} _texts Array of the string elements
     * @param {number} _index Index of the first element of the array
     */
    function setElements(_texts, _index) {
        for (var i = 0; i < _texts.length; i++) {
            if( !_index && _index != 0) // If has not a index
                setElement(_texts[i]);
            else
                setElement(_texts[i], (_index+i));
        }
    }



    /**
     * Used to delete the last element
     *
     * @public
     */
    function deleteLastElement() {
        // Get the last element
        var _elem = inputMultiElementDOM.find('.ime-elem').last();

        if (_elem.length) {
            // Delete element
            _elem.remove();

            // Event
            onDeleteElement();
        }
    }
    
    

    /**
     * Used to delete an element with a index
     *
     * @public
     * @param {number} _index Index of the element
     */
    function deleteElementById(_index) {
        // Get the last element
        var _elem = inputMultiElementDOM.find('.ime-elem')[_index];

        try {
            // Delete element
            _elem.remove();

            // Event
            onDeleteElement();
        } catch(_e) {}
    }



    /**
     * Used to delete an elements with a value
     *
     * @public
     * @param {string} _values Value of the elements
     */
    function deleteElementsByValue(_value) {
        for (var i = 0; i < inputMultiElementDOM.find(".ime-elem").length; i++) {
            // Get element DOM
            var _elemDOM = $(inputMultiElementDOM.find(".ime-elem")[i]);

            if (_elemDOM.find(".ime-text").text() == _value)
                deleteElementById(i);
        }
    }



    /**
     * Used to update an elements with an index
     *
     * @public
     * @param {string} _value Value of the elements
     * @param {number} _index Index of the elements
     */
    function updateElementsById(_value, _index) {
        // Get element
        var _elemDOM = $(inputMultiElementDOM.find('.ime-elem')[_index]);

        if (_elemDOM.length) {
            // Update element
            _elemDOM.find('.ime-text').text(_value);

            // Event
            onUpdateElement(_elemDOM)
        }
    }



    /**
     * Used to update an elements with a value
     *
     * @public
     * @param {string} _newValue New value of the elements
     * @param {string} _lastValue Last value of the elements
     */
    function updateElementsByValue(_newValue, _lastValue) {
        for (var i = 0; i < inputMultiElementDOM.find(".ime-elem").length; i++) {
            // Get element DOM
            var _elemDOM = $(inputMultiElementDOM.find(".ime-elem")[i]);

            if (_elemDOM.find(".ime-text").text() == _lastValue) {
                _elemDOM.find(".ime-text").text(_newValue)

                // Event
                onUpdateElement(_elemDOM)
            }
        }
    }



    /**
     * Used to get an array of string of elements
     *
     * @public
     * @returns {Array} Returns an array of elements
     */
    function getElements() {
        var _elemList = [];

        for (var i = 0; i < inputMultiElementDOM.find(".ime-elem").length; i++) {
            // Get element DOM
            var _elemDOM = $(inputMultiElementDOM.find(".ime-elem")[i]);

            // Get element value
            _elemList.push(_elemDOM.find(".ime-text").text());
        }

        return _elemList;
    }



    /**
     * Used to get an array of DOM elements
     *
     * @public
     * @returns {Array} Returns an array of DOM elements
     */
    function getElementsDOM() {
        var _elemList = [];

        for (var i = 0; i < inputMultiElementDOM.find(".ime-elem").length; i++) {
            // Get element DOM
            var _elemDOM = $(inputMultiElementDOM.find(".ime-elem")[i]);

            // Get element value
            _elemList.push(_elemDOM);
        }

        return _elemList;
    }
    
    
    
    /**
     * Used to get an element with an index
     *
     * @public
     * @param {number} _index Index of the element
     * @returns {Array} Returns an element
     */
    function getElementById(_index) {
        // Get element DOM
        var _elemDOM = $(inputMultiElementDOM.find(".ime-elem")[_index]);

        if (_elemDOM.length)
            return _elemDOM.find(".ime-text").text();
    }
    
    
    
    /**
     * Used to get an DOM element with an index
     *
     * @public
     * @param {number} _index Index of the element
     * @returns {Array} Returns a DOM element
     */
    function getElementDOMById(_index) {
        // Get element DOM
        var _elemDOM = $(inputMultiElementDOM.find(".ime-elem")[_index]);

        if (_elemDOM.length)
            return _elemDOM;
    }



    /**
     * Used to get a number of the elements
     *
     * @public
     * @returns {number} Returns number of elements
     */
    function getNbElements() {
        return inputMultiElementDOM.find(".ime-elem").length;
    }



    /**
     * Used to get a number of the elements with a value
     *
     * @public
     * @param {string} _value Value of the elements
     * @returns {number} Returns number of elements by value
     */
    function nbElementByValue(_value) {
        var cptElement = 0;

        for (var i = 0; i < inputMultiElementDOM.find(".ime-elem").length; i++) {
            // Get element DOM
            var _elemDOM = $(inputMultiElementDOM.find(".ime-elem")[i]);

            if (_elemDOM.find(".ime-text").text() == _value) {
                cptElement++;
            }
        }

        return cptElement;
    }



    /**
     * Used to know if an element exist
     *
     * @public
     * @param {string} _value Value of the elements
     * @returns {boolean} Return true if the element exist if not false
     */
    function hasElement(_value) {
        return (nbElementByValue(_value) ? true : false);
    }



    /**
     * Used to activate the text zone
     *
     * @public
     * @param {boolean} _bool True to activate / False to desactivate 
     */
    function activateTextZone(_bool) {
        textareaDOM[(_bool ? "addClass" : "removeClass")]("activate");
    }



    /**
     * Used to trigger an event if an element is created
     *
     * @private
     * @param {Array} _elem DOM of the element set
     */
    function onSetElement(_elem) {
        inputMultiElementDOM.trigger("ime:element:add", {
            element: _elem,
            text: _elem.find(".ime-text").html(),
            index: _elem.index()
        });
        
        // Desactivate textarea
        if (getNbElements() >= opts.maxElement) activateTextZone(false);
    }



    /**
     * Used to trigger an event if an element is deleted
     *
     * @private
     */
    function onDeleteElement() {
        inputMultiElementDOM.trigger("ime:element:delete");
        
        // Activate textarea
        if (getNbElements() < opts.maxElement) activateTextZone(true);
    }



    /**
     * Used to trigger an event if an element is updated
     *
     * @private
     * @param {Array} _elem DOM of the element set
     */
    function onUpdateElement(_elem) {
        inputMultiElementDOM.trigger("ime:element:update", {
            element: _elem,
            text: _elem.find(".ime-text").html(),
            index: _elem.index()
        });
    }



    return {
        "init": function(_elem, _opts) {
            init(_elem, _opts);
        },
        "setElement": function(_text, _index) {
            setElement(_text, _index);
        },
        "setElements": function(_texts, _index) {
            setElements(_texts, _index);
        },
        "getElements": function() {
            return getElements();
        },
        "getElementsDOM": function() {
            return getElementsDOM();
        },
        "getElementById": function(_id) {
            return getElementById(_id);
        },
        "getElementDOMById": function(_id) {
            return getElementDOMById(_id);
        },
        "getNbElements": function() {
            return getNbElements();
        },
        "deleteLastElement": function() {
            deleteLastElement();
        },
        "deleteElementById": function(_id) {
            deleteElementById(_id);
        },
        "deleteElementsByValue": function(_value) {
            deleteElementsByValue(_value);
        },
        "updateElementsById": function(_value, _id) {
            updateElementsById(_value, _id);
        },
        "updateElementsByValue": function(_newValue, _lastValue) {
            updateElementsByValue(_newValue, _lastValue);
        },
        "hasElement": function(_value) {
            return hasElement(_value);
        },
        "nbElementByValue": function(_value) {
            return nbElementByValue(_value);
        },
        "activateTextZone": function(_bool) {
            return activateTextZone(_bool);
        },
        "clearTextZone": function() {
            clearTextZone();
        }
    };
}