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
      context.clearRect(start.x - 15, start.y - 15, 30, 30);
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

  this.drawImage = (src) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      context.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height)
    }
  }

  this.overPercent = () => {
    const imageData = context.getImageData(0, 0, width, height).data;
    const len = imageData.length;
    let transparentPix = 0;
    for (let i = 3; i < len; i += 4) {
        if (imageData[i] === 0) {
            transparentPix++;
        }
    }
    return (4 * transparentPix)/len;
  }
}

function selectBottle (name) {
  $(`#${name} img:first-child`).show()

  $(".canvas_container").css("background-image", `url(https://selfwork.oss-cn-shanghai.aliyuncs.com/final/${name}-${parseInt(Math.random()*3) + 1}.jpg)`)
  var $backCanvas = new Canvas2D($("#back"));

  $backCanvas.drawImage(`https://selfwork.oss-cn-shanghai.aliyuncs.com/wipe/wipe-${name}.jpg`)
  // $backCanvas.drawImage(`img/${name}-cover.jpg`)

  var isStart = false;
  var startp = {};
  var ps = [];

  $("#back").on('touchstart', function (event)
  {
    isStart = true;
    startp = $backCanvas.getCanvasPoint(event.originalEvent.targetTouches[0].pageX, event.originalEvent.targetTouches[0].pageY);
  }).on('touchmove', function (event) {
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
    if ($backCanvas.overPercent()) {
      $("#back").remove();
      $(".canvas_container").animate({
        height: '100vh',
        width: '100vw',
        'margin-left': 0,
        top: 0,
        left: 0
      }, () => {
        $(".canvas_container").css("background-color", "rgba(0,0,0,0.7)");
      })
      $(".canvas_container").addClass("container_full");
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
    $("#page3").css("visibility", "visible");
    $("#page3 .hand").animate({
      right: '40vw',
      top: '50vh'
    }, 800)
    setTimeout(() => $("#page3 .cover").fadeOut(), 800)
  }, 200)
}