describe('statsCtrl', function () {
  var $controller, $rootScope, $scope, mockSocket;
  var bg1, bg2;

  // Mock the Socket.IO service
  beforeEach(function () {
    mockSocket = {
      on: jasmine.createSpy('on').and.callFake(function (event, callback) {
        if (event === 'scores') {
          mockSocket.scoresCallback = callback;
        } else if (event === 'message') {
          mockSocket.messageCallback = callback;
        }
      }),
    };

    // Mock the DOM elements
    bg1 = document.createElement('div');
    bg2 = document.createElement('div');
    spyOn(document, 'getElementById').and.callFake(function (id) {
      if (id === 'background-stats-1') return bg1;
      if (id === 'background-stats-2') return bg2;
    });

    // Load the AngularJS module
    angular.module('catsvsdogs', []);
    module('catsvsdogs');
  });

  // Inject dependencies and create the controller
  beforeEach(inject(function (_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();

    $controller('statsCtrl', { $scope: $scope, socket: mockSocket });
  }));

  // Test case 1: Controller initialization
  it('should initialize with default values', function () {
    expect($scope.aPercent).toBe(50);
    expect($scope.bPercent).toBe(50);
    expect(bg1.style.width).toBe('');
    expect(bg2.style.width).toBe('');
  });

  // Test case 2: Handling socket 'scores' event
  it('should update percentages and DOM widths when scores are received', function () {
    var jsonData = JSON.stringify({ a: 40, b: 60 });
    mockSocket.scoresCallback(jsonData);

    expect($scope.aPercent).toBe(40);
    expect($scope.bPercent).toBe(60);
    expect($scope.total).toBe(100);
    expect(bg1.style.width).toBe('40%');
    expect(bg2.style.width).toBe('60%');
  });

  // Test case 3: Handle edge case of zero scores
  it('should set both percentages to 50 when scores are zero', function () {
    var jsonData = JSON.stringify({ a: 0, b: 0 });
    mockSocket.scoresCallback(jsonData);

    expect($scope.aPercent).toBe(50);
    expect($scope.bPercent).toBe(50);
    expect($scope.total).toBe(0);
    expect(bg1.style.width).toBe('50%');
    expect(bg2.style.width).toBe('50%');
  });

  // Test case 4: Socket 'message' event triggers initialization
  it('should call init function on receiving a socket "message" event', function () {
    spyOn(document.body.style, 'opacity', 'set');
    mockSocket.messageCallback();

    expect(document.body.style.opacity).toBe('1');
    expect(mockSocket.on).toHaveBeenCalledWith('scores', jasmine.any(Function));
  });

  // Test case 5: getPercentages function
  describe('getPercentages', function () {
    it('should calculate correct percentages', function () {
      var result = getPercentages(25, 75);
      expect(result.a).toBe(25);
      expect(result.b).toBe(75);
    });

    it('should handle zero total gracefully', function () {
      var result = getPercentages(0, 0);
      expect(result.a).toBe(50);
      expect(result.b).toBe(50);
    });

    it('should handle one side being zero', function () {
      var result = getPercentages(100, 0);
      expect(result.a).toBe(100);
      expect(result.b).toBe(0);
    });
  });
});
