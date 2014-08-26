<?php
    //########################################################################
    //#               Simple Logger PHP logger maker Sample                  #
    //#----------------------------------------------------------------------#
    //# Add header for cross access domain issue to solve.                   #
    //# you can add a parameter to create a customizing log.                 #
    //#----------------------------------------------------------------------#
    //# Ahthor : Kyoungil Lee / leekyoungil@gmail.com                        #
    //# blog : http://blog.leekyoungil.com                                   #
    //# github : https://github.com/LeeKyoungIl                              #
    //########################################################################

    header('P3P: policyref="http://logger.co.kr/w3c/p3p.xml", CP="NOI DSP LAW NID PSA OUR IND NAV STA COM"');
    header('Cache-Control: no-cache, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('content-type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: *');
    header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: X-PINGARUNER');
    header('Access-Control-Max-Age: 1728000');

    function validationParam ($data) {
        if (is_null($data)) {
            return 'NULL';
        }

        return $data;
    }

    $prePageAddr = validationParam($_POST['prePageAddr']);
    $pageName = validationParam($_POST['pageName']);
    $curPageAddr = validationParam($_POST['curPageAddr']);
    $beforeload = validationParam($_POST['beforeload']);
    $scwResolution = validationParam($_POST['scwResolution']);
    $schResolution = validationParam($_POST['schResolution']);
    $bwwResolution = validationParam($_POST['bwwResolution']);
    $bwhResolution = validationParam($_POST['bwhResolution']);
    $clickLog = validationParam($_POST['clickLog']);

    $millisecond = explode('.', microtime(true));

    $logData[0] = '['.date('Y-m-d H:i:s.', time()).$millisecond[1].']'."\t".$_SERVER['REMOTE_ADDR'];
    $logData[1] = $prePageAddr;
    $logData[2] = $pageName;
    $logData[3] = $curPageAddr;
    $logData[4] = $beforeload;
    $logData[5] = $scwResolution;
    $logData[6] = $schResolution;
    $logData[7] = $bwwResolution;
    $logData[8] = $bwhResolution;

    $logType = 'basic';

    if ($clickLog != 'NULL') {
        $logType = 'click';
        $logData[8] = $clickLog;
    }

    $path = 'set your log path';
    $fileName = 'SimpleLogger_'.$logType.'_'.date('Y-m-d', time()).'.slog';

    $fp = fopen($path.$fileName, 'a');
    fwrite($fp, implode("\t", $logData)."\r\n");
    fclose($fp);

    echo '{"result":"success"}';

    $userInfo = get_browser($_SERVER['HTTP_USER_AGENT'], true);
?>