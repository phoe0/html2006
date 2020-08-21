<?php
    include('./mysql.php');

    // 获取ajax请求的方法;
    $fn = $_GET['fn'];
    $fn();

    // 获取数据的方法
    function lst(){ 
        $sql = 'select * from product';
        $data = select($sql);

        echo json_encode([
            'stateCode'=>200,
            'state'=>'error',
            'data'=>$data
        ]);
    }

    // 
    function add(){
        //echo '我是添加';
        $userId = $_POST['userId'];
        $gId = $_POST['gId'];
        $gNum = $_POST['gNum'];

        // $sql = "insert into cart values(null,' $userId','$gId','$gNum',40)";
        
        // 给cart添加唯一索引， alter table cart add unique index(productId,userId);
        // 如果商品已经存在，再次点击的时候，只改变数量；
        $sql = "insert into cart(userId,productId,num,size) values(' $userId','$gId','$gNum',40) on duplicate key update num=num+$gNum";

        
        //echo $sql;
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