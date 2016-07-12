// angular.module('starter.controllers', [])
//
// .controller('DashCtrl', function($scope) {
//
//
//
// })
//
// .controller('ChatsCtrl', function($scope, Chats) {
//   // With the new view caching in Ionic, Controllers are only called
//   // when they are recreated or on app start, instead of every page change.
//   // To listen for when this page is active (for example, to refresh data),
//   // listen for the $ionicView.enter event:
//   //
//   //$scope.$on('$ionicView.enter', function(e) {
//   //});
//
//   $scope.chats = Chats.all();
//   $scope.remove = function(chat) {
//     Chats.remove(chat);
//   };
// })
//
// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })
//
// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
//
//
// });

angular.module('mychat.controllers', [])


  .controller('LoginCtrl', function ($scope, $ionicModal, $state) {
    console.log('Login Controller Initialized');

    $ionicModal.fromTemplateUrl('templates/signup.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });



    $scope.createUser = function (user) {
      console.log("Create User Function called");
      if (user && user.email && user.password && user.displayname) {
        $ionicLoading.show({
          template: 'Signing Up...'
        });
        auth.$createUser({
          email: user.email,
          password: user.password
        }).then(function (userData) {
          alert("User created successfully!");
          ref.child("users").child(userData.uid).set({
            email: user.email,
            displayName: user.displayname
          });
          $ionicLoading.hide();
          $scope.modal.hide();
        }).catch(function (error) {
          alert("Error: " + error);
          $ionicLoading.hide();
        });
      } else
        alert("Please fill all details");
    }



    $scope.signIn = function () {
      if (user && user.email && user.pwdForLogin) {
        $ionicLoading.show({
          template: 'Signing In...'
        });
        auth.$authWithPassword({
          email: user.email,
          password: user.pwdForLogin
        }).then(function (authData) {
          console.log("Logged in as:" + authData.uid);
          ref.child("users").child(authData.uid).once('value', function (snapshot) {
            var val = snapshot.val();
            // To Update AngularJS $scope either use $apply or $timeout
            $scope.$apply(function () {
              $rootScope.displayName = val;
            });
          });
          $ionicLoading.hide();
          $state.go('tab.rooms');
        }).catch(function (error) {
          alert("Authentication failed:" + error.message);
          $ionicLoading.hide();
        });
      } else
        alert("Please enter email and password both");
    }
  })

  .controller('ChatCtrl', function ($scope, Chats, $state) {
    //console.log("Chat Controller initialized");

    $scope.IM = {
      textMessage: ""
    };

    Chats.selectRoom($state.params.roomId);

    var roomName = Chats.getSelectedRoomName();

    // Fetching Chat Records only if a Room is Selected
    if (roomName) {
      $scope.roomName = " - " + roomName;
      $scope.chats = Chats.all();
    }

    $scope.sendMessage = function (msg) {
      console.log(msg);
      Chats.send($scope.displayName, msg);
      $scope.IM.textMessage = "";
    }

    $scope.remove = function (chat) {
      Chats.remove(chat);
    }
  })


  .controller('RoomsCtrl', function ($scope, Rooms, Chats, $state) {
    //console.log("Rooms Controller initialized");
    $scope.rooms = Rooms.all();

    $scope.openChatRoom = function (roomId) {
      $state.go('tab.chat', {
        roomId: roomId
      });
    }
  });

