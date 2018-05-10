var AMap = {
  LngLat: function (longtitude, latitude) {}
};

AMap.LngLat.prototype.distance = function () {
  return Math.floor(Math.random() * 1000) + 1000;
};
