'use strict';

/**
 * @ngdoc function
 * @name erp7App.controller:StickerPrintingCtrl
 * @description
 * # StickerPrintingCtrl
 * Controller of the erp7App
 */
angular.module('erp7App')
    .controller('StickerPrintingCtrl', function (api, $scope, $stateParams) {
        $scope.loading = true;
        var init = function () {
            var parsed = JSON.parse($stateParams.date);
            console.log(parsed);
            var currentDate = parsed.date;
            var bestUntil = moment(currentDate).add(2, 'days');
            // console.log(bestUntil);
            bestUntil = moment(bestUntil).format("YYYY.M.DD");
            // console.log(bestUntil);
            $scope.bestUntil = bestUntil;
            api.report.sticker(
                parsed.day,
                parsed.data,
                function (err, res) {
                    if (err) {
                        return _err(err);
                    }
                    console.log(res);
                    $scope.stickers = res.data;
                    _.each($scope.stickers,
                        function (st) {
                            st.Angliavandeniai = _processNumber(st.Angliavandeniai);
                            st.Baltymai = _processNumber(st.Baltymai);
                            st.Riebalai = _processNumber(st.Riebalai);
                            st.Kcal = _processNumber(st.Kcal);
                        }
                    )
                    $scope.loading = false;
                    setTimeout(function () {
                        window.print();
                    }, 3500)

                    // window.close();
                }
            )
        }
        init();

        var _processNumber = function (number) {
            var fixed = number.toFixed(2);
            return Number(fixed);
        }

        var _err = function (err) {
            console.error(err);
            $scope.error = true;
        }
    });
