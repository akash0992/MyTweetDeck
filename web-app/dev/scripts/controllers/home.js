'use strict';

/**
 * @ngdoc function
 * @name yoApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the yoApp
 */
angular.module('yoApp')
    .controller('HomeCtrl', ['$scope', '$window', 'HomeService', 'ProfileService', function ($scope, $window, HomeService, ProfileService) {
        $scope.signIn = function () {
            jQuery('#signin').modal({
                keyboard: false
            });
        };
        $scope.favouriteTweets = [];
        ProfileService.getProfile(function (err, data) {
            if (data) {
                $scope.profile = data;
                console.log(data);
            }
            else {
                $window.location.href = '#/';
            }
        });
        HomeService.getFriends(function (err,friends) {
            console.log('friend list:',friends);

        });
        $scope.tweet = function () {
            if ($scope.tweetStatus) {
                console.log('status', $scope.tweetStatus);
                HomeService.tweet($scope.tweetStatus, function (err, data) {
                    if (data) {
                        $scope.tweets.push($scope.tweetStatus);
                    }
                });
            }
        }
        console.log('home controller called');
        HomeService.getTweets(function (user_timeline_tweets) {
            console.log('service called');
            if (typeof user_timeline_tweets == 'object') $scope.tweets = user_timeline_tweets;
            console.log(user_timeline_tweets);
        });
        $scope.retweet = function (id) {
            console.log('retweet method called');
            console.log(id);
            HomeService.reTweet(id, function (data) {
                console.log(data, 'data in retweet method');
                if (data) {
                    console.log('retweet successfully...');
                    $scope.tweets.forEach(function (tweet) {
                        if (tweet.id_str == id)
                            tweet.retweeted = true;
                    });

                }
            })
        }
        $scope.favourite = function (fav_tweet) {
            HomeService.makeFavourite(fav_tweet, function (data) {
                if (data) {
                    console.log(data);
                    $scope.tweets.forEach(function (tweet) {
                        if (tweet.id_str == fav_tweet.id_str)
                            tweet.favorited = true;
                    });
//                    if($scope.favouriteTweets){
                    $scope.favouriteTweets.push(data);
                    console.log('favourite tweet updated ', fav_tweet, 'favourite Tweet', $scope.favouriteTweets);
//                    }
                }
            })
        }
        HomeService.getFavoriteTweets(function (tweets) {
            $scope.favouriteTweets = tweets;
        });
        (function () {
            setInterval(function () {
                HomeService.getTweets(function (user_timeline_tweets) {
                    console.log(user_timeline_tweets, 'new tweets');
                    console.log('service called');
                    if (typeof user_timeline_tweets == 'object') {
                        var temp = [];
                        var flag = false;
                        $scope.tweets.forEach(function (tweet) {
                            user_timeline_tweets.forEach(function (newTweet) {
                                if (tweet.id_str === newTweet.id_str) {
                                    flag = true;
                                }
                            });
                            if (!flag) {
                                temp.push(tweet);
                            }
                            console.log('outer part');
                            flag = false;
                        });
                        console.log('temp....',temp);
                        console.log('if part...');
                        temp.forEach(function(oldTweet){
                            user_timeline_tweets.push(oldTweet);


                        });
                        console.log(user_timeline_tweets.length,':length of user Time Line Tweets');
                        $scope.tweets = user_timeline_tweets;
                    }

                    console.log(user_timeline_tweets);
                });
            }, 60000);
        })();
        $scope.search=function(id,name){
            if(id && name){
                HomeService.getUserTimeLine({user_id:id,screen_name:name},function(err,data){
                    if(err){
                        console.log('error while getting user time line tweets');
                    }
                    else{
                        console.log('user time line tweets:',data);
                        $scope.friendTimelines=data;
                    }
                });
            }
        }
    }]);