MyApp.service("ApiService", function($http) {
    this.syncMethod = function() {
        return 0;
    }

    this.getThings = function() {
        return $http.get("http://localhost:3332/stop")
            .then(function(response) {
                return response.data;
            })
            .catch(function(err) {
                console.error("Error ApiService getThings ", err);
                return {};
            })
    }

    this.getTimetables = function(id) {
        return $http.get("http://localhost:3332/stop/" + id)
            .then(function(response) {
                return response.data;
            })
            .catch(function(err) {
                console.error("Error ApiService getTimetables ", err);
                return {};
            })
    }

    this.getRoute = function(origin, destination) {
        // console.log("http://localhost:3332/route/" + origin.lat +"+"+ origin.lng +"+"+ destination.lat +"+"+ destination.lng)
        return $http.get("http://localhost:3332/route/" + origin.lat + "+" + origin.lng + "+" + destination.lat + "+" + destination.lng)
            .then(function(response) {
                return response.data;
            })
            .catch(function(err) {
                console.error("Error ApiService getRoute ", err);
                return {};
            })
    }

    this.getRouteByAddress = function(origin, destination) {
        console.log("http://localhost:3332/routes/" + origin + "+" + destination)
        return $http.get("http://localhost:3332/routes/" + origin + "+" + destination)
            .then(function(response) {
                return response.data;
            })
            .catch(function(err) {
                console.error("Error ApiService getRouteByAddress ", err);
                return {};
            })
    }

    this.getAddress = function(coordinates) {
        return $http.get("http://localhost:3332/origin/" + coordinates.lat + "," + coordinates.lng)
            .then(function(response) {
                return response.data;
            })
            .catch(function(err) {
                console.error("Error ApiService getAddress ", err);
                return {};
            })
    }

})
