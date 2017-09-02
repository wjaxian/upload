<?php
 /*****************************************
   Title :文件上传测试接口
   Author:wujia
   Finish Date  :2017-09-01
  *****************************************/
    $queryString = $_SERVER["QUERY_STRING"];
    $queryString = convertUrlQuery($queryString);

    $upload_path = $queryString['savePath']."/";//上传文件存放路径
    creatdir($upload_path); //创建上传文件的存放目录

    $file = $_FILES;

    $data = array();
    $state = 1;
    foreach ($file as $key => $value) {
        if($value['error']>0){
            $state = 0;
            return false;
        };
        $name = explode(".",$value['name'])[1];
        $num = rand(100000000,999999999);
        if(move_uploaded_file($value['tmp_name'],$upload_path.$num.".".$name)){
            array_push($data,$upload_path.$num.".".$name);
        }else{
          echo "Failed!";
        };
    };

    if($state<1){
        echo json_encode(array("code"=>100,"msg"=>"上传失败","results"=>$data));
    }else{
        echo json_encode(array("code"=>100,"msg"=>"上传成功","results"=>$data));
    };

    //创建目录方法
    function creatdir($path){
        if(!is_dir($path)){
            if(creatdir(dirname($path))){
                mkdir($path,0777);
                return true;
            }
        }else{
            return true;
        }
    };

    //把Query String参数转换成数组方法
    function convertUrlQuery($query){
      $queryParts = explode('&', $query);
      $params = array();
      foreach ($queryParts as $param) {
        $item = explode('=', $param);
        $params[$item[0]] = $item[1];
      };
      return $params;
    };
?>
