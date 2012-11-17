(function () {

    module("Bus Tests", {
        setup:function () {
            jQuery("<div class='busData'></div>").appendTo(document.body);
            yaxham.modules.Buses.URL = "http://localhost:8080/buses";
            sinon.stub(jQuery, "ajax");
            jQuery.ajax.returns({
                                    then:function (f) {
                                        f();
                                    }});
            buses = new yaxham.modules.Buses(".busData");
        },
        teardown:function () {
            jQuery.ajax.restore();
            jQuery(".busData").remove();
        }
    });

    test("Initialises", function () {

        given(buses.initialise());

        thenThe(jQuery(".busData h2"))
            .should(haveSize(1))
            .should(haveText("Bus Departures"));

        thenThe(jQuery.ajax).shouldHaveBeen(calledOnce);

    });

    var buses, data;

})();