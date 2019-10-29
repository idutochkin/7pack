'use strict';

/**
 * @ngdoc service
 * @name erp7App.charts
 * @description
 * # charts
 * Service in the erp7App.
 */

angular.module('erp7App')
  .service('charts', function () {

    this.drawLeftChart = function (ctx, canv, macroelements) {
      var sum = macroelements.Angliavandeniai + macroelements.Baltymai + macroelements.Riebalai;
      var angl = sum > 0 ? macroelements.Angliavandeniai * 100 / sum : 33;
      var balt = sum > 0 ? macroelements.Baltymai * 100 / sum : 33;
      var rieb = sum > 0 ? macroelements.Riebalai * 100 / sum : 34;

      ctx.fillStyle = "#eee44a";
      ctx.fillRect(0, 0, canv.width * (rieb / 100), canv.height);
      var tmpX = canv.width * (rieb / 100);

      ctx.fillStyle = "#b87b00";
      ctx.fillRect(tmpX, 0, canv.width * (angl / 100), canv.height);
      tmpX = tmpX + canv.width * (angl / 100);

      ctx.fillStyle = "#016fde";
      ctx.fillRect(tmpX, 0, canv.width * (balt / 100), canv.height);

      ctx.lineWidth = 2;
      ctx.moveTo(0, 1);
      ctx.lineTo(canv.width, 1);
      ctx.stroke();
      ctx.moveTo(1, 1);
      ctx.lineTo(1, 1 + canv.height * 0.7);
      ctx.stroke();
      ctx.moveTo(canv.width * 0.15, 1);
      ctx.lineTo(canv.width * 0.15, 1 + canv.height * 0.7);
      ctx.stroke();
      ctx.moveTo(canv.width * 0.75, 1);
      ctx.lineTo(canv.width * 0.75, 1 + canv.height * 0.7);
      ctx.stroke();
      ctx.moveTo(canv.width - 1, 1);
      ctx.lineTo(canv.width - 1, 1 + canv.height * 0.7);
      ctx.stroke();
    };

    this.drawRightChart = function (ctx, canv, ag) {
      var sum = ag.Augaline + ag.Gyvuline;
      var aug = sum > 0 ? ag.Augaline * 100 / sum : 50;
      var gyv = sum > 0 ? ag.Gyvuline * 100 / sum : 50;

      ctx.fillStyle = "#87c350";
      ctx.fillRect(0, 0, canv.width * (aug / 100), canv.height);
      var tmpX = tmpX = canv.width * (aug / 100);

      ctx.fillStyle = "#eb3e00";
      ctx.fillRect(tmpX, 0, canv.width * (gyv / 100), canv.height);
      tmpX = tmpX + canv.width * (gyv / 100);


      ctx.lineWidth = 2;
      ctx.moveTo(0, 1);
      ctx.lineTo(canv.width, 1);
      ctx.stroke();
      ctx.moveTo(1, 1);
      ctx.lineTo(1, 1 + canv.height * 0.7);
      ctx.stroke();
      ctx.moveTo(canv.width * 0.9, 1);
      ctx.lineTo(canv.width * 0.9, 1 + canv.height * 0.7);
      ctx.stroke();
      ctx.moveTo(canv.width - 1, 1);
      ctx.lineTo(canv.width - 1, 1 + canv.height * 0.7);
      ctx.stroke();
    }
  });
