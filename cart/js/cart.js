/**
 *    获取购物车中的数据，然后追加到页面；
 */


class Cart {
    constructor() {
        // 1、获取数据库信息
        this.list();

        // 2、给两个全选按钮绑定点击事件
        all('.check-all')[0].addEventListener('click', this.checkAll);
        all('.check-all')[1].addEventListener('click', this.checkAll);

    }


    /**
     *   获取cart表中的信息，然后追加到页面上;  
     */
    list() {
        // 1、根据登录的状态获取商品的id
        let userId = localStorage.getItem('userId');
        //  声明变量，保存购物车商品id的变量
        let cartGoodsId = '';

        /*
            2 如果登录了  
        */
        if (userId) {
            // 如果登录了，就去cart表中获取id
            ajax.get('./server/cart.php', { fn: 'getGoodsId', userId: userId }).then(res => {
                // console.log(res);
                let { stateCode, data } = JSON.parse(res);
                // console.log(stateCode,data);
                // data 中包含商品的id和商品的数量
                if (stateCode == 200) {
                    // 如果购物车的数据为空，则终止方法的执行
                    if (!data) {
                        alert('购物车为空');
                        return;
                    }
                    // console.log(data);

                    // 将商品id 和数量保存为对象；
                    let cartIdNum = {};
                    data.forEach(ele => {
                        // {productId: "2", num: "3"}  其中一条数据;
                        // ele表示每一件商品的[id和数量]的对象
                        // console.log(ele);

                        cartGoodsId += ele.productId + ',';
                        cartIdNum[ele.productId] = ele.num;
                        /*
                            将商品[id和数量]构造成一个对象; 方便后面向页面追加信息；
                            {2: "3", 3: "7", 9: "1"}
                        */
                    });
                    // 根据id获取商品信息
                    // console.log(cartIdNum);

                    /**    
                     *   根据 cartGoodsId 和 cartIdNum 去商品表获取数据
                     *    购物车中的商品id和数量；
                     */
                    Cart.getCartGoods(cartGoodsId, cartIdNum);
                }
            });
        } else {
            /*
                3 如果没有登录,则执行else, 去浏览器[localStorage]获取数据
            */
            let cartGoods = localStorage.getItem('carts');
            // console.log(cartGoods);
            // 3-1 如果为空，就停止
            if (!cartGoods) {
                alert('购物车中为空！')
                return;
            }
            cartGoods = JSON.parse(cartGoods)
            // console.log(cartGoods);
            // 3-2 如果不为空，就循环遍历，获取商品的id
            for (let gId in cartGoods) {
                // console.log(gId);  // gId 就是商品的id

                cartGoodsId += gId + ',';   // 获取的商品id
            }
            // console.log(cartGoodsId);

            /**
             *   根据商品id去商品表获取商品
             */
            Cart.getCartGoods(cartGoodsId);
        }
    }


    /**
     *   根据购物车商品id,去商品表获取商品信息
     */
    static getCartGoods(gId, cartIds = '') {
        // gId  存储的是购物车中商品的id，多个商品的时候，用逗号隔开；
        /*
            如果是登录的状态，商品的数量就是 cartIds ;
            如果未登录的，就在浏览器中获取；
        */
        cartIds = cartIds || JSON.parse(localStorage.getItem('carts'))
        // 存在浏览器中的 [carts] 数据，已经转化为一个对象;
        // console.log(cartIds);  

        // 根据商品的id，去[product表]中获取商品的详细信息；    
        ajax.post('./server/cart.php?fn=lst', { goodsId: gId }).then(res => {
            // console.log(res);
            // 转化数据和获取data
            let { data, stateCode } = JSON.parse(res);
            // console.log(stateCode);
            // console.log(data);

            if (stateCode == 200) {
                let str = '';// 用于拼接字符串标签
                data.forEach(ele => {
                    // console.log(ele);  // ele此时表示数据库中每一条记录
                    // 将数据循环追加到页面中
                    str +=
                        `<tr>
                        <td class="checkbox">
                            <input class="check-one check" type="checkbox"/ onclick="Cart.goodsCheck(this)">
                        </td>
                        <td class="goods">
                            <img src="${ele.goodsImg}" alt=""/>
                            <span>${ele.goodsName}</span>
                        </td>
                        <td class="price">${ele.price}</td>
                        <td class="count">
                            <span class="reduce"  onclick="Cart.redGoodsNum(this,${ele.id})"> - </span>
                            <input class="count-input" type="text" value="${cartIds[ele.id]}"/>
                            <span class="add" onclick="Cart.addGoodsNum(this,${ele.id})">+</span>
                        </td>
                        <td class="subtotal">${(ele.price * cartIds[ele.id]).toFixed(2)}</td>
                        <td class="operation">
                            <span class="delete" onclick='Cart.delGoods(this,${ele.id})'>删除
                            </span>
                        </td>
                    </tr>`;
                });
                // 获取 tbody 标签，然后将标签追加到页面;
                $('tbody').innerHTML = str;
            }
        });
    }


    /**
     *    全选按钮的实现
     */
    checkAll() {
        // console.log(0000);
        // console.log(this); // this指向当前的 全选按钮

        // 1 点击一个按钮，让另一个按钮也选中
        let state = this.checked;   // 保存当前按钮的状态
        all('.check-all')[this.getAttribute('all-key')].checked = state;
        /*
            <input class="check-all check" type="checkbox" all-key="1"> 上面的全选按钮
            <input type="checkbox" class="check-all check" all-key="0">  下面的全选按钮

            当点击上面的按钮的时候，获取的 all-key的值是 1，就会设置下标为1 的那个，即下面的全选按钮；
            当点击下面的按钮的时候，获取的 all-kye的值是 0，就会设置下标为0 的那个，即上面的全选按钮；
        */

        /*
            2、点击全选按钮的时候，让所有商品选中；
        */
        // 2-1、获取单个商品的复选框
        let checkGoods = all('.check-one');
        // console.log(checkGoods);
        // 2-2、遍历所有商品的复选框的状态
        checkGoods.forEach(ele => {
            // console.log(ele);
            ele.checked = state;   // 让所有商品的选框状态和 全选框状态一致；
        });




        /**
         *   选中商品之后，计算商品的数量和价格 
         */
        Cart.cpCount();
    }


    /**
     *   单选框按钮的实现 
     * 
     *    在创建标签追加商品到页面上的时候，给每个商品的复选框绑定一个行内点击事件；
     *     采用静态方法绑定；并且将当前的点击的复选框通过this传递过来
     */
    static goodsCheck(eleObj) {
        // console.log(eleObj);  // 指向当前的复选框按钮
        let state = eleObj.checked;   // 获取当前复选框状态

        // 1、当有一件商品取消选中的时候，取消全选
        if (!state) {
            all('.check-all')[0].checked = false;
            all('.check-all')[1].checked = false;
        } else {  // 2、所有单选的选中，则全选的也选中
            // 2-1、获取所有的单选框
            let checkOne = all('.check-one');
            let len = checkOne.length;  // 获取单选框的个数

            // 2-2、计算选中的单选框的数量；
            let checkCount = 0;
            checkOne.forEach(ele => {
                // 前面的为true,则执行后面的 ++;
                ele.checked && checkCount++;
            });
            // 2-3 单个商品选中的个数，等于len的时候，全选选中
            if (checkCount == len) {
                all('.check-all')[0].checked = true;
                all('.check-all')[1].checked = true;
            }
        }

        /**
         *   选中商品之后，计算商品的数量和价格 
         */
        Cart.cpCount();
    }


    /**
     *   点击 + 使数量增加 
     *    在创建页面标签的时候，给 + 按钮绑定一个行内的点击事件，
     *    并且传入当前的点击按钮，和商品的id
     */
    static addGoodsNum(eleObj, gId) {
        // console.log(eleObj,gId);  // 
        // 1、修改input框中商品的数量
        let inputNumObj = eleObj.previousElementSibling;
        // console.log(inputNumObj);
        inputNumObj.value = inputNumObj.value - 0 + 1;

        /*
            2、判断登录状态，修改数据库或者浏览器中的数量；
        */
        if (localStorage.getItem('user')) {  // 如果是登录的状态；
            // 调用方法，修改数据库中的数量
            Cart.updateCart(gId, inputNumObj.value);
        } else {   // 如果是未登录的状态
            // 调用方法，修改浏览器中的数量
            Cart.updateLocal(gId, inputNumObj.value);
        }

        // 3 实现小计的计算
        // 3-1 获取价格的节点
        let priceObj = eleObj.parentNode.previousElementSibling;
        // console.log(priceObj);
        eleObj.parentNode.nextElementSibling.innerHTML = (priceObj.innerHTML * inputNumObj.value).toFixed(2);

        /*
            计算数量和价格
        */
        Cart.cpCount();

    }

    /**
     *   点击 - 减少数量 
     */
    static redGoodsNum(eleObj, gId) {
        // console.log(eleObj, gId);
        // 1 修改 input中的数量
        let inputObj = eleObj.nextElementSibling;
        inputObj.value = parseInt(inputObj.value - 1);

        // 2、根据登录状态，修改数据库或者，浏览器中的数量
        if (localStorage.getItem('user')) {
            Cart.updateCart(gId, inputObj.value);
        } else {
            Cart.updateLocal(gId, inputObj.value);
        }

        if (inputObj.value == 0) {

            // console.log('00000');
            alert('是否将该商品移出购物车？');
            Cart.delGoods(eleObj, gId);
        }

        // 3 实现小计的计算
        //  3-1 获取价格的节点
        let priceObj = eleObj.parentNode.previousElementSibling;
        eleObj.parentNode.nextElementSibling.innerHTML = (priceObj.innerHTML * inputObj.value).toFixed(2);

        // 计算价格和数量
        Cart.cpCount();
    }




    /**
     *   修改 cart 中商品的数量
     */
    static updateCart(gId, gNum) {
        let id = localStorage.getItem('userId');   // 获取前登录用户的id
        // 发送请求，改变 cart 表中的数量；
        ajax.get('./server/cart.php', { fn: 'update', goodsId: gId, goodsNum: gNum, userId: id }).then(res => {
            console.log(res);
        });
    }
    /**
     *   修改浏览器中的数量
     */
    static updateLocal(gId, gNum) {
        // 取出浏览器中的 carts 值;
        let cartGoods = JSON.parse(localStorage.getItem('carts'));
        // 对 carts 进行重新赋值
        cartGoods[gId] = gNum;
        localStorage.setItem('carts', JSON.stringify(cartGoods));
    }




    /**
     *  计算商品的数量和价格 
     */
    static cpCount() {
        // 1、获取页面中所有的 check-one;
        let checkOne = all('.check-one');
        // 保存已经选中商品的价格和数量
        let count = 0;
        let xj = 0;

        // 2、遍历找出选中的商品
        checkOne.forEach(ele => {
            if (ele.checked) {   // 如果单选框被选中，则[checked]为true;
                // console.log(ele);
                // 3、找到当前单选框的所在的 tr 标签;  父级的父级
                let trObj = ele.parentNode.parentNode;
                // console.log(trObj);
                // 4、获取数量和小计
                let tmpCount = trObj.querySelector('.count-input').value;
                let tmpXj = trObj.querySelector('.subtotal').innerHTML;
                // console.log(tmpCount,tmpXj);

                count += tmpCount - 0;
                xj += tmpXj - 0;
            }
        });
        // console.log(count,xj);
        // 5、将数量和总价放到页面中；
        $('#selectedTotal').innerHTML = count;
        $('#priceTotal').innerHTML = parseInt(xj * 100) / 100;
    }


    /**
     *   删除商品 
     *    创建标签的时候 ，绑定行内点击事件
     *    并传入 当前点击的按钮，和当前商品的id
     */
    static delGoods(eleObj, gId) {
        // console.log(eleObj, gId);
        let userId = localStorage.getItem('userId'); // 取出登录用户的id

        if (userId) {  // 如果用户登录，则修改cart中的数据
            ajax.get('./server/cart.php', { fn: 'delete', goodsId: gId, userId: userId }).then(res => {
                // console.log(res);

                // 把当前删除对应的行的 tr 删除
                eleObj.parentNode.parentNode.remove();
                alert('当前商品已删除！')

            });
        } else {  // 如果没有登录，则修改浏览器中的数据
            let cartsGoods = JSON.parse(localStorage.getItem('carts'));
            console.log(cartsGoods);

            // 根据id  删除指定的属性
            delete cartsGoods[gId];
            localStorage.setItem('carts', JSON.stringify(cartsGoods));

            // 把当前删除对应的行的 tr 删除
            eleObj.parentNode.parentNode.remove();
            alert('当前商品已经删除')

        }

        /*
            计算数量和价格
        */
        Cart.cpCount();
    }


}
new Cart;