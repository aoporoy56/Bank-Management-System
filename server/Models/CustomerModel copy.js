
Webflow.push(function () {


    let topOffset = document.querySelectorAll(".div-block-1010")[0].offsetTop;
    const myoffset = document.querySelector(".con-1200").offsetTop;

    window.onscroll = function () {
        if (topOffset - 400 < window.scrollY) {
            console.log("Window" + window.scrollY);
            console.log("Offset" + topOffset);
            topOffset = 100000;
            var tabTimeout;
            clearTimeout(tabTimeout);
            // add by me
            $("#email,#email-2,#email-3,#email-4").focus(function () {
                clearTimeout(tabTimeout);
            });
            $("#email,#email-2,#email-3,#email-4").blur(function () {
                console.log("Blur");
                tabLoop();
            });
            // add by me
            tabLoop();
            $(".home-tab:first").click();
            // define loop - cycle through all tabs
            function tabLoop() {
                tabTimeout = setTimeout(function (e) {
                    var $next = $(".tabs-menu-13").children(".w--current:first").next();
                    if ($next.length) {
                        $next.click(); // click resets timeout, so no need for interval
                        console.log("Tab 02");
                    } else {
                        $(".home-tab:first").click();
                    }
                }, 5000);
            }
            // reset timeout if a tab is clicked
            $(".home-tab").click(function () {
                clearTimeout(tabTimeout);
                tabLoop();
            });
        }
        if (myoffset - 500 < window.scrollY) {
            
            myoffset = 100000;
            tabLoop2();
            $(".tab-link-32:first").click();
            // define loop - cycle through all tabs
            function tabLoop2() {
                tabTimeout = setTimeout(function (e) {
                    var $next = $(".tabs-menu-14").children(".w--current:first").next();
                    if ($next.length) {
                        $next.click(); // click resets timeout, so no need for interval
                        console.log("Tab 01");
                    } else {
                        $(".tab-link-32:first").click();
                    }
                }, 5000);
            }
            // reset timeout if a tab is clicked
            $(".tab-link-32").click(function () {
                clearTimeout(tabTimeout);
                tabLoop2();
            });
        }
    };
});
