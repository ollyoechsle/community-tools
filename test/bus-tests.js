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
            busController = yaxham.modules.Buses(".busData");
        },
        teardown:function () {
            jQuery.ajax.restore();
            jQuery(".busData").remove();
            busController.destroy();
        }
    });

    test("Initialises", function () {

        given(busController.initialise());

        thenThe(jQuery(".busData h2"))
            .should(haveSize(1))
            .should(haveText("Bus Departures"));

        thenThe(jQuery(".busData .board"))
            .should(containText("Loading"));

        thenThe(jQuery.ajax).shouldHaveBeen(calledOnce);

    });

    test("Displays data", function () {

        given(data = [departure(), departure()]);
        given(busController.initialise());

        thenThe(jQuery(".busData .table"))
            .should(beThere);

        thenThe(jQuery(".busData .table tbody tr"))
            .should(haveSize(2));

    });

    test("Iminent Departure", function () {

        given(data = [departure(moment())]);
        given(busController.initialise());

        thenThe(jQuery(".busData .table tbody tr"))
            .should(haveClass("iminent"));

    });

    test("Non Iminent Departure", function () {

        given(data = [departure()]);
        given(busController.initialise());

        thenThe(jQuery(".busData .table tbody tr"))
            .shouldNot(haveClass("iminent"));

    });

    test("Adds Tabs", function () {

        given(data = [departure()]);
        given(busController.initialise());

        thenThe(jQuery(".tabs li"))
            .should(haveSize(2));

        thenThe(jQuery(".tabs li").eq(0))
            .should(haveText("To Dereham"))
            .should(haveClass("selected"));

        thenThe(jQuery(".tabs li").eq(1))
            .should(haveText("To Norwich"))
            .shouldNot(haveClass("selected"))

    });

    function departure(at) {
        at = at || moment().add('hours', 1);
        return {
            "destination":"Norwich",
            "scheduled":at.format(),
            "estimated":"",
            "service":"4",
            "stop":"1234"
        }
    }

    var busController, data;

    function theUserClicksOn(jObj) {
        jObj.click();
    }

})();