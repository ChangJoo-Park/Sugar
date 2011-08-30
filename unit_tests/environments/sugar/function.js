test('Function', function () {

  var bound,obj,result;

  obj = { foo: 'bar' };

  bound = (function(num, bool, str, fourth, fifth) {
    equal(this === obj, true, 'Function#bind | Bound object is strictly equal');
    equal(num, 1, 'Function#bind | first parameter');
    equal(bool, true, 'Function#bind | second parameter', { mootools: undefined });
    equal(str, 'wasabi', 'Function#bind | third parameter', { mootools: undefined });
    equal(fourth, 'fourth', 'Function#bind | fourth parameter', { mootools: undefined });
    equal(fifth, 'fifth', 'Function#bind | fifth parameter', { mootools: undefined });
    return 'howdy';
  }).bind(obj, 1, true, 'wasabi');

  result = bound('fourth','fifth');
  equal(result, 'howdy', 'Function#bind | result is correctly returned');

  (function(first) {
    equal(Array.prototype.slice.call(arguments), [], 'Function#bind | arguments array is empty');
    equal(first, undefined, 'Function#bind | first argument is undefined');
  }).bind('foo')();

  bound = (function(num, bool, str) {}).bind('wasabi', 'moo')();


  // Prototype's delay function takes the value in seconds, so 20 makes the tests
  // take at least 20 seconds to finish!
  var delayTime = environment === 'prototype' ? 0.02 : 20;

  (function(){
    var fn, ref;
    fn = function(one, two) {
      equal(one, 'one', 'Function#delay | first parameter', { mootools: 'two' });
      equal(two, 'two', 'Function#delay | second parameter', { mootools: undefined });
    };
    ref = fn.delay(delayTime, 'one', 'two');
    equal(ref, fn, 'Function#delay | returns the function', { mootools: 'number' });
  })();

  (function(){
    var fn, ref, shouldBeFalse = false;
    fn = function() {
      shouldBeFalse = true;
    };
    fn.delay(delayTime / 4);
    ref = fn.cancel();
    equal(ref, fn, 'Function#cancel | returns a reference to the function');
    setTimeout(function() {
      equal(shouldBeFalse, false, 'Function#delay | cancel is working', { prototype: true, mootools: true });
    }, 60);
  })();

  // Properly unit testing Function#lazy will probably be a bitch...
  // Will have to rethink strategy here.
  (function() {
    var counter = 0;
    var expected = [['maybe','a',1],['baby','b',2],['you lazy','c',3]];
    var fn = (function(one, two) {
      equal([this, one, two], expected[counter], 'Function#lazy | scope and arguments are correct');
      counter++;
    }).lazy();
    fn.call('maybe', 'a', 1);
    fn.call('baby', 'b', 2);
    fn.call('you lazy', 'c', 3);
    equal(counter, 0, "Function#lazy | hasn't executed yet");
    setTimeout(function() {
      equal(counter, 3, 'Function#lazy | was executed by 10ms');
    }, 10);
  })();


  (function() {
    var counter = 0;
    var fn = (function() { counter++; }).lazy();
    fn();
    fn();
    fn.cancel();
    setTimeout(function() {
      equal(counter, 0, 'Function#lazy | lazy functions can also be canceled');
    }, 10);
  })();





  // Debounce

  // Giving this it's own scope + a timeout here as it seems to make this
  // temperamental test happier to run after other execution (GC?) has finished.

  setTimeout(function(){
    var counter = 0;
    var expected = [['leia', 4],['han solo', 6]];
    var debounced = (function(one){
      equal([this, one], expected[counter], 'Function#debounce | scope and arguments are correct');
      counter++;
    }).debounce(50);

    debounced.call('3p0', 1);
    debounced.call('r2d2', 2);
    debounced.call('chewie', 3);

    setTimeout(function() {
      debounced.call('leia', 4);
    }, 10);

    setTimeout(function() {
      debounced.call('luke', 5);
      debounced.call('han solo', 6);
    }, 100);


    setTimeout(function() {
      equal(counter, 2, 'Function#debounce | counter is correct');
    }, 200);
  }, 1);





});

