var later = require('../../index'),
    should = require('should');

describe('Later.array.prev', function() {

  it('should exist', function() {
    should.exist(later.array.prev);
  });

  it('should return the prev highest value', function() {
    var arr = [1,2,4,5],
        cur = 3,
        zeroVal = 5,
        expected = 2,
        actual = later.array.prev(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the prev highest value with array size of 1', function() {
    var arr = [1],
        cur = 3,
        zeroVal = 5,
        expected = 1,
        actual = later.array.prev(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the prev highest value with array size of 1 with zero value', function() {
    var arr = [0],
        cur = 10,
        zeroVal = 5,
        expected = 5,
        actual = later.array.prev(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the prev highest value which might be the last value', function() {
    var arr = [1,2,3,4,5],
        cur = 6,
        zeroVal = 5,
        expected = 5,
        actual = later.array.prev(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the prev highest value, wrapping if needed', function() {
    var arr = [1,2,3,4,5],
        cur = 0,
        zeroVal = 0,
        expected = 5,
        actual = later.array.prev(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the prev highest value, which might be zero value', function() {
    var arr = [2,3,4,5,0],
        cur = 1,
        zeroVal = 10,
        expected = 10,
        actual = later.array.prev(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return current value when it is in the list', function() {
    var arr = [1,2,4,5,0],
        cur = 4,
        zeroVal = 10,
        expected = 4,
        actual = later.array.prev(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

  it('should return the prev highest value when cur is greater than last value', function() {
    var arr = [1,2,4,5,0],
        cur = 12,
        zeroVal = 10,
        expected = 10,
        actual = later.array.prev(cur, arr, zeroVal);

    actual.should.eql(expected);
  });

});