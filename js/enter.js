'use strict';

const app = angular.module('myapp', []);

app.value(
	'users', [
		{
			id: '0-12-34', name: 'アライ シゲル',
			birth: '1970-01-01', pt: 438
		},
		{
			id: '0-12-39', name: 'ハットリ タケシ',
			birth: '1990-10-01', pt: 0
		},
		{
			id: '1-32-02', name: 'アオト タケヒト',
			birth: '1970-03-21', pt: 1039
		}
	]	
);

app.value(
	'parkings', [
		{id: 'ぬ-01', shop: '沼写真館',reserve: null, lat: '33.956196', lng: '131.244948'},
		{id: 'ぬ-02', shop: '沼写真館',reserve: '19:00', lat: '33.956196', lng: '131.244948'}
	]
);

app.filter('filterId', [function() {
	return (data, query) => {
		if(query === undefined) return data;
		let results = [];
		angular.forEach(data, (val) => {
			const strId = val.id.replace(/-/g, '');
			const strQr = query.replace(/-/g, '');
			if(strId.indexOf(strQr) > -1) {
				results.push(val);
			}
		});
		return results;
	}
}]);

app.filter('filterName', [function() {
	return (data, query) => {
		if(query === undefined) return data;
		let results = [];
		angular.forEach(data, (val) => {
			const lines = query.split(/ |　/g);
			const len = lines.length;
			let getten = 0;
			for(let i=0; i<len; i++) {
				if((val.name).indexOf(lines[i]) > -1) {
					getten ++;
				} else {
					break;
				}
			}
			if(getten === len) {
				results.push(val);
			}
		});
		return results;
	}
}]);

app.factory('SharedScopes', function ($rootScope) {
    var sharedScopes = {};

    return {
        setScope: function (key, value) {
            sharedScopes[key] = value;
        },
        getScope: function (key) {
            return sharedScopes[key];
        }
    };
});

app.controller('userSelCtrl', function($scope, $timeout, users, SharedScopes) {
	$timeout(function() {
		$scope.$confirm = SharedScopes.getScope('confirmCtrl');
	})

	$scope.users = users;

	$scope.changeSelect = function(data) {
		if(data.id == $scope.$confirm.userSel.id) {
			$scope.$confirm.userSel = { id: null };
		} else {
			$scope.$confirm.userSel = data;
		}
	}
});

app.controller('parkingSelCtrl', function($scope, $timeout, parkings, SharedScopes) {
	$timeout(function() {
		$scope.$confirm = SharedScopes.getScope('confirmCtrl');
	})

	$scope.parks = parkings;

	$scope.changeSelect = function(data) {
		if(data.id == $scope.$confirm.parkSel.id) {
			$scope.$confirm.parkSel = { id: null };
		} else {
			$scope.$confirm.parkSel = data;
		}
	}

	$scope.getDist = function(lat, lng) {
		const park = new google.maps.LatLng(lat, lng);
		const shop = new google.maps.LatLng(33.956313, 131.245031);
		const dist = google.maps.geometry.spherical.computeDistanceBetween(shop, park);
		console.log(dist);
		return Math.floor(dist * 10) / 10 + 'm';
	}
});

app.controller('confirmCtrl', function($scope, SharedScopes) {
	SharedScopes.setScope('confirmCtrl', $scope);

	$scope.userSel = { id: null };
	$scope.parkSel = { id: null };

	$scope.isNull = function(str) {
		return str !== null ? str : '----';
	}

	$scope.getDist = function(lat, lng) {
		const park = new google.maps.LatLng(lat, lng);
		const shop = new google.maps.LatLng(33.956313, 131.245031);
		const distance = google.maps.geometry.spherical.computeDistanceBetween(shop, park);
		const dist = Math.floor(distance * 10) / 10;
		return dist > 0 ? dist + 'm' : '----';
	}
});

app.controller('finCtrl', function($scope, $location, users, parkings) {
	$scope.getParams = () => {
		let args = [];
		const pair = location.search.substring(1).split('&');
		for(let i=0; pair[i]; i++) {
			const key = pair[i].split('=');
			args[key[0]] = key[1];
		}
		return args;
	}
	$scope.getArrayData = (arr, id) => {
		console.log(arr, id);
		for(var i=0, len=arr.length; i<len; i++) {
			if(arr[i].id == id) {
				return arr[i];
			}
		}
		return undefined;
	}
	$scope.params = $scope.getParams();
	$scope.user = $scope.getArrayData(users, $scope.params.userId);
	$scope.park = $scope.getArrayData(parkings, decodeURI($scope.params.parkId));
	$scope.time = moment().add(1, 'm').format('H時mm分');
});