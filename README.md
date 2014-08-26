Simple_Logger_Ajax_Sender
=========================

This is made by pure javascript code. 
Other do not have javascript framework. (JQuery etc...)

Browser support
-------------

* Internet Explorer from 6 to latest version.
* Chrome 
* Safari
* Firefox
* All Mobile browsers.

Requirements
-------------

* Linux(UNIX) or NT Application Server (With JSP or PHP)

How to Install?
-------------

Copy the file to fit your Application Server type.

How to Use?
-------------

1) add simpleLogger.js in your html file 
```html
<script type="text/javascript" src="script/simpleLogger.js" charset="utf-8"></script>
```

2) set simpleLogger init in script section
```html
var simpleLogger = new simpleLogger();

// for developer mode.
simpleLogger.setDebugMode(true);
// if you have an external Log Server.
simpleLogger.setExternalServer(true);
simpleLogger.setLogServer('test.com:8089');
// url of recording Log.
simpleLogger.setLogUrl('logger.jsp');
// excute send log.
simpleLogger.call();
```

3) click log section.
```html
<a href="http://blog.leekyoungil.com" onMouseDown="simpleLogger.clickLog(this, 'A tag Click');">Click</a>
<span onClick="testLocation();" onMouseDown="simpleLogger.clickLog(this, 'OnClick Click');">Click</span>
```

ChangeLog
-------------

ver 0.0.1 (2014/08/26)
* first commit

MIT License
-------------

Copyright (c) 2014 Lee Kyoung Il. See LICENSE.txt for details.
