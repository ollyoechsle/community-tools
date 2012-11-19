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
            .should(haveClass("loading"));

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

    test("Limits amount of data", function () {

        given(data = [departure(), departure(), departure(), departure(), departure(), departure(), departure()]);
        given(busController.initialise());

        thenThe(jQuery(".busData .table tbody tr"))
            .should(haveSize(5));

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
            .should(haveAttribute("data-direction", "dereham"))
            .should(haveText("To Dereham"));

        thenThe(jQuery(".tabs li").eq(1))
            .should(haveAttribute("data-direction", "norwich"))
            .should(haveText("To Norwich"));

    });

    test("Selects Correct Tabs", function () {

        given(busController.model.data = [departure()]);

        when(busController.model.direction = "norwich");
        when(busController.view.updateAll());

        thenThe(jQuery(".tabs li.selected"))
            .should(haveAttribute("data-direction", "norwich"));

        when(busController.model.direction = "dereham");
        when(busController.view.updateAll());

        thenThe(jQuery(".tabs li.selected"))
            .should(haveAttribute("data-direction", "dereham"));

    });

    test("Switch tabs", function () {

        given(sinon.stub(busController, "load"));
        given(data = [departure()]);
        given(busController.initialise());

        thenThe(busController.load).shouldHaveBeen(calledOnce);

        given(data = null);
        when(theUserClicksOn(jQuery(".tabs li:not(.selected)")));
        thenThe(jQuery(".busData .board"))
            .should(haveClass("loading"));

        thenThe(busController.load).shouldHaveBeen(calledAgain);

    });

    test("Switch stops", function () {

        given(sinon.spy(busController.view, "updateAll"));
        given(data = [departure()]);
        given(busController.initialise());

        thenThe(jQuery("select")).should(haveValue("0"));

        when(jQuery("select").val("1"));

        thenThe(jQuery("select")).should(haveValue("1"));

        thenThe(busController.view.updateAll).shouldHaveBeen(calledTwice);

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