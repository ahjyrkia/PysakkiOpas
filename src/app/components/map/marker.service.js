MyApp.service("MarkerService", function($http) {
    this.markerRadiusByZoom = function(currentZoom) {
        var newRadius;
        switch (true) {
            case (currentZoom === 17):
                newRadius = 8;
                break;
            case (currentZoom === 16):
                newRadius = 6;
                break;
            case (currentZoom === 15):
                newRadius = 3;
                break;
            case (currentZoom < 15 && currentZoom >= 13):
                newRadius = 1;
                break;
        }
        return newRadius;
    }

    this.distanceToDrawMarkersByZoom = function(currentZoom) {
        if (currentZoom === 16) return 0.004;
        if (currentZoom === 15) return 0.005;
        if (currentZoom === 14) return 0.009;
    }
    this.createUserMarker = function(location) {
        var userMarker = L.circleMarker(location, {
            color: "black"
        }).setRadius(8);
        return userMarker;
    }
})
