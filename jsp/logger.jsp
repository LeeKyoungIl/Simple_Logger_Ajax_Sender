<%@ page contentType="application/json; charset=utf-8" session="false" %>
<%@ page import="java.io.*, java.util.*, java.text.*" %>
<%
    //########################################################################
    //#               Simple Logger JSP logger maker Sample                  #
    //#----------------------------------------------------------------------#
    //# Add header for cross access domain issue to solve.                   #
    //# you can add a parameter to create a customizing log.                 #
    //#----------------------------------------------------------------------#
    //# Ahthor : Kyoungil Lee / leekyoungil@gmail.com                        #
    //# blog : http://blog.leekyoungil.com                                   #
    //# github : https://github.com/LeeKyoungIl                              #
    //########################################################################

    request.setCharacterEncoding("UTF-8");

    // header
    response.setHeader("P3P", "policyref=\"http://logger.co.kr/w3c/p3p.xml\", CP=\"NOI DSP LAW NID PSA OUR IND NAV STA COM\"");
    response.setHeader("Cache-Control", "no-cache, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "X-PINGARUNER");
    response.setHeader("Access-Control-Max-Age", "1728000");
    response.setCharacterEncoding("utf-8");
    response.setContentType("application/json; charset=utf-8");

    // basic params
    String prePageAddr = validationParam(request.getParameter("prePageAddr"));
    String pageName = validationParam(request.getParameter("pageName"));
    String curPageAddr = validationParam(request.getParameter("curPageAddr"));
    String beforeload = validationParam(request.getParameter("beforeload"));
    String scwResolution = validationParam(request.getParameter("scwResolution"));
    String schResolution = validationParam(request.getParameter("schResolution"));
    String bwwResolution = validationParam(request.getParameter("bwwResolution"));
    String bwhResolution = validationParam(request.getParameter("bwhResolution"));
    String clickLog = validationParam(request.getParameter("clickLog"));

    SimpleDateFormat logFormatter = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    String todayLog = logFormatter.format(new java.util.Date());

    final String delimeter = "\t";

    String writeLog = "["+todayLog+"]" + delimeter + request.getRemoteAddr() + delimeter + prePageAddr + delimeter + pageName + delimeter + curPageAddr + delimeter + beforeload + delimeter + scwResolution + delimeter + schResolution + delimeter + bwwResolution + delimeter + bwhResolution + delimeter;

    try {
        java.text.SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String today = formatter.format(new java.util.Date());

        String logType = "basic";

        if (!"NULL".equals(clickLog)) {
            logType = "click";
            writeLog += delimeter + clickLog;
        }

        String path = "/Users/kyoungil_lee/Desktop/";
        String fileName = "SimpleLogger_"+logType+"_"+today+".slog";

        File logFIle = new File(path+fileName);

        if (!logFIle.exists()) {
            logFIle.createNewFile();
        }

        FileWriter fw = new FileWriter(path+fileName, true);
        fw.write(writeLog+"\r\n");
        fw.close();

    } catch (Exception ex) {
        ex.printStackTrace();

        out.write("{\"result\":\"error\", \"msg\":\"log file access error\"}");
    }

    out.write("{\"result\":\"success\"}");
%>
<%!
    public String validationParam (String reqData) {
        if (reqData == null) {
            return "NULL";
        }

        reqData = reqData.trim();

        if ("".equals(reqData)) {
            return "NULL";
        }

        return reqData;
    }
%>