class ajax {
    // get请求
    static get(url, obj) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let param = '';
            if (obj) {
                for (let attr in obj) {
                    param += attr + '=' + obj[attr] + '&';
                }
            }
            xhr.open('get', url + '?' + param);
            xhr.send();


            // 监听状态,接收返回值
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.response);
                    } else {
                        reject('get时error!!!');
                    }
                }
            }
        });
    }


    // post请求
    static post(url, obj) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let param = '';
            if (obj) {
                for (let attr in obj) {
                    param += attr + '=' + obj[attr] + '&';
                }
            }
            // console.log(param);
            xhr.open('post', url);
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.send(param);


            // 监听状态,接收返回值
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(xhr.response);
                    } else {
                        reject('post时error!!!');
                    }
                }
            }
        });

    }
}