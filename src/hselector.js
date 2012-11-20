(function () {

    function HSelector(jElement) {
        this.jElement = jElement;
        this.initialise();
    }

    HSelector.prototype = Object.create(Subscribable.prototype);

    HSelector.prototype.initialise = function () {
        this.jElement.html(HSelector.HTML);
        this.jElement.delegate(".arrow.enabled", "click", this.handleClick.bind(this));
    };

    HSelector.prototype.handleClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget);
        if (jTarget.hasClass("left")) {
            this.fire("changed", this.selectedIndex - 1);
        } else {
            this.fire("changed", this.selectedIndex + 1);
        }
    };

    HSelector.prototype.render = function (values, selectedIndex) {

        var selectedValue = values[selectedIndex].label;

        this.jElement.find(".value").html(selectedValue);
        this.jElement.find(".left").toggleClass("enabled", selectedIndex > 0);
        this.jElement.find(".right").toggleClass("enabled", selectedIndex < values.length - 1);

        this.selectedIndex = selectedIndex;

    };

    HSelector.HTML = '' +
                     '<div class="hselector">' +
                     '<div class="arrow left">&#8592;</div>' +
                     '<div class="value"></div>' +
                     '<div class="arrow right">&#8594;</div>' +
                     '</div>';

    window.HSelector = HSelector;

})();