
'use strict';

/**********************************************************************
 * Angular Application
 **********************************************************************/
var app = angular.module('app', ['ngResource', 'ngRoute','ngCookies', 'ui.bootstrap'])
.config(function($routeProvider, $locationProvider, $httpProvider) {
	
	//================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
    	  
    	  //console.log('user '+user.username);
        // Authenticated
        if (user !== '0'){ 
          /*$timeout(deferred.resolve, 0);*/
          deferred.resolve();
          $rootScope.username=user.username;
          $rootScope.user_id=user.id;
        // Not Authenticated
      }else {
         // $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
          $location.url('/login');
        }
      });

      return deferred.promise;
    };
    //================================================
    
    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });
    //================================================

    

    //================================================
    // Define all the routes
    //================================================

    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        resolve: {//check the user's login status
          loggedin: checkLoggedin
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      
       .when('/rent', {
        templateUrl: 'views/rent.html',
        controller: 'RentCtrl',
        resolve: {////check the user's login status
            loggedin: checkLoggedin
          }
      })
      
        .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl',
        resolve: {////check the user's login status
            loggedin: checkLoggedin
          }
      })
      
       .when('/payment', {
        templateUrl: 'views/payment.html',
        controller: 'PaymentCtrl',
        resolve: {////check the user's login status
            loggedin: checkLoggedin
          }
      })
      
       .when('/selectpayment', {
        templateUrl: 'views/selectpayment.html',
        controller: 'SelectpaymentCtrl',
        resolve: {////check the user's login status
            loggedin: checkLoggedin
          }
      })
       .when('/select/:id/:addnew', {//id is a tool_id
        templateUrl: 'views/select.html',
        controller: 'SelectCtrl',
        resolve: {////check the user's login status
            loggedin: checkLoggedin
          }
      })
      
       .when('/address/:id/:addednew', {
        templateUrl: 'views/address.html',
        controller: 'AddressCtrl',
        resolve: {////check the user's login status
            loggedin: checkLoggedin
          }
      })
      
      
       .when('/summary/:id', {//id is a tool id
        templateUrl: 'views/summary.html',
        controller: 'SummaryCtrl',
        resolve: {////check the user's login status
            loggedin: checkLoggedin
          }
      })
      
       .when('/logout', {
    	  templateUrl: '/views/main.html',
        controller: 'LogoutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    //================================================


  }) // end of config()
  .run(function($rootScope, $http){
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function(){
      $scope.message = 'Logged out.';
      $http.post('/logout');
    };
  });

/**********************************************************************
 * Login controller
 **********************************************************************/
app.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.login = function(){
    $http.post('/login', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
    	
      $rootScope.username=user.username;
      $location.url('/home');
    })
    .error(function(){
      // Error: authentication failed
    	$scope.errormsg = 'Authentication failed.';
      $location.url('/login');
    });
  };
});


/**********************************************************************
 * Logout controller
 **********************************************************************/
app.controller('LogoutCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.login = function(){
    $http.get('/logout', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
    	$rootScope.username='';
      $location.url('/');
    })
    .error(function(){
      // Error: authentication failed
    	$scope.errormsg = 'Authentication failed.';
      $location.url('/login');
    });
  };
});

/**********************************************************************
 * Signup controller
 **********************************************************************/
app.controller('SignupCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.signup = function(){
    $http.post('/signup', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
    	$scope.errormsg = 'Signup successful!';
      $location.url('/home');
    })
    .error(function(){
      // Error: authentication failed
    	$scope.errormsg = 'Signup failed.';
      $location.url('/signup');
    });
  };
});

/**********************************************************************
 * Rent controller
 **********************************************************************/
app.controller('RentCtrl', function($scope, $rootScope, $http, $location) {
	// This object will be filled by the form
	  $scope.tool = {};
	  $rootScope.selected_id='';
	
	  if($rootScope.tools == undefined){
	
      //populate the tools data
	   $http.post('/rent', {
	      id: $scope.tool.id,
	      type: $scope.tool.type,
	      name: $scope.tool.name,
	      description: $scope.tool.description,
	      price: $scope.tool.price
	    })
	    .success(function(tool){
	    	//this tools are used in the rent.html to show the tool list.
	    	$rootScope.tools = tool;
	    	//console.log('post $rootScope.tools '+ $rootScope.tools  );
	    })
	    .error(function(){
	      // Error: authentication failed
	    	$scope.errormsg = 'Error occured.';
	      $location.url('/home');
	    });
		  
	  }//  if($rootScope.tools == undefined){
	   	
	  
	  //select button function

		$scope.select = function(id){
			 //$scope.formData.tool_id = id;
			//add the selected tool id in the url
			 $location.path('/select/' + id+'/0')
		};//$scope.select = function(id){
});


/**********************************************************************
 * Home controller
 **********************************************************************/
app.controller('HomeCtrl', function($scope,$rootScope, $http,$location) {
	 
	 $rootScope.tool_id=undefined;
	 $rootScope.user_id=undefined;
	 $rootScope.customer_id=undefined;
	 $rootScope.payment_id=undefined;
	
	//redirect to the rent page
	$scope.rent = function(){
		$location.url('/rent');
	  
	}//
	
	$scope.history = function(){
		$location.url('/history');
	  
	}//
	
	$scope.payment = function(){
		$location.url('/payment');
	  
	}//
	
});

/**********************************************************************
 * Select controller
 **********************************************************************/
app.controller('SelectCtrl', function($scope, $rootScope, $http, $location,$routeParams, $timeout) {
	  //get the selected tool.id
	 $scope.tool_id = $routeParams.id;
	 $scope.user_id = $rootScope.user_id;
	 $scope.addnew = $routeParams.addnew;
	 
	 
	 $scope.formData = {};
	 
	  $scope.formData.tool_id = $scope.tool_id; 
	  $scope.formData.user_id = $rootScope.user_id;
	 
 
	// console.log('addnew '+$scope.addnew);
	  
	  //submit button is clicked. save new customer data into the customers table.
	 $scope.formSubmit = function(isValid){
		//console.log('form '+$scope.formData.first_name);
		 if (isValid) {
			 
			//console.log('post $rootScope.tools '+ $rootScope.tools  );
		  
	        $http.post('/select', $scope.formData).success(function(data) {
	    	  
	    	console.log('Data posted successfully '+dumpObject(data));
	    	
	    	//setup the customer_id  and tool_id here
	    	$rootScope.customer_id = data.customer_id;
	    	$rootScope.tool_id = $routeParams.id
	    	
	    	if($rootScope.payment_id==undefined){
	    		
	    		
		  		//redirect to address page.
			    $location.url('/address/'+$rootScope.tool_id +'/1');
	    	}
	    	else{
	    		//customer info, tool id, payment id are here. now insert the data into the rented_tools table.
	    		 $http.post('/rented',{
	   	  	      tool_id: $rootScope.tool_id,
	   		      user_id: $rootScope.user_id,
	   		      customer_id:$rootScope.customer_id,
	   		      payment_id: $rootScope.payment_id
	   		    
	   		    }).success(function(data) {
	   	    	  
	   	    	//console.log('Data posted successfully to rented_tools '+data.toSource());
	   	    	
	   	    	//redirect to summary page.
	   	    	$location.url('/summary/'+data.rented_id );
	   	      })
	   	      .error(function(){
	   		     //error occured
	   		    	$scope.errormsg = 'Error occured.';
	   		    	$location.url('/payment');
	   		    });
	    		
	    		
	    	}//else
	    	
	      })
	      .error(function(){
		     //error occured
		    	$scope.errormsg = 'Error occured.';
		      $location.url('/select');
		    });
		 }// if ($scope.userForm.$valid) {
		
	 }// $scope.formSubmit = function(){
	
		  //if the user_id exists in the customers table in database, populate the customer data in the form
		//populate the selected tool data here
	 if($scope.addnew==0){////addnew(address) is not selected.
	
		$http.get('/select',{params:{
				   		user_id: $scope.user_id 
			  		}
				   })
				    .success(function(customer_data){
				    	
				    	var addressArray = [];
				    	
				    	var index=0;
				    	Object.keys(customer_data).forEach(function (key) {
				    	
				    		addressArray[index++]=[customer_data[key]];
				    		
				    		//console.log('customer selected '+	$scope.index.toSource());
				    	});
				    	
				    	$rootScope.addresses = addressArray;
				    	//console.log('customer selected '+	$scope.addresses .toSource());
				    	
				    	//if there are exisitng address for this user, redirect to address page and show the addresses.
				    	if(customer_data !='')
				    	$location.url('/address/'+ $scope.tool_id+'/0');
				    	
				    	
				    	
				    })
				    .error(function(){
				      //error
				    	$scope.errormsg = 'Error occured.';
				      $location.url('/select');
				    });
			  
	 }//if($scope.addnew==0){
	 else if($scope.addnew==1){
		 $location.url('/select/'+$scope.tool_id+'/1' );////1 is for addnew (address)
		 
	 }// else if($scope.addnew==1){
	 
	 //cancel button is clicked.
	 $scope.cancel = function(){
		 
		 $location.url('/address/'+ $scope.tool_id+'/0');
	 }// $scope.cancel = function(){
});


/**********************************************************************
 * Address controller
 **********************************************************************/
app.controller('AddressCtrl', function($scope, $rootScope, $http, $location,$routeParams, $uibModal,$timeout) {
	 $scope.tool_id = $routeParams.id;
	 $scope.addednew = $routeParams.addednew;
	//when refresh the page, it'll loose the addresses data value. 
	//check if $rootScope.addresses from select page exists.  If not, populate it again here.
	
	 //check if a new address is created in the select page. if so, output the success message.
	 if($scope.addednew=='1'){
		
		//insert a new payment method successfully.  Show the success message for 10 sec.
		    $scope.successTextAlert = "Your new address has been added";
		    $scope.showSuccessAlert = true;
		    $scope.showRecords = true;
		   
	  		$timeout(function(){
	  		   $scope.showSuccessAlert=false;
	  		}, 10000);
	}// if($scope.addednew=='1'){
	
	 //get all addresses for this user
	 getAlladdresses();
	
	 function getAlladdresses(){ 	
		$http.get('/address',{params:{
			user_id: $rootScope.user_id
		   		
				}
		   })
		    .success(function(data){
		    	console.log('customer_getdata '+data.status);
		    	
		    	if(data.status==0){
		    	
			    	var customer_data = data.rows;
			    	var addressArray = [];
			    	
			    	var index=0;
			    	Object.keys(customer_data).forEach(function (key) {
			    	
			    		addressArray[index++]=[customer_data[key]];
			    		
			    		//console.log('customer selected '+	$scope.index.toSource());
			    	});
			    	
			    	$rootScope.addresses = addressArray;
			    	console.log('customer selected '+	dumpObject(customer_data));
			    	
			    	//if there are exisitng address for this user, redirect to address page and show the addresses.
			    	if(customer_data !='')
			    		 $location.url('/address/'+ $scope.tool_id+'/0');
		    	
		    	}//if(data.status==0){
		    	else{
		    		 $scope.showErrorAlert = true;
		    		$scope.errormsg = 'Error - Unable to populate addresses.';
		    	}
		    })
		    .error(function(){
		      //error
		    	$scope.errormsg = 'Error occured.';
		      $location.url('/address/'+ $scope.tool_id+'/0');
		    });
		
	}//	function getAlladdresses(){ 
	
		//if there are exisitng addresses for this user and the user select one of the addresses, the Use button is clicked.
		//this is the use button logic.
		$scope.selectAddress = function(customer_id){
			
			$rootScope.customer_id = customer_id;
			$rootScope.tool_id = $scope.tool_id
			
			//if payment is not selected, go to the payment page.
			if($rootScope.payment_id==undefined)
	    	//redirect to summary page.
	    	$location.url('/payment');
			
			else{
				//insert all data into the rented_tool table here
				$http.post('/rented',{
		  	  	      tool_id: $rootScope.tool_id,
		  		      user_id: $rootScope.user_id,
		  		      customer_id:$rootScope.customer_id,
		  		      payment_id: $rootScope.payment_id
		  		    
		  		    }).success(function(rented_tool) {
		  	    	  
		  	    	//console.log('Data posted successfully to rented_tools '+data.toSource());
		  	    	
		  	    	//redirect to summary page.
		  	    	$location.url('/summary/'+rented_tool.rented_id );
		  	      })
		  	      .error(function(){
		  		     //error occured
		  		    	$scope.errormsg = 'Error occured.';
		  		    	$location.url('/payment');
		  		    });
				
			}//else
			
			
		}//$scope.selectAddress = function(customer_id){

		//add new address button
		$scope.addNewAddress = function(){
			 $location.url('/select/'+$scope.tool_id+'/1' );//1 is for addnew (address)
			
		};
	
		 //open the modal form///////////////////////////////
	    $scope.modalConfirm = function (customer_id ) {
	    	$rootScope.showModal=true;
	    	$rootScope.removeCustomer_id=customer_id;
	    	
	    	 var modalInstance = $uibModal.open({
	             // size: size,
	              animation: false,
	              backdrop: 'static',
	              templateUrl : 'templates/modal.html',
	              controller: 'AddressModalController',            
	          
	          });
	    	  
	    	  //this function gets excuted after Yes button is clicked and delete the selected contact id.
	    	  //show a new list of contact
	         modalInstance.result.then(function (response) {
	        	 // console.log('modalInstance  '+response);
	        	 $rootScope.showModal=false;
	        	//get all addresses for this user
				 getAlladdresses();
		  		  
	          }, function () {
	        	  //if a user cancel to remove the selected contact, log it.
	              console.log('Modal dismissed at: ' + new Date());
	          });
	    	 
	    };//  $scope.modalConfirm = function (payment_id ) { 

});




/**********************************************************************
 * Summary controller
 **********************************************************************/
app.controller('SummaryCtrl', function($scope, $rootScope, $http, $location,$routeParams) {
	console.log('rented tool id '+$routeParams.id);
	/*var jsonData = JSON.stringify({
	    params: {
	        id: $routeParams.id
	      
	    }
	});*/
	//populate the selected tool data here
	   $http.get('/summary',{params:{
		   		id: $routeParams.id //rented_tool id
	  		}
		   })
		    .success(function(selected_info){
		        
		    	//assign the rootscope items for angularjs ng-repeat
		    	$rootScope.items=selected_info;
		    	
		    	//calculate the return date here
		    	var today = new Date();
		    	var numberOfDaysToAdd = 7;
		    	today.setDate(today.getDate() + numberOfDaysToAdd); 
		    	
		    	var dd = today.getDate();
		    	var mm = today.getMonth() + 1;
		    	var y = today.getFullYear();

		    	var returnDate = mm+'/'+dd+'/'+y;
		    	$scope.returnDate = returnDate;
		    	dumpObject(selected_info);
		    	console.log('tool selected '+selected_info.toSource());
		    })
		    .error(function(){
		      //error
		    	$scope.errormsg = 'Error occured.';
		      $location.url('/summary');
		    });
	
});



/**********************************************************************
 * History controller
 **********************************************************************/
app.controller('HistoryCtrl', function($scope, $rootScope, $http, $location,$routeParams) {
	
	$scope.tools = '';
	$scope.message='';
	//populate the selected tool data here
	   $http.get('/history',{params:{
		   		user_id:  $rootScope.user_id
	  		}
		   })
		    .success(function(selected_info){
		    	
		    	//if there are rows came back from the rented_tools table, assign it to the scope.tools.
		    	if(selected_info.rows != null){
		    	$scope.tools = selected_info.rows;
		        
		    	}else { 
		        	$scope.message = "You have no rental history";
		        }//else
		        	
		    	console.log('tool all selected '+dumpObject(selected_info));
		    })
		    .error(function(){
		      //error
		    
		    	$scope.message = 'Error occured.';
		      $location.url('/history');
		    });
	
});


/**********************************************************************
 * Payment controller
 **********************************************************************/

app.controller('PaymentCtrl'
    ,function($scope, $rootScope, $http, $location,$routeParams,$uibModal,$locale, $timeout) {
	$scope.showRecords = false;
	$rootScope.showModal=false;
	$rootScope.successTextAlert = "";
	$rootScope.showSuccessAlert = false;
  
    
	//console.log('payments '+$scope.payments);
	$scope.ccinfo = {};
	
	$scope.currentYear = new Date().getFullYear()
    $scope.currentMonth = new Date().getMonth() + 1
    $scope.months = $locale.DATETIME_FORMATS.MONTH
    $scope.ccinfo = {type:undefined}
	
	//show all payments info here.
	getAllpayments();
	
	//submit button is clicked 
    $scope.save = function(ccinfo){
		
		//pass validations, insert the new payment data into the payments table.
      if ($scope.paymentForm.$valid){
        console.log(ccinfo) // valid data saving stuff here
        $scope.ccinfo = ccinfo;
        $scope.ccinfo.user_id = $rootScope.user_id;
        $http.post('/payment', $scope.ccinfo).success(function(paymentData) {
    	  
    	//console.log('Data posted successfully '+data.toSource());
    	console.log('$rootScope.tool_id '+$rootScope.tool_id+ ' $rootScope.customer_id '+$rootScope.customer_id)
    	//if tool_id, customer_id have been setup alreay, show the summary page.
    	if(($rootScope.tool_id!=undefined)&& ($rootScope.customer_id !=undefined)  ) {
    		
    		$http.post('/rented',{
  	  	      tool_id: $rootScope.tool_id,
  		      user_id: $rootScope.user_id,
  		      customer_id:$rootScope.customer_id,
  		      payment_id: paymentData.payment_id
  		    
  		    }).success(function(rented_tool) {
  	    	  
  	    	//console.log('Data posted successfully to rented_tools '+data.toSource());
  		      //insert a new payment method successfully.  Show the success message for 10 sec.
  		       $scope.successTextAlert = "Your new payment method is added";
  		       $scope.showSuccessAlert = true;
  		       $scope.showRecords = true;
  		     
  		   
	  		   $timeout(function(){
	  			 $scope.showSuccessAlert=false;
	  		   }, 10000);
	  		  
	  		   //show all payments info here.
	  		   getAllpayments();
	  		  
  	      })
  	      .error(function(){
  		     //error occured
  		    	$scope.errormsg = 'Error occured.';
  		    	$location.url('/payment');
  		    });
    		
    	}else{
    		//if a tool is not selected, redirect to tool page
    		if($rootScope.tool_id==undefined){ 
    			
    			 //insert a new payment method successfully.  Show the success message for 10 sec.
   		       $scope.successTextAlert = "Your new payment method has been added";
   		       $scope.showSuccessAlert = true;
   		       $scope.showRecords = true;
   		     
   		       
 	  		   $timeout(function(){
 	  			 $scope.showSuccessAlert=false;
 	  		   }, 10000);
 	  		  
 	  		//show all payments info here.
 	  		   getAllpayments();
 	  		   
    		 }else if($rootScope.customer_id==undefined)
    			$location.url('/address/'+$rootScope.tool_id+'/0');
    	}//else
    	
    	
      })
      .error(function(){
	     //error occured
	    	$scope.errormsg = 'Error occured.';
	      //$location.url('/select');
	    });
    			
        
      }  //if ($scope.paymentForm.$valid){
  
	}//$scope.save = function(data){

	//show the payment form to input a new payment method
	$scope.addNewPayment = function(){
		
		$scope.showRecords = false;
		
		
	}//$scope.addNewPayment = function(){
	
	//select this payment id
	$scope.selectPayment = function(payment_id){
			
		//console.log('payment_id '+payment_id);
		//if there are selected tool id and customer id, then insert the info into the rented_tool table and show the summary.
		console.log('$rootScope.tool_id '+$rootScope.tool_id+ ' $rootScope.customer_id '+$rootScope.customer_id)
		if(($rootScope.tool_id!=undefined)&& ($rootScope.customer_id !=undefined)  ) {
	        $http.post('/rented',{
	  	      tool_id: $rootScope.tool_id,
		      user_id: $rootScope.user_id,
		      customer_id:$rootScope.customer_id,
		      payment_id: payment_id
		    
		    }).success(function(data) {
	    	  
	    	//console.log('Data posted successfully to rented_tools '+data.toSource());
	    	
	    	//redirect to summary page.
	    	$location.url('/summary/'+data.rented_id );
	      })
	      .error(function(){
		     //error occured
		    	$scope.errormsg = 'Error occured.';
		    	$location.url('/payment');
		    });
		}//if(($rootScope.tool_id!='')&& ($rootScope.customer_id !='')  ) {
		else{
			
			//set the payment_id and redirect to rental tool page
			$rootScope.payment_id = payment_id;
			$location.url('/rent');
		}//else
		
	}//$scope.selectPayment = function(payment_id){

	  //open the modal form///////////////////////////////
    $scope.modalConfirm = function (payment_id ) {
    	$rootScope.showModal=true;
    	$rootScope.removePayment_id=payment_id;
    	
    	 var modalInstance = $uibModal.open({
             // size: size,
              animation: false,
              backdrop: 'static',
              templateUrl : 'templates/modal.html',
              controller: 'PaymentModalController',            
          
          });
    	  
    	  //this function gets excuted after Yes button is clicked and delete the selected contact id.
    	  //show a new list of contact
         modalInstance.result.then(function (response) {
        	 // console.log('modalInstance  '+response);
        	 $rootScope.showModal=false;
        	 //show all payments info here.
	  		   getAllpayments();
        	
          }, function () {
        	  //if a user cancel to remove the selected contact, log it.
              console.log('Modal dismissed at: ' + new Date());
          });
    	 
    };//  $scope.modalConfirm = function (payment_id ) { 

	
	//get all payments record for this user.
	//if(($scope.payments == undefined)||  ($scope.payments == '') ){
	function getAllpayments(){ 
		$http.get('/payment',{params:{
	   		user_id: $rootScope.user_id
	   		
			}
	   })
	    .success(function(payment_data){
	    	
	    	//firefox way to show the object
	    	//console.log('payment selected '+	payment_data.toSource());
	    	
	    	//chrome way to show the object
	    	//console.dir(payment_data);
	    	
	    	//loop thru all payments data
	    	var paymentArray = [];
	    	
	    	var index=0;
	    	Object.keys(payment_data).forEach(function (key) {
	    		
	    		//var number = crypto.decrypt('4669963c6d6a4c4ebbbf5da824f025e9c83fba');
	    		//payment_data[key.number]=number;
	    		
	    		paymentArray[index++]=[payment_data[key]];
	    		
	    		//console.log(' payment array '+[payment_data[key]]);
	    	});
	    	
	    	if(paymentArray !=''){
	    		
	    		$scope.payments = paymentArray;
		    	//set the flag to 1 if there are any exisitning payments record
		    	$scope.showRecords = true;
		    	$scope.message = 'Do you want to use the existing payment method below?';
		    
	    	}else{
	    		
	    		$scope.showRecords = true;
		    	$scope.message = "No payment methods has been added.";
	    	}//else
	    	
	    
	    })
	    .error(function(){
	      //error
	    	$scope.errormsg = 'Error occured.';
	       //$location.url('/address/'+ $scope.tool_id);
	    });
	 } //function getAllpayments(){  

	
	
});


//credit card validations here
app.directive
  ( 'creditCardType'
  , function(){
      var directive =
        { require: 'ngModel'
        , link: function(scope, elm, attrs, ctrl){
            ctrl.$parsers.unshift(function(value){
              scope.ccinfo.type =
                (/^5[1-5]/.test(value)) ? "mastercard"
                : (/^4/.test(value)) ? "visa"
                : (/^3[47]/.test(value)) ? 'amex'
                : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'discover'
                : undefined
              ctrl.$setValidity('invalid',!!scope.ccinfo.type)
              return value
            })
          }
        }
      return directive;
      }
);

app.directive
  ( 'cardExpiration'
  , function(){
      var directive =
        { require: 'ngModel'
        , link: function(scope, elm, attrs, ctrl){
            scope.$watch('[ccinfo.month,ccinfo.year]',function(value){
              ctrl.$setValidity('invalid',true)
              if ( scope.ccinfo.year == scope.currentYear
                   && scope.ccinfo.month <= scope.currentMonth
                 ) {
                ctrl.$setValidity('invalid',false)
              }
              return value;
            },true)
          }
        }
      return directive;
      }
);

app.filter
  ( 'range'
  , function() {
      var filter = 
        function(arr, lower, upper) {
          for (var i = lower; i <= upper; i++) arr.push(i)
          return arr;
        }
      return filter;
    }
);


////Modal controller logic for a paymet deletion///////////////////////////

app.controller('PaymentModalController',
		 function ( $scope, $rootScope, $http, $uibModalInstance,$routeParams,$timeout) {
		  	
			$scope.showErrorAlert=false;	
	   
		  //selected payment_id to delete
		  var payment_id = $rootScope.removePayment_id;
			
		  //populate the selected payment row from the payments table.
		  $http.get('/selectedpayment/' + payment_id, {params: {id: payment_id}
			
			}).success(function(data){
				
				//successfully delete the row in the database. 
				if(data.status==0){
					
					//use this removeItem to output the selected payment data in the modal
					$scope.removeItem = data.row[0];
		  		   
				} // if(data.status==0){
				else{
					
					$scope.ModalErrormsg =  "Error occured. Please press No button.";
					$scope.showModalErrormsg=true;
				}
		  		  
			}).
			error(function(){
				$scope.ModalErrormsg = "Error occured. Please press No button.";
				$scope.showModalErrormsg=true;
			});
	    	
		  
		    $scope.headerTitle = 'Remove Payment Method';
		    $scope.messag= 'Are you sure to remove?';
		    
		    //yes button is clicked. now delete the selected contact id
		    $scope.remove = function () {
		   
		    		
				$http.delete('/payment/' + payment_id, {params: {id: payment_id}
				
				}).success(function(data){
					
					//console.log('payment deletion success '+data.message);
					//successfully delete the row in the database. 
					if(data.status==0){
						$rootScope.successTextAlert = "Selected payment method is deleted";
						$rootScope.showSuccessAlert = true;
						
						$timeout(function(){
							$rootScope.showSuccessAlert = false;
						}, 10000);
						
						//close the modal box
						 $uibModalInstance.close(payment_id);  
			  		   
					  } // if(data.status==0){
					else{
						
						$scope.ModalErrormsg =  "Error occured. Please press No button.";
						$scope.showModalErrormsg=true;
					   
					}//else
					
			  		 
				}).
				error(function(){
					$scope.ModalErrormsg =  "Error occured. Please press No button.";
					$scope.showModalErrormsg=true;
				});
		    	
		    
		    };//     $scope.remove = function () {

		    $scope.cancel = function () {
		    	 $rootScope.showModal=false;
		    	$uibModalInstance.dismiss('cancel');
		    };
		}); 

/*
 *modal controller for address deletion
 * 
 */

app.controller('AddressModalController',
		function ( $scope, $rootScope, $http, $uibModalInstance,$routeParams,$timeout) {
				  	
		$scope.showErrorAlert=false;	
			   
	   //selected payment_id to delete
		var customer_id =$rootScope.removeCustomer_id;
					
		//populate the selected payment row from the payments table.
		$http.get('/selectedaddress/' + customer_id, {params: {id: customer_id}
					
		}).success(function(data){
						
			//successfully delete the row in the database. 
			if(data.status==0){
							
				//use this removeItem to output the selected payment data in the modal
				$scope.removeItem = data.row[0];
				  		   
			} // if(data.status==0){
			else{
							
				$scope.ModalErrormsg =  "Error occured. Please press No button.";
				$scope.showModalErrormsg=true;
			}
				  		  
		}).
		error(function(){
				$scope.ModalErrormsg = "Error occured. Please press No button.";
				$scope.showModalErrormsg=true;
		});
			    	
				  
	    $scope.headerTitle = 'Remove Payment Method';
	    $scope.messag= 'Are you sure to remove?';
				    
	    //yes button is clicked. now delete the selected contact id
	   $scope.remove = function () {
				   
				    		
		$http.delete('/address/' + customer_id, {params: {id: customer_id}
						
		}).success(function(data){
							
			//console.log('payment deletion success '+data.message);
			//successfully delete the row in the database. 
			if(data.status==0){
				$rootScope.successTextAlert = "Selected address is deleted";
				$rootScope.showSuccessAlert = true;
								
				$timeout(function(){
					$rootScope.showSuccessAlert = false;
				}, 10000);
								
				//close the modal box
				 $uibModalInstance.close(customer_id);  
					  		   
			 } // if(data.status==0){
			else{
								
				$scope.ModalErrormsg =  "Error occured. Please press No button.";
				$scope.showModalErrormsg=true;
							   
			}//else
							
					  		 
			}).
			error(function(){
				$scope.ModalErrormsg =  "Error occured. Please press No button.";
				$scope.showModalErrormsg=true;
			});
				    	
				    
		 };//     $scope.remove = function () {

		$scope.cancel = function () {
			 $rootScope.showModal=false;
			 $uibModalInstance.dismiss('cancel');
		};
}); 

/**
 * chome way to output an object
 * 
 * @param obj
 */
function dumpObject (obj) {
    var output, property;
    for (property in obj) {
    	
        output += property + ': ' + obj[property] + '; ';
    }
    console.log(' dumpObject '+output);
}
