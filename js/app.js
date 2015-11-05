// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var facebookExample = angular.module('starter', ['ionic', 'ngStorage', 'ngCordova'])

facebookExample.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

facebookExample.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller: 'ProfileController'
        })
        .state('feed', {
            url: '/feed',
            templateUrl: 'templates/feed.html',
            controller: 'FeedController'
        });
    $urlRouterProvider.otherwise('/login');
});

facebookExample.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location, $cordovaSocialSharing) {

    $scope.login = function() {
		// replace "fbId" with your app id...
        $cordovaOauth.facebook(fbId, ["user_birthday", "user_hometown",
				"user_friends, publish_actions "]).then(function(result) {
			console.log('result ' + JSON.stringify(result));
            $localStorage.accessToken = result.access_token;
            $location.path("/profile");
			console.log('enter function');
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };
	//this is not working yet...
	$scope.shareAnywhere = function(){
		$cordovaSocialSharing
		.shareViaFacebook('hello', '', '')
		.then(function(result){
			console.log('result ' + result);
			alert(result);
		}, function(err){
			console.log('err ' + err);
			alert(err);
		});
	}

});

facebookExample.controller("ProfileController", function($scope, $http, $localStorage, $location) {

    $scope.init = function() {
		console.log('enter profile controller');
        if($localStorage.hasOwnProperty('accessToken') === true) {
			console.log('$localStorage.accessToken ' + $localStorage.accessToken);
            $http.get('https://graph.facebook.com/v2.5/me', {
				params: { access_token: $localStorage.accessToken,
							fields: "id, locale, first_name, last_name, gender, hometown, birthday, taggable_friends",
							format: "json" }
						}).then(function(result) {
				console.log('profile result ' + JSON.stringify(result));
				$localStorage.userId = result.data.id;
				console.log('$localStorage.userId ' + $localStorage.userId);
				//alert("profile result " + JSON.stringify(result.data));
                $scope.profileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    };
	// list_friends has this form ['secret_id_friend1','secret_id_friend2'...] yes, only one value....
	$scope.postFB = function(){
		console.log('entering posting function');
		$http.post("https://graph.facebook.com/v2.5/me/feed", {
			params:{access_token: $localStorage.accessToken,
					message: "Hello...",
		tags: list_friends
					}
			}
		).then(function(result) {
			alert("Posting....");
			console.log('feed result ' + JSON.stringify(result));
		}, function(error) {
			alert("There was a problem. Check the logs for details.");
			console.log(error);
		});
	}
});

facebookExample.controller("FeedController", function($scope, $http, $localStorage, $location) {

    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true) {
            $http.get("https://graph.facebook.com/v2.5/me/feed", { 
				params: { access_token: $localStorage.accessToken,
							format: "json" }}
			).then(function(result) {
				console.log('feed result ' + JSON.stringify(result)),
                $scope.feedData = result.data.data;
                $http.get("https://graph.facebook.com/v2.5/me", { 
					params: { access_token: $localStorage.accessToken, 
						fields: "picture", 
						format: "json" }}).then(function(result) {
					
                    $scope.feedData.myPicture = result.data.picture.data.url;
                });
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
            $location.path("/login");
        }
    };

});

facebookExample.controller("SocialSharing", function($scope, $cordovaSocialSharing) {
	
	$scope.shareAnywhere = function(){
		console.log('enter function');
		$cordovaSocialSharing
		.shareViaFacebook('hello', '', '')
		.then(function(result){
			console.log('result ' + result);
			alert(result);
		}, function(err){
			console.log('err ' + err);
			alert(err);
		});
	}

});
