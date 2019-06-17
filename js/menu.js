function Menu(selected){
    
    var self = this,
        HEIGHT = 50,
        WIDTH = 500,
        TEXT_GAP = 30,
        TOP = parseInt($('#menu').css('top')),
        canvas = document.getElementById('menu'),
        ctx = canvas.getContext('2d'),
        imgs = ['img/logo_black.svg'],
        whiteElements = $('.menu-white'),
        whitePlaces = [];
        
    this.getColourOffsets = function(){
        
        whitePlaces = [];
        
        whiteElements.each(function(){
            
            var $this = $(this),
                top = $this.offset().top;
            
            whitePlaces.push( [top, top + $this.height()] );
            
        });
        
        self.draw();
        
    }
    
    this.draw = function(){
        
        var splitY = false,
            st = $(document).scrollTop(),
            menuTop = st + TOP,
            menuBottom = menuTop + HEIGHT,
            blackTop = true;
        
        var start, end;
        
        for(var i = 0, len = whitePlaces.length; i < len; ++i){
            
            start = whitePlaces[i][0];
            end = whitePlaces[i][1];
            
            if(end < menuTop || start > menuBottom) continue;
            
            if(start < menuTop && end >= menuBottom){
                blackTop = false;
                break;
            }
            
            if(start >= menuTop && start < menuBottom){
                splitY = start - menuTop;
                break;
            }
            
            if(end > menuTop && end < menuBottom){
                if(i < len - 1 && end !== whitePlaces[i+1][0]){
                    splitY = end - menuTop;
                }
                blackTop = false;
                break;
            }
            
        }
        
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        
        ctx.fillStyle = 'black';
        
        var x = 67;
        ctx.drawImage(imgs[0], 0, 0, x, 39);
        x += TEXT_GAP;
        ctx.font = 'bold 18px Aileron';
        x += trackText(ctx, 'Shop', x, 23, 1);
        x += TEXT_GAP;
        x += trackText(ctx, 'Singles Club', x, 23, 1);
        x += TEXT_GAP;
        ctx.font = '18px Aileron';
        trackText(ctx, 'About', x, 23, 1);
        
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'white';
        
        if(splitY === false){
            if(!blackTop){
                //all white
                ctx.fillRect(0,0,WIDTH,HEIGHT);
            }
            //all black
        } else{
            if(blackTop){
                //black then white
                ctx.fillRect(0,splitY,WIDTH,HEIGHT);
            } else {
                //white then black
                ctx.fillRect(0,0,WIDTH,splitY);
            }
        }
        
        ctx.globalCompositeOperation = 'source-over';
            
    }
    
    
    new ImageLoader(imgs, function(){
        
        canvas.height = HEIGHT;
        canvas.width = WIDTH;
        ctx.textBaseline = 'alphabetic';
        
        self.getColourOffsets();
        
        $(window)
            .on('resize', self.getColourOffsets)
            .on('scroll', self.draw);
        
    });
    
    
    
}

function trackText(context, text, x, y, tracking){
    
    if(!tracking){
        context.fillText(text, x, y);
        return context.measureText(text).width;
    }
    
    var chars = text.split(""),
        offset = x;
    
    for(var i = 0, len = chars.length; i < len; ++i){
        
        context.fillText(chars[i], x, y);
        
        x += context.measureText(chars[i]).width + tracking;
        
    }
    
    return x - offset - tracking;
    
}