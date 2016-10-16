MyApp.service("PanelService", function($http) {
    this.getPanelElements = function(legs) {
        var content = "";
        if (legs[0].startTime == null) return "";
        for (var i = 0; i < legs.length; i++) {
            var leg = legs[i];
            var time = new Date(leg.startTime);
            var endTime = new Date(leg.endTime);
            var minutes = time.getMinutes(),
                hours = time.getHours();
            var endMinutes = endTime.getMinutes(),
                endHours = endTime.getHours();
            if (minutes < 10) var minutes = "0" + minutes;
            if (hours < 10) var hours = "0" + hours;
            if (endMinutes < 10) var endMinutes = "0" + endMinutes;
            if (endHours < 10) var endHours = "0" + endHours;

            content = content + "<b style=margin:0px;padding:0px>" + hours + ":" + minutes + " </b>"
            var color = this.routeColorByType(leg.mode);
            if (leg.mode === "WALK") {
                content = content + "<b style=margin:0px;padding:0px;color:" + color + ">walk </b>"
                content = content + "<b style=margin:0px;padding:0px;> to " + leg.to.name + "</b>"
            } else if (leg.route.shortName != null) {
                content = content + "<b style=margin:0px;padding:0px;color:" + color + ">" + leg.route.shortName + "</b>"
                content = content + "<b style=margin:0px;padding:0px;> (" + leg.trip.tripHeadsign + ")</b>"
                content = content + "<b style=margin:0px;padding:0px;> to " + leg.to.name + "</b>"
            } else if (leg.mode === "SUBWAY") {
                content = content + "<b style=margin:0px;padding:0px;color:" + color + ">M</b>"
                content = content + "<b style=margin:0px;padding:0px;> " + leg.trip.tripHeadsign + "</b>"
            }
            content = content + "<b id=endTime> " + endHours + ":" + endMinutes + "</b><br>"
        }
        console.log(content)
        return content;
    }

    this.routeColorByType = function(type) {
        if (type === "WALK") {
            return "#00cc99";
        }
        if (type === "BUS") {
            return "#0066cc";
        }
        if (type === "TRAM") {
            return "#00cc00";
        }
        if (type === "SUBWAY") {
            return "DarkOrange";
        }
        if (type === "RAIL") {
            return "#cc00cc";
        }
        if (type === "FERRY") {
            return "Coral";
        }
        return "Grey";
    }
})
