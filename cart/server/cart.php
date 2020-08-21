<?php
    include('./mysql.php');

    // 接收传递的方法名; 并调用该方法;
    $fn = $_GET['fn'];
    $fn();


    /**
     *    获取 cart 中，指定用户的商品id。
     */ 
    function getGoodsId(){
        $userId = $_GET['userId'];
        // 查询商品的id和数量
        $sql = 'select productId,num from cart where userId='.$userId;
        $data = select($sql);

        echo json_encode([
            'stateCode'=>200,
            'state'=>'success',
            'data'=>$data
        ]);
    }



    /**
     *  根据商品id获取[product表]中的数据信息 
     */ 
    function lst(){
        $id = $_POST['goodsId'];
        // echo $id.'-';

        // 将最后的逗号去掉；
        $id = substr($id,0,strlen($id)-1);
        // echo $id;
        /*
            substr(string,start,length)   截取字符串
                    string  返回其中一部分字符串；
                    start   正数 - 在字符串的指定位置开始
                            负数 - 在从字符串结尾开始的指定位置开始
                            0 - 在字符串中的第一个字符处开始
                    length  正数 - 从 start 参数所在的位置返回的长度
                            负数 - 从字符串末端返回的长度
        */ 

        // 一次性获取多条数据     where in （）;
        $sql = "select * from product where id in ($id)";
        // echo $sql;

        $data = select($sql);
        echo json_encode([
        'stateCode'=>200,
        'state'=>'success',
        'data'=>$data
        ]);
    }


    /**
     *   更新 cart 表中的数量
     */ 
    function update(){
        $gId = $_GET['goodsId'];
        $num = $_GET['goodsNum'];
        $user = $_GET['userId'];
        $sql = "update cart set num=$num where productId=$gId and userId= $user";
        $res = query($sql);
        if($res==1){
            echo json_encode([
            'stateCode'=>200,
            'state'=>'success',
            'data'=>''
            ]);
        }else{
            echo json_encode([
            'stateCode'=>201,
            'state'=>'error',
            'data'=>''
            ]);
        }
    }


    /**
     *   删除 cart 中数据的方法； 
     */ 
    function delete(){
        $gId = $_GET['goodsId'];
        $user = $_GET['userId'];
        $sql = "delete from cart where productId=$gId and userId= $user";
        $res = query($sql);
        if($res==1){
            echo json_encode([
            'stateCode'=>200,
            'state'=>'success',
            'data'=>''
            ]);
        }else{
            echo json_encode([
            'stateCode'=>201,
            'state'=>'error',
            'data'=>''
            ]);
        }
   }
   


?>