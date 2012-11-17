(function () {

    module("Bus Tests", {
        setup:function () {
            data = null;
            jQuery("<div class='busData'></div>").appendTo(document.body);
            yaxham.modules.Buses.URL = "http://localhost:8080/buses";
            sinon.stub(jQuery, "ajax");
            jQuery.ajax.returns({
                                    then:function (f) {
                                        f(data);
                                    }});
            buses = new yaxham.modules.Buses(".busData");
        },
        teardown:function () {
            jQuery.ajax.restore();
            jQuery(".busData").remove();
            buses.destroy();
        }
    });

    test("Initialises", function () {

        given(buses.initialise());

        thenThe(jQuery(".busData h2"))
            .should(haveSize(1))
            .should(haveText("Bus Departures"));

        thenThe(jQuery(".busData .board"))
            .should(containText("Loading"));

        thenThe(jQuery.ajax).shouldHaveBeen(calledOnce);

    });

    test("Displays data", function () {

        given(data = []);
        given(buses.initialise());

        thenThe(jQuery(".busData .table"))
            .should(beThere);

    });

    var buses, data;

})();