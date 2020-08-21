class Goods {
    constructor() {
        // 1 获取数据库的信息的方法
        this.list();

        // 2-1 给[登录按钮]绑定点击事件
        $('#login').addEventListener('click', this.login);
        // 2-2 给[退出按钮[绑定点击事件
        $('#exit').addEventListener('click', this.exit);

    }

    // 1  获取数据库的信息,然后追加到页面上;  (实现商品列表)
    list() {
        // 1-1  发送ajax请求,获取数据
        ajax.get('./server/goods.php', { fn: 'lst' }).then(res => {
            // console.log(res);

            let { stateCode, data } = JSON.parse(res);
            // console.log(stateCode);

            // 1-2 判断状态,拿到数据;
            if (stateCode == 200) {
                // console.log(data);
                let str = '';
                // 1-3 循环遍历数据,拼接标签
                data.forEach(ele => {
                    // console.log(ele);
                    str += `
                    <div class="goodsCon">
                        <a target = "_blank" >
                            <img src="${ele.goodsImg}" class="icon">
                            <h4 class="title">${ele.goodsName}</h4>
                            <div class="info">限时抢购200条</div>
                        </a>
                        <div class="priceCon">
                            <span class="price">￥${ele.price}</span>
                            <span class="oldPrice">￥${(ele.price * 1.2).toFixed(2)}</span>
                            <div>
                                <span class="soldText">已售${ele.num}%</span>
                                <span class="soldSpan">
                                    <span style="width: 87.12px;"></span>
                                </span>
                        </div>
                        <a class="button" target="_blank"
                                onclick="Goods.addCart(${ele.id},1)">
                                立即抢购
                        </a>
                        </div>
                        </div >
                        `;
                });
                // 1-4  获取class="divs", 并将数据追加到其中
                $('.divs').innerHTML = str;
            }
        }).catch(res => {
            console.log(res);
        });
    }


    /**
     *  登录的方法 
     */
    login() {
        // console.log(1111);
        // 1 发送ajax请求,让后台验证用户名和密码

        // 2 验证成功则登录,将用户名,保存到浏览器
        localStorage.setItem('user', '张三');  // 保存用户名
        localStorage.setItem('userId', 1);   // 保存用户的 id
    }

    /**
     *   退出的方法
     */
    exit() {
        // console.log(22222);
        // 点击退出之后,清空  localStorage 中的数据
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
    }


    /** 
     *   将数据加入购物车
     * 
     *    在向页面中追加标签的时候,  给[加入购物车按钮] 绑定行内的点击事件,
     *    并且将当前点击商品的  id和数量  传递过来;
     */
    static addCart(goodsId, goodsNum) {
        // 1 判断当前的用户是否登录
        if (localStorage.getItem('user')) {   // 获取localStorage中的用户名,看是否存在;
            // 2  如果用户登录,则存入数据
            Goods.setDataBase(goodsId, goodsNum);

        } else {  // 3 如果没有登录,则将信息存入浏览器
            Goods.setLocal(goodsId, goodsNum);
        }
    }


    /**
     *  存到数据库的方法； 
     */
    static setDataBase(goodsId, goodsNum) {
        // 1、获取当前用户的  id;
        let userId = localStorage.getItem('userId');
        // 2、发送ajax请求，进行存储；
        ajax.post('./server/goods.php?fn=add', { userId: userId, gId: goodsId, gNum: goodsNum }).then(res => {
            // 属性的名字，要和php文件的sql语句的名字一致；*******
            // console.log(res);
            let { stateCode } = JSON.parse(res);
            if (stateCode == 200) {
                alert('当前商品已添加至购物车');
            }
        });
    }


    /**
     *  存到浏览器的方法 
     */
    static setLocal(goodsId, goodsNum) {
        // 1  取出localStorage中的数据
        let carts = localStorage.getItem('carts');
        /*
            2  判断是否有数据,
            
            第一次点击的时候,localStorage中没有数据,会执行else语句
            非第一次点击的时候,里面已经有数据了,执行if语句
        */
        if (carts) {   //  非第一次点击
            // console.log(carts);
            // 2-1 将carts转化为对象
            carts = JSON.parse(carts);
            // 2-2 根据当前点击的商品id 判断商品是否已经存在
            for (let gId in carts) {
                if (gId == goodsId) {
                    goodsNum = carts[gId] - 0 + goodsNum;
                }
            }
            // 2-3 如果不存在就增加，存在就重新赋值
            carts[goodsId] = goodsNum;

            // 2-4 重新存到local中
            localStorage.setItem('carts', JSON.stringify(carts));

        } else {  // 第一次点击
            // 3  构造商品信息,然后存入localStorage
            let goodsCart = { [goodsId]: goodsNum };
            // 转化为json字符串进行存储
            goodsCart = JSON.stringify(goodsCart);
            localStorage.setItem('carts', goodsCart);
        }
    }




}
new Goods;