MyApp.controller('IntroController', function($scope, ApiService, PanelService, MarkerService, $http, leafletMarkerEvents, $window) {
    var resizeMap = function() {
        $scope.frameHeight = $window.innerHeight;
        $scope.frameWidth = $window.innerWidth;
        var map = document.getElementById("map");
        map.style = "height:" + $scope.frameHeight + "px; width:" + $scope.frameWidth + "px;"
    }
    resizeMap();
    $scope.userMarker;
    ApiService.getThings()
        .then(function(stops) {
            $scope.stops = stops;
            $scope.addMarker();
        })
    $scope.map, $scope.userLocation;
    $scope.initMap = function() {
        $scope.map = L.map('map', {
            dragging: true,
            tap: false,
        });
        $scope.map.locate({
            watch: true,
            setView: true
        });
        $scope.userLocation = $scope.map.locate()._initialCenter;
        L.tileLayer('https://api.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png', {
            maxZoom: 16,
            minZoom: 14,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ',
            id: 'hsl-map'
        }).addTo($scope.map);

        $scope.map.on('locationfound', function(e) {
            $scope.userLocation = e.latlng;
            $scope.addUserMarker();
            ApiService.getAddress($scope.userLocation)
                .then(function(address) {
                    document.getElementById("origin").value = address.features[0].properties.label;
                })
        });
        $scope.map.on('drag', function(e) {
            $scope.addMarker()
        });
        $window.onresize = function(event) {
            resizeMap();
        };
        $scope.map.on('zoomend', function(e) {
            $scope.addMarker()
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setRadius(MarkerService.markerRadiusByZoom($scope.map.getZoom()));
            }
        });
    }
    $scope.drawnStop = [], $scope.markers = [];
    $scope.addMarker = function() {
        var center = $scope.map.getCenter(),
            dis = MarkerService.distanceToDrawMarkersByZoom($scope.map.getZoom()),
            radius = MarkerService.markerRadiusByZoom($scope.map.getZoom());
        for (var i = 0; i < $scope.stops.length; i++) {
            var stop = $scope.stops[i];
            var coords = stop.coords.split(",");
            var lat = parseFloat(coords[0]),
                lng = parseFloat(coords[1]);
            if (Math.abs(center.lat - lat) < dis && Math.abs(center.lng - lng) < dis * 2 && $scope.drawnStop.indexOf(stop) === -1) {
                var marker = L.circleMarker([lat, lng], {
                    color: $scope.colorByType(stop.type)
                }).setRadius(radius);
                marker.bindPopup(L.popup({
                    closeOnClick: true
                }).setContent("<div class=" + "spinner" + "> <div class=" + "double-bounce1" + "></div> <div class=" + "double-bounce2" + "></div> </div>"));
                marker.stopId = stop.code;
                marker.on('click', function(e) {
                    $scope.map.setView(e.latlng);
                    var thisMarker = this;
                    ApiService.getTimetables(thisMarker.stopId)
                        .then(function(stop) {
                            thisMarker._popup.setContent($scope.createPopupContent(stop));
                        })
                    ApiService.getRoute($scope.userLocation, thisMarker._latlng)
                        .then(function(route) {
                            $scope.addRoute(route.data.plan.itineraries);
                        })
                });
                marker.addTo($scope.map);
                $scope.markers.push(marker);
                $scope.drawnStop.push(stop);
            }
        }
    }

    $scope.addUserMarker = function() {
        if ($scope.userMarker != null) {
            $scope.map.removeLayer($scope.userMarker)
        }
        $scope.userMarker = MarkerService.createUserMarker($scope.userLocation);
        $scope.userMarker.addTo($scope.map);
        $scope.map.locate({
            watch: true,
            setView: false
        });
    }

    $scope.addRoute = function(itineraries) {
        if ($scope.geoJSONLayers != null) {
            for (var i = 0; i < $scope.geoJSONLayers.length; i++) {
                $scope.map.removeLayer($scope.geoJSONLayers[i]);
            }
        }
        if ($scope.routeTransferPopups != null) {
            for (var i = 0; i < $scope.routeTransferPopups.length; i++) {
                $scope.map.removeLayer($scope.routeTransferPopups[i]);
            }
        }
        $scope.routeTransferPopups = [];
        $scope.geoJSONLayers = [];
        $scope.routeInformation = [];
        for (var i = 0; i < itineraries.length; i++) {
            for (var j = 0; j < itineraries[i].legs.length; j++) {
                var coordinates = [];
                for (var h = 0; h < itineraries[i].legs[j].legGeometry.points.length; h++) {
                    var latlng = itineraries[i].legs[j].legGeometry.points[h].split(",");
                    coordinates.push([latlng[1], latlng[0]])
                }
                var myLines = [{
                    "type": "LineString",
                    "coordinates": coordinates,
                }];
                var myStyle = {
                    "color": PanelService.routeColorByType(itineraries[i].legs[j].mode),
                    "weight": 5,
                    "opacity": 0.65
                };
                var geoJSONLayer = L.geoJson(myLines, {
                    style: myStyle
                });
                var autoPan = false;
                if (j === 0 && itineraries[i].legs[j].length > 1) {
                    autoPan = true;
                }
                var popupOptions = {
                    "keepInView": false,
                    "autoPan": autoPan,
                    "closeOnClick": false
                }
                $scope.routeInformation.push(itineraries[i].legs[j]);
                var transferPopup = L.popup(popupOptions)
                    .setLatLng([itineraries[i].legs[j].from.lat, itineraries[i].legs[j].from.lon])
                    .setContent($scope.popupDepartureContent(itineraries[i].legs[j]));
                $scope.routeTransferPopups.push(transferPopup);
                $scope.geoJSONLayers.push(geoJSONLayer);
            }
        }
        document.getElementById("routepanel").innerHTML = PanelService.getPanelElements($scope.routeInformation);
        var newSliderHeight = 30 + $scope.routeInformation.length * 20 + "px;";
        document.getElementById("foot").style = "height:" + newSliderHeight;
        for (var i = 0; i < $scope.geoJSONLayers.length; i++) {
            $scope.geoJSONLayers[i].addTo($scope.map);
        }
        for (var i = 0; i < $scope.routeTransferPopups.length; i++) {
            $scope.routeTransferPopups[i].addTo($scope.map);
        }
    }

    $scope.popupDepartureContent = function(leg) {
        if (leg.startTime == null) return "<b style=margin:0px;padding:0px>" + Math.round(leg.distance) + "m</b>";
        var time = new Date(leg.startTime);
        var minutes = time.getMinutes(),
            hours = time.getHours();
        if (minutes < 10) {
            var minutes = "0" + minutes;
        }
        if (hours < 10) {
            var hours = "0" + hours;
        }
        var content = "<b style=margin:0px;padding:0px>" + hours + ":" + minutes + " </b>"
        var color = PanelService.routeColorByType(leg.mode);
        if (leg.mode === "WALK") {
            content = content + "<b style=margin:0px;padding:0px;color:" + color + ">walk </b>"
        } else if (leg.route.shortName != null) {
            content = content + "<b style=margin:0px;padding:0px;color:" + color + ">" + leg.route.shortName + "</b>"
            content = content + "<b style=margin:0px;padding:0px;> " + leg.trip.tripHeadsign + "</b>"
        } else if (leg.mode === "SUBWAY") {
            content = content + "<b style=margin:0px;padding:0px;color:" + color + ">M</b>"
            content = content + "<b style=margin:0px;padding:0px;> " + leg.trip.tripHeadsign + "</b>"
        }
        return content;
    }

    $scope.colorByType = function(type) {
        if (type === "0") {
            return "Green";
        }
        if (type === "3") {
            return "Blue";
        }
        if (type === "1") {
            return "Orange";
        }
        if (type === "109") {
            return "Purple";
        }
    }
    $scope.createPopupContent = function(data) {
        if (data[0].departures == null) return "<b style=margin:0px;padding:0px>No departures to 2 hours </b>"
        var content = "<b style=margin:0px;padding:0px>" + data[0].name_fi + "</b><p style=color:grey;margin:0px;padding:0px>" + data[0].address_fi + "<a style=margin:0px;padding:0px target=_blank href=" + data[0].timetable_link + ">" + " " + data[0].code_short + "</a></p>";
        for (var i = 0; i < data[0].departures.length; i++) {
            var time = "" + data[0].departures[i].time;
            content = content + "<b style=margin:0px;padding:0px>" + time.substr(0, 2) + ":" + time.substr(2, 3) + "</b>" + " " + $scope.parseBusNumber(data[0].departures[i].code, data[0].lines) + "<br>"
            if (i > 4) {
                break;
            }
        }
        return content;
    }
    $scope.parseBusNumber = function(busCode, lines) {
        var destination;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].search(busCode) !== -1) {
                destination = lines[i].split(":")[1];
            }
        }
        busCode = busCode.split(" ")[0];
        if (busCode.indexOf("M") !== -1) {
            return "<b style=margin:0px;padding:0px;color:orange> M </b> <span style=margin:0px;padding:0px>" + destination + "</span>";
        }
        if (busCode.substr(0, 3) === "100") {
            return "<b style=margin:0px;padding:0px;color:green> " + busCode.substr(3, busCode.toString().length) + "</b> <span style=margin:0px;padding:0px>" + destination + "</span>";
        }
        if (busCode === "1010") {
            return "<b style=margin:0px;padding:0px;color:green> " + busCode.substr(2, busCode.toString().length) + "</b> <span style=margin:0px;padding:0px>" + destination + "</span>";
        }
        if (busCode.substr(0, 2) === "10") {
            return "<b style=margin:0px;padding:0px;color:blue;font-size:15px> " + busCode.substr(2, busCode.toString().length) + "</b> <span style=margin:0px;padding:0px>" + destination + "</span>";
        }
        if (busCode.substr(0, 3) === "300") {
            return "<b style=margin:0px;padding:0px;color:purple> " + busCode.substr(4, busCode.toString().length) + "</b> <span style=margin:0px;padding:0px>" + destination + "</span>";
        }

        return "<b style=margin:0px;padding:0px;color:blue> " + busCode.substr(1, busCode.toString().length) + "</b> <span style=margin:0px;padding:0px>" + destination + "</span>";
    }
    $scope.searchButtonEvent = function() {
        var origin = document.getElementById("origin").value.replace("ä", "a").replace("ö", "o"),
            destination = document.getElementById("destination").value.replace("ä", "a").replace("ö", "o");

        ApiService.getRouteByAddress(origin, destination)
            .then(function(json) {
                $scope.addRoute(json.data.plan.itineraries)
                if (!$('footer').is(':visible')) {
                    $('footer').slideToggle(200);
                }
            })
    }

    jQuery(function($) {
        $('.footer').on('click', function() {
            $('footer').slideToggle(200);
        });

    });
    $scope.initMap();
    document.documentElement.style.overflow = 'hidden'; // firefox, chrome
    // document.body.scroll = "no"; // ie only
});
