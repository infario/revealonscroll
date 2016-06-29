# revealonscroll
An easy to use plugin to add nice reveal animation effects on your page elements on scroll

## Usage

1.  call **ros.animate.css** in your header.

    <pre><link href="css/ros.animate.css" /></pre>

    You may also use any animate.css version. In our file we have modified translate3d value to 20px to make it look smoother when you scroll

2.  call **jquery.ros.js** in your footer after jquery

    <pre><script src="js/jquery.ros.js"></script></pre>

3.  intiate ros on document ready or window load

    <pre>ros.init();</pre>

4.  Add `data-ros="fadeIn"`attribute with your desired animate.css effect to your html element

    <pre><h1 data-ros="fadeIn"> Text to animate </h1></pre>

5.  You can add more options with `data-options` attribute.

    <pre> <div data-ros="zoomIn" data-options="delay:300;duration:1000"></pre>

6.  Available Options:

    <pre>  data-options="infinite:false;animationClass:'animated';delay: 0;duration: 1000;callback:;"
    <!--  
      animationClass: "animated"  // Can be any class. for magic.css use 'puffIn'
      delay: 0 //Can be any value (in ms)
      duration: 1000  // Can be any value (in ms)
      callback:; // Any function
     -->
        		</pre>

## How it Works

There are plenty of scroll animation plugins with their unique features. Our intention is to use minimal one to support predefined css animations that easy to configure. Technically our work is outcome of combined package of few jquery plugins.

1.  https://github.com/protonet/jquery.inview - to find an element is scrolled into view
2.  https://github.com/craigmdennis/animateCSS - dynamically apply animate.css animations
3.  https://gomakethings.com/setting-multiple-javascript-plugin-options-with-a-single-data-attribute - To pass animateCSS options combined in single attribute
4.  https://github.com/michalsnik/aos - the idea of using data attribute to trigger
