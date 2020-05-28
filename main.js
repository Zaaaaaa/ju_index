function Canvas2D($canvas) {
  var context = $canvas[0].getContext("2d"),
      width = $canvas[0].width,
      height = $canvas[0].height,
      pageOffset = $canvas.offset();

  this.width = function ()
  {
      return width;
  }
  this.height = function ()
  {
      return height;
  }

  this.resetOffset = function ()
  {
      pageOffset = $canvas.offset();
  }

  $(window).resize(function ()
  {
      pageOffset = $canvas.offset();
  });

  this.getCanvasPoint = function (pageX, pageY)
  {
      return{
          x: pageX - pageOffset.left,
          y: pageY - pageOffset.top
      }
  }

  this.clearRect = function (start, end)
  {
      var x = start.x;
      var y = start.y;
      const radius = 12;
      for(let i=0; i<=radius; i=i+2){
          var calcWidth = radius - i;
          var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
          var posX = x - calcWidth;
          var posY = y - calcHeight;
          var widthX = 2 * calcWidth;
          var heightY = 2 * calcHeight;
          context.clearRect(posX, posY, widthX, heightY);
      }
      return this;
  };

  this.clear = function ()
  {
      context.clearRect(0, 0, width, height);
      return this;
  };

  this.drawLine = function (start, end)
  {
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();

      return this;
  };

  this.drawRect = function (start, end, isFill)
  {
      var w = end.x - start.x , h = end.y - start.y;
      if (isFill)
      {
          context.fillRect(start.x, start.y, w, h);
      }
      else
      {
          context.strokeRect(start.x, start.y, w, h);
      }
  };

  this.drawCircle = function (center, radius, fill)
  {
      context.beginPath();
      context.arc(center.x, center.y, radius, 0, Math.PI * 2, true);
      if (fill)
          context.fill();
      else
          context.stroke();
  };

  this.drawPoints = function (points)
  {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);

      for (var i = 1; i < points.length; i++)
      {
          context.lineTo(points[i].x, points[i].y);
      }
      context.stroke();
      return this;
  };

  this.drawText = function (text, point, fill)
  {
      var metrics = context.measureText(text);
      console.log(metrics);
      if (fill)
      {
          context.fillText(text, point.x, point.y);
      }
      else
      {
          context.strokeText(text, point.x, point.y);
      }
  };

  this.drawEllipse = function (center, end, fill)
  {
      var rx = Math.abs(end.x - center.x);
      var ry = Math.abs(end.y - center.y);

      var radius = Math.sqrt(rx * rx, ry * ry);

      context.save();
      context.translate(center.x, center.y);
      context.scale(rx / radius, ry / radius);
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2, true);
      context.closePath();
      if (!fill)
          context.stroke();
      else
          context.fill();

      context.restore();
  };

  this.penWidth = function (newWidth)
  {
      if (arguments.length)
      {
          context.lineWidth = newWidth;
          return this;
      }
      return context.lineWidth;
  };

  this.penColor = function (newColor)
  {
      if (arguments.length)
      {
          context.strokeStyle = newColor;
          context.fillStyle = newColor;
          return this;
      }

      return context.strokeStyle;
  };

  this.penOpacity = function (newOpacity)
  {
      if (arguments.length)
      {
          context.globalAlpha = newOpacity;
          return this;
      }
      return context.globalAlpha;
  };

  this.fontSize = function (fontSize)
  {
      if (arguments.length)
      {
          context.font = fontSize + "px Verdana, Geneva, sans-serif";
          return this;
      }

      return context.fontSize;
  }


  this.savePen = function ()
  {
      context.save();
      return this;
  };
  this.restorePen = function ()
  {
      context.restore();
      return this;
  };

  this.drawImage = (img) => {
    context.drawImage(img, 0, 0, 467, 799, 0, 0, width, height)
  }

  this.overPercent = (percent) => {
    const imageData = context.getImageData(0, 0, width, height).data;
    const len = imageData.length;
    let transparentPix = 0;
    for (let i = 3; i < len; i += 4) {
        if (imageData[i] === 0) {
            transparentPix++;
        }
    }
    return (4 * transparentPix)/len >= percent;
  }
}

function clickStart () {
  $('#page1 .button').hide();
  $('#page1 .button.after').show();
  $('#page2').show();
  setTimeout(() => {
    $('#page1').fadeOut();
    setTimeout(() => {
      $('#health').removeClass('flipper').animate({
        left: '0',
        top: '0',
      }, 'normal', 'swing');
      setTimeout(() => {
        $('#wealth').removeClass('flipper').animate({
          left: '54vw',
          top: '0',
        }, 'normal', 'swing');
        setTimeout(() => { 
          $('#career').removeClass('flipper').animate({
            left: '54vw',
            top: '54vh',
          }, 'normal', 'swing');
          setTimeout(() => {
            $('#study').removeClass('flipper').animate({
            left: '0',
            top: '54vh',
          }, 'normal', 'swing');
          }, 200);
        }, 200);
      }, 200);
    }, 400);
  }, 200);
}

function selectBottle (name) {
  $(`#${name} img:first-child`).show()

  $(".canvas_container .card").attr("src", `https://selfwork.oss-cn-shanghai.aliyuncs.com/final/${name}-${parseInt(Math.random()*3) + 1}.jpg`)
  var $backCanvas = new Canvas2D($("#back"));

  $backCanvas.drawImage($(`#${name} .cover`)[0])

  var isStart = false;
  var startp = {};
  var ps = [];

  $("#back").on('touchstart', function (event)
  {
    isStart = true;
    startp = $backCanvas.getCanvasPoint(event.originalEvent.targetTouches[0].pageX, event.originalEvent.targetTouches[0].pageY);
  }).on('touchmove', function (event) {
    event.preventDefault();
    if (!isStart) return;
     // console.log(event.clientX , event.clientY);、
     // console.log(event.pageX, event.pageY);
    var p = $backCanvas.getCanvasPoint(event.originalEvent.targetTouches[0].pageX, event.originalEvent.targetTouches[0].pageY);
    // var tmp = {};
    var k;
    //startp p
    if (p.x > startp.x)
    {
      k = (p.y - startp.y) / (p.x - startp.x);
      // k = Math.abs(k);
      // console.log(k);
      for (var i = startp.x; i < p.x; i += 5) {
        // tmp.x = i;
        // tmp.y = ;
        $backCanvas.clearRect({x: i, y: (startp.y + (i - startp.x) * k)}, {});
        // ps.push(tmp);
      }
    } else {
      k = (p.y - startp.y) / (p.x - startp.x);
      // k = Math.abs(k);
      for (var i = startp.x; i > p.x; i -= 5)
      {
        // tmp.x = i;
        // tmp.y = startp.y - ( startp.x - i ) * k;
        // ps.push(tmp);
        $backCanvas.clearRect({x: i, y: (startp.y + ( i - startp.x  ) * k)}, {});
      }
    }
    startp = p;
    // ps.push(p);
    // redraw(ps);
  }).on('touchend', function (event) {
    isStart = false;
    if ($backCanvas.overPercent(0.3)) {
      $("body").css("position", "");
      $("#back").remove();
      $(".canvas_container").addClass("container_full");
      $(".card").css({
        "position": "absolute",
        "width": "240px",
        "height": "420px",
      })
      if ($(document).height() / $(document).width() > 1.78) {
        $(".card").animate({
          width: '100vw',
          height: '178vw',
          top: 'calc((100vh - 178vw)/2)',
        });
      } else { 
        $(".card").animate({
          width: '56vh',
          height: '100vh',
        });
      }
    }
  });

  function redraw (ps) {
    for (var i = 0; i + 1 < ps.length; i++) {
      var start = ps[i];
//          var end = ps[i + 1];
      $backCanvas.clearRect(start, {});
    }
    startp = ps[ps.length - 1];
    ps = [];
  }

  setTimeout(() => {
    $("#page2").hide();
    $("#page3").css("visibility", "visible");
    setTimeout(() => {
      $("#page3 .cover").fadeOut();
    }, 1200)
  }, 200)
}

document.addEventListener("WeixinJSBridgeReady", function() {
  document.getElementById('ado').play();
}, false);
//解决微信不能播放音频
if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
  WeixinJSBridge.invoke('getNetworkType', {}, function(res) {
    audioa = document.getElementById("ado");
    //音频播放
    audioa.play();
  });
};

$(function() {
  if ($(document).height() / $(document).width() < 1.9) {
    $("#page1 .bg-img").css({
      width: '100vw',
      height: 'auto',
    })
  }
  setTimeout(() =>{
    $(".btn-before").fadeIn()
  }, 2000)

  var myAuto = document.getElementById('ado');
  myAuto.play()
})