var app = angular.module('mainApp', []);

app.controller('mainController', function ($scope, appService, $sce) {
    $scope.username;
    $scope.showForm = true;
    $scope.showProjects = false;
    $scope.showReadmeContent = false;
    $scope.userUrl = 'https://api.github.com/users/';
    $scope.searchUser = function () {
        if ($scope.username) {
            appService.getUserData($scope.userUrl + $scope.username).then(function (response) {
                $scope.userDetails = response.data;
                console.log($scope.userDetails);
                $scope.getUserRepos($scope.userDetails.repos_url);
            }).catch(function (error) {
                console.log("catch", error);
            })
        }
    }
    $scope.getUserRepos = function (repoUrl) {
        appService.getUserRepos(repoUrl).then(function (response) {
            $scope.userRepoDetails = response.data;
            console.log($scope.userRepoDetails);
            $scope.showForm = false;
            $scope.showProjects = true;
        }).catch(function (error) {
            console.log("catch", error);
        })
    }
    $scope.getReadmeUrl = function (repoUrl) {
        appService.getReadmeUrl(repoUrl).then(function (response) {
            $scope.readmeDetails = response.data;
            console.log($scope.readmeDetails);
            $scope.showReadme($scope.readmeDetails.download_url);
            $scope.showProjects = false;
            $scope.showReadmeContent = true;
        }).catch(function (error) {
            console.log("catch", error);
        })
    }
    $scope.showReadme = function (readmeUrl) {
        appService.getReadme(readmeUrl).then(function (response) {
            $scope.readme = $sce.trustAsHtml($scope.parseMarkDown(response.data));
        }).catch(function (resp) {
            console.log("catch", resp);
        })
    }
    $scope.parseMarkDown = function (md_content) {
        return marked(md_content);
    }
});

app.service('appService', function ($http) {
    return {
        getUserData: function (userUrl) {
            return $http.get(userUrl);
        },
        getUserRepos: function (repoUrl) {
            return $http.get(repoUrl);
        },
        getReadmeUrl: function (repoUrl) {
            return $http.get(repoUrl + "/readme");
        },
        getReadme: function (readmeUrl) {
            return $http.get(readmeUrl, {
                headers: {
                    "Accept": "application/vnd.github.v3.raw"
                }
            });
        }
    };
});

// var app = angular.module('plunker', []);

// app.controller('MainCtrl', function($scope, Slim,$sce) {
//     Slim.getReadme().then(function(resp) {
//       console.log(resp)
//       $scope.readme = $sce.trustAsHtml($scope.parseMD(resp.data));
//     }).catch(function(resp) {
//       console.log("catch", resp);
//     });

//     $scope.parseMD = function(md_content){
//       return marked(md_content);
//     }

// });