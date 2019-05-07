/**
 * 公共工具类
 * @author Jeffrey.deng
 * @date 2018/3/31.
 */
(function (view) {
    "use strict";

    view.URL = view.URL || view.webkitURL;

    if (view.Blob && view.URL) {
        try {
            new Blob;
            return;
        } catch (e) {
        }
    }

    // Internally we use a BlobBuilder implementation to base Blob off of
    // in order to support older browsers that only have BlobBuilder
    var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || (function (view) {
            var
                get_class = function (object) {
                    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
                }
                , FakeBlobBuilder = function BlobBuilder() {
                    this.data = [];
                }
                , FakeBlob = function Blob(data, type, encoding) {
                    this.data = data;
                    this.size = data.length;
                    this.type = type;
                    this.encoding = encoding;
                }
                , FBB_proto = FakeBlobBuilder.prototype
                , FB_proto = FakeBlob.prototype
                , FileReaderSync = view.FileReaderSync
                , FileException = function (type) {
                    this.code = this[this.name = type];
                }
                , file_ex_codes = (
                    "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
                    + "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
                ).split(" ")
                , file_ex_code = file_ex_codes.length
                , real_URL = view.URL || view.webkitURL || view
                , real_create_object_URL = real_URL.createObjectURL
                , real_revoke_object_URL = real_URL.revokeObjectURL
                , URL = real_URL
                , btoa = view.btoa
                , atob = view.atob

                , ArrayBuffer = view.ArrayBuffer
                , Uint8Array = view.Uint8Array

                , origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/
                ;
            FakeBlob.fake = FB_proto.fake = true;
            while (file_ex_code--) {
                FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
            }
            // Polyfill URL
            if (!real_URL.createObjectURL) {
                URL = view.URL = function (uri) {
                    var
                        uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
                        , uri_origin
                        ;
                    uri_info.href = uri;
                    if (!("origin" in uri_info)) {
                        if (uri_info.protocol.toLowerCase() === "data:") {
                            uri_info.origin = null;
                        } else {
                            uri_origin = uri.match(origin);
                            uri_info.origin = uri_origin && uri_origin[1];
                        }
                    }
                    return uri_info;
                };
            }
            URL.createObjectURL = function (blob) {
                var
                    type = blob.type
                    , data_URI_header
                    ;
                if (type === null) {
                    type = "application/octet-stream";
                }
                if (blob instanceof FakeBlob) {
                    data_URI_header = "data:" + type;
                    if (blob.encoding === "base64") {
                        return data_URI_header + ";base64," + blob.data;
                    } else if (blob.encoding === "URI") {
                        return data_URI_header + "," + decodeURIComponent(blob.data);
                    }
                    if (btoa) {
                        return data_URI_header + ";base64," + btoa(blob.data);
                    } else {
                        return data_URI_header + "," + encodeURIComponent(blob.data);
                    }
                } else if (real_create_object_URL) {
                    return real_create_object_URL.call(real_URL, blob);
                }
            };
            URL.revokeObjectURL = function (object_URL) {
                if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
                    real_revoke_object_URL.call(real_URL, object_URL);
                }
            };
            FBB_proto.append = function (data/*, endings*/) {
                var bb = this.data;
                // decode data to a binary string
                if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
                    var
                        str = ""
                        , buf = new Uint8Array(data)
                        , i = 0
                        , buf_len = buf.length
                        ;
                    for (; i < buf_len; i++) {
                        str += String.fromCharCode(buf[i]);
                    }
                    bb.push(str);
                } else if (get_class(data) === "Blob" || get_class(data) === "File") {
                    if (FileReaderSync) {
                        var fr = new FileReaderSync;
                        bb.push(fr.readAsBinaryString(data));
                    } else {
                        // async FileReader won't work as BlobBuilder is sync
                        throw new FileException("NOT_READABLE_ERR");
                    }
                } else if (data instanceof FakeBlob) {
                    if (data.encoding === "base64" && atob) {
                        bb.push(atob(data.data));
                    } else if (data.encoding === "URI") {
                        bb.push(decodeURIComponent(data.data));
                    } else if (data.encoding === "raw") {
                        bb.push(data.data);
                    }
                } else {
                    if (typeof data !== "string") {
                        data += ""; // convert unsupported types to strings
                    }
                    // decode UTF-16 to binary string
                    bb.push(unescape(encodeURIComponent(data)));
                }
            };
            FBB_proto.getBlob = function (type) {
                if (!arguments.length) {
                    type = null;
                }
                return new FakeBlob(this.data.join(""), type, "raw");
            };
            FBB_proto.toString = function () {
                return "[object BlobBuilder]";
            };
            FB_proto.slice = function (start, end, type) {
                var args = arguments.length;
                if (args < 3) {
                    type = null;
                }
                return new FakeBlob(
                    this.data.slice(start, args > 1 ? end : this.data.length)
                    , type
                    , this.encoding
                );
            };
            FB_proto.toString = function () {
                return "[object Blob]";
            };
            FB_proto.close = function () {
                this.size = 0;
                delete this.data;
            };
            return FakeBlobBuilder;
        }(view));

    view.Blob = function (blobParts, options) {
        var type = options ? (options.type || "") : "";
        var builder = new BlobBuilder();
        if (blobParts) {
            for (var i = 0, len = blobParts.length; i < len; i++) {
                if (Uint8Array && blobParts[i] instanceof Uint8Array) {
                    builder.append(blobParts[i].buffer);
                }
                else {
                    builder.append(blobParts[i]);
                }
            }
        }
        var blob = builder.getBlob(type);
        if (!blob.slice && blob.webkitSlice) {
            blob.slice = blob.webkitSlice;
        }
        return blob;
    };

    var getPrototypeOf = Object.getPrototypeOf || function (object) {
            return object.__proto__;
        };
    view.Blob.prototype = getPrototypeOf(new view.Blob());
}(
    typeof self !== "undefined" && self
    || typeof window !== "undefined" && window
    || this
));

(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'toastr'], factory);
    } else {
        // Browser globals
        window.common_utils = factory(window.jQuery, toastr);
    }
})(function ($, toastr) {

    //吐司 设置
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "progressBar": false,
        "positionClass": "toast-bottom-left",
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": "3500",
        "hideOnHover": false,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "iconClasses": {
            error: 'toast-error',
            info: 'toast-info-no-icon',
            success: 'toast-success',
            warning: 'toast-warning-no-icon'
        }
    };

    /**
     * 修改Jquery.extend方法，让如果某属性options为null而target中该属性有值就不覆盖
     * @returns {*|{}}
     */
    var extendNonNull = function () {
        var jQuery = $ || window.jQuery;
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }

        // extend jQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) )) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = jQuery.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        // Don't bring in null values either, if we already have non-null ones. // modify by jeffrey.deng
                        if (copy === null) {
                            if (target[name] === undefined) {
                                target[name] = copy;
                            }
                        } else {
                            target[name] = copy;
                        }
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };

    var parseURL = function (url) {
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function () {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length, i = 0, s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    };

    /**
     * 返回删除url中某个参数后的结果
     * @param {String} name - 参数名称
     * @param {String=} url 不填默认为当前页面地址
     * @returns {*}
     */
    var removeParamForURL = function (name, url) {
        var location = null;
        if (url) {
            location = document.createElement("a");
            location.href = url;
        } else {
            location = document.location;
        }
        if (location.search) {
            var ns = location.search.replace(new RegExp("[&?]" + name + "=[^&#]*"), "").replace(/^&/, "?");
            return location.origin + location.pathname + (ns == "?" ? "" : ns) + location.hash;
        } else {
            return location.href;
        }
    };

    /**
     * 在url中修改或添加一个参数值
     *
     * @param {String} name - 参数名称
     * @param {String} value - 参数值
     * @param {String=} url 不填默认为当前页面地址
     * @returns {*}
     */
    var setParamForURL = function (name, value, url) {
        var location = null;
        if (url) {
            location = document.createElement("a");
            location.href = url;
        } else {
            location = document.location;
        }
        var ns = null;
        if (location.search && location.search != "?") {
            if (new RegExp("([&?])" + name + "=" + "([^&#]*)").test(location.search)) {
                ns = location.search.replace((RegExp.$1 + name + "=" + (RegExp.$2 || "")), (RegExp.$1 + name + "=" + value));
            } else {
                ns = location.search + "&" + name + "=" + value;
            }
        } else {
            ns = "?" + name + "=" + value;
        }
        return location.origin + location.pathname + ns + location.hash;
    };

    var cookieUtil = {
        // get the cookie of the key is name
        get: function (name) {
            var cookieName = encodeURIComponent(name) + "=", cookieStart = document.cookie
                .indexOf(cookieName), cookieValue = null;
            if (cookieStart > -1) {
                var cookieEnd = document.cookie.indexOf(";", cookieStart);
                if (cookieEnd == -1) {
                    cookieEnd = document.cookie.length;
                }
                cookieValue = decodeURIComponent(document.cookie.substring(
                    cookieStart + cookieName.length, cookieEnd));
            }
            return cookieValue;
        },
        // set the name/value pair to browser cookie
        set: function (name, value, expires, path, domain, secure) {
            var cookieText = encodeURIComponent(name) + "="
                + encodeURIComponent(value);

            if (expires) {
                // set the expires time , then the browser will save it to disk
                var expiresTime = new Date();
                expiresTime.setTime(expires);
                cookieText += ";expires=" + expiresTime.toGMTString();
            }

            if (path) {
                cookieText += ";path=" + path;
            }

            if (domain) {
                cookieText += ";domain=" + domain;
            }

            if (secure) {
                cookieText += ";secure";
            }

            document.cookie = cookieText;
        },
        delete: function (name) {
            if (this.get(name) != null) {
                var expiresTime = new Date().getTime() - 10;
                this.set(name, name, expiresTime);
            }
        }
    };

    var addStyle = function (aCss, id) {
        'use strict';
        var head = document.getElementsByTagName('head')[0];
        if (head) {
            var style = document.createElement('style');
            style.id = id;
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };

    var encodeHTML = function (html) {
        var temp = document.createElement("div");
        /**
         * textContent: 赋值时会在innerHTML中添加一个textNode,不会将回车替换为<br>
         * innerText: 赋值时会在innerHTML中将回车替换为<br>
         */
        temp.textContent == "" ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.innerHTML;
        temp = null;
        output && (output = output.replace(/"/g, "&quot;").replace(/'/g, "&apos;"));
        return output;
    };

    var decodeHTML = function (text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        /**
         * textContent: 取值时直接剔除标签并转义
         * innerText: 取值时是取浏览器解释的结果
         */
        var output = temp.textContent || temp.innerText;
        temp = null;
        output && (output = output.replace(/&quot;/g, "\"").replace(/&apos;/g, "'"));
        return output;
    };

    /**
     * 压缩base64Url
     * @param base64Url
     * @param args {width: , height: , quality: } 可为空
     * @param callback 回调，压缩后的新base64Url传入回调方法
     */
    function canvasDataURL(base64Url, args, callback) {
        args = args || {};
        var img = new Image();
        img.onload = function () {
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = args.width || w;
            h = args.height || (w / scale);
            var quality = 0.7;  // 默认图片质量为0.7
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if (args.quality && args.quality <= 1 && args.quality > 0) {
                quality = args.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpeg', quality);
            // 回调函数返回base64的值
            callback(base64);
        };
        img.src = base64Url;
    }

    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     * 用url方式表示的base64图片数据
     */
    function convertBase64UrlToBlob(urlData) {
        var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        var b = new Blob([u8arr], {type: mime});
        return b;
    }

    // 62进制字典
    var RADIX62_DICT = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
    ];

    /**
     * 62进制值转换为10进制
     * @param {String} str62 62进制值
     * @return {Integer} 10进制值
     */
    var convertRadix62to10 = function (str62) {
        var i10 = 0;
        for (var i = 0; i < str62.length; i++) {
            var n = str62.length - i - 1;
            var s = str62[i];
            i10 += RADIX62_DICT.indexOf(s) * Math.pow(62, n);
        }
        return i10;
    };

    /**
     * 10进制值转换为62进制
     * @param {String|Integer} int10 10进制值
     * @return {String} 62进制值
     */
    var convertRadix10to62 = function (int10) {
        var s62 = '';
        var r = 0;
        while (int10 != 0 && s62.length < 100) {
            r = int10 % 62;
            s62 = RADIX62_DICT[r] + s62;
            int10 = Math.floor(int10 / 62);
        }
        return s62;
    };

    var formatDate = function (date, fmt) {
        if (typeof date == "number") {
            date = new Date(date);
        }
        var o = {
            "M+": date.getMonth() + 1,               //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()              //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    /**
     * 数字填充0
     * @param num
     * @param length
     * @returns {string}
     */
    function paddingZero(num, length) {
        return (Array(length).join("0") + num).substr(-length);
    }

    /**
     * 将文本中的链接替换为A标签
     * @param {String} content
     * @param {Boolean=} needWrap - 是否将换行符转化为<br>, 默认false
     * @param {String=} className - 标签的class，默认不设置
     * @returns {string|XML|*}
     */
    function convertLinkToHtmlTag(content, needWrap, className) {
        (needWrap === undefined || needWrap === null) && (needWrap = false);
        if (!content) {
            return content;
        }
        // 补全标签
        content = $("<div/>").html(content).html();
        // 将链接转化为a标签
        var reMap = {};
        var replacementIndex = 0;
        content = content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>|<(a|img|iframe|embed|video|audio)[\s\S]*?>/gi, function (match) {
            var key = "【$RE_(*&$_MATCH_^_REPACEMENT_%$_" + (replacementIndex++) + "】"; // 首尾中文符号，避开[\x21-\x7e]更合适
            reMap[key] = match;
            return key;
        });
        content = content.replace(/(https?:\/\/[a-z0-9\.:]+(\/[\x21-\x7e]*)?(\?[\x21-\x7e]*)?)/gi, function (match, url) {
            return '<a' + (className ? (' class="' + className + '"') : '') + ' target="_blank" href="' + url + '">' + url + '</a>';
        });
        for (var reKey in reMap) {
            content = content.replace(reKey, reMap[reKey]);
        }
        if (needWrap) {
            content = "<p>" + content.replace(/\n/g, "</p><p>") + "</p>"
        }
        return content;
    }

    /**
     * 将文本中的图片链接替换为IMG标签
     * @param {String} content
     * @param {String=} className - 标签的class，默认不设置
     * @param {Boolean=} setNotOnlyImgClass - 是否当全部内容仅仅只是一个图片链接时, 设置一个为not-only-img的class, 默认false
     * @returns {string|XML|*}
     */
    function convertImageLinkToHtmlTag(content, className, setNotOnlyImgClass) {
        (setNotOnlyImgClass === undefined || setNotOnlyImgClass === null) && (setNotOnlyImgClass = false);
        if (!content) {
            return content;
        }
        // 补全标签
        content = $("<div/>").html(content).html();
        // 将图片链接转化为img标签
        var reMap = {};
        var replacementIndex = 0;
        content = content.replace(/<script[\s\S]*?>[\s\S]*?<\/script>|<(a|img|iframe|embed|video|audio)[\s\S]*?>/gi, function (match) {
            var key = "【$RE_(*&$_MATCH_^_REPACEMENT_%$_" + (replacementIndex++) + "】"; // 首尾中文符号，避开[\x21-\x7e]更合适
            reMap[key] = match;
            return key;
        });
        content = content.replace(/(https?:\/\/[a-z0-9\.:]+\/[\x21-\x7e]*\.(gif|jpe?g|png|bmp|svg|ico)(\?[\x21-\x7e]*)?)/gi, function (match, url) {
            if (setNotOnlyImgClass && content != url) {
                return '<img class="' + (className ? (className + ' ') : '') + 'not-only-img" src="' + match + '">';
            } else {
                return '<img' + (className ? (' class="' + className + '"') : '') + ' src="' + match + '">';
            }
        });
        for (var reKey in reMap) {
            content = content.replace(reKey, reMap[reKey]);
        }
        if (setNotOnlyImgClass && /^\s*<img[^>]*?>\s*$/.test(content)) {
            content = content.replace(/\s*not-only-img/gi, "");
        }
        return content;
    }

    /**
     * 格式化JSON源码(对象转换为JSON文本)
     * @param txt
     * @param {Boolean} compress - 是否为压缩模式
     * @returns {string=}
     */
    var formatJson = function format(txt, compress) {
        if (typeof txt == "string") {
            if (/^\s*$/.test(txt)) {
                toastr.error('数据为空,无法格式化! ');
                return;
            }
            try {
                var data = eval('(' + txt + ')');
            } catch (e) {
                toastr.error('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
                return;
            }
        } else if (typeof txt == "object") {
            var data = txt;
        } else {
            return;
        }
        var indentChar = '    ';
        var draw = [], last = false, This = this, line = compress ? '' : '\r\n', nodeCount = 0, maxDepth = 0;

        var notify = function (name, value, isLast, indent/*缩进*/, formObj) {
            nodeCount++;
            // 节点计数
            for (var i = 0, tab = ''; i < indent; i++)tab += indentChar;
            // 缩进HTML
            tab = compress ? '' : tab;
            // 压缩模式忽略缩进
            maxDepth = ++indent;
            // 缩进递增并记录
            if (value && value.constructor == Array) { // 处理数组
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line);
                // 缩进'[' 然后换行
                for (var i = 0; i < value.length; i++)
                    notify(i, value[i], i == value.length - 1, indent, false);
                draw.push(tab + ']' + (isLast ? line : (',' + line)));
                // 缩进']'换行,若非尾元素则添加逗号
            } else if (value && typeof value == 'object') { // 处理对象
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line);
                // 缩进'{' 然后换行
                var len = 0, i = 0;
                for (var key in value)len++;
                for (var key in value)notify(key, value[key], ++i == len, indent, true);
                draw.push(tab + '}' + (isLast ? line : (',' + line)));
                // 缩进'}'换行,若非尾元素则添加逗号
            } else {
                if (typeof value == 'string') value = '"' + value + '"';
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
            }
        };
        var isLast = true, indent = 0;
        notify('', data, isLast, indent, false);
        return draw.join('');
    };

    // div 自适应高度
    $.fn.autoTextareaHeight = function (options) {
        var defaults = {
            maxHeight: null,//文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
            minHeight: $(this).height(), //默认最小高度，也就是文本框最初的高度，当内容高度小于这个高度的时候，文本以这个高度显示
            runOnce: false // false 为绑定事件 true 为 计算一次高度，不绑定事件
        };
        var opts = $.extend({}, defaults, options);
        var updateHeight = function () {
            var height, style = this.style;
            this.style.height = opts.minHeight + 'px';
            if (this.scrollHeight >= opts.minHeight) {
                if (opts.maxHeight && this.scrollHeight > opts.maxHeight) {
                    height = opts.maxHeight;
                    style.overflowY = 'scroll';
                } else {
                    height = this.scrollHeight;
                    style.overflowY = 'hidden';
                }
                style.height = height + 'px';
            }
        };
        if (opts.runOnce) {
            $(this).each(function () {
                updateHeight.call(this);
            });
        } else {
            $(this).each(function () {
                $(this).bind("input paste cut keydown keyup focus blur", function () {
                    updateHeight.call(this);
                });
            });
        }
    };

    /**
     * 把新添加的事件Event，添加到队列的第一个位置，调整执行顺序
     *
     * @param {String} eventType - 事件名称
     * @param {Object|Function} eventData 数据或处理函数
     * @param {Function=} handler eventData有值时选填
     * @returns {*}
     */
    $.fn.onfirst = function (eventType, eventData, handler) {
        var indexOfDot = eventType.indexOf(".");
        var eventNameSpace = indexOfDot > 0 ? eventType.substring(indexOfDot) : "";
        eventType = indexOfDot > 0 ? eventType.substring(0, indexOfDot) : eventType;
        handler = handler == undefined ? eventData : handler;
        eventData = typeof eventData == "function" ? {} : eventData;
        return this.each(function () {
            var $this = $(this);
            var currentAttrListener = this["on" + eventType];
            if (currentAttrListener) {
                $this.bind(eventType, function (e) {
                    return currentAttrListener(e.originalEvent);
                });
                this["on" + eventType] = null;
            }
            $this.bind(eventType + eventNameSpace, eventData, handler);
            var allEvents = $this.data("events") || $._data($this[0], "events");
            var typeEvents = allEvents[eventType];
            var newEvent = typeEvents.pop();
            typeEvents.unshift(newEvent);
        });
    };


    /**
     * 判断元素是否在出现在可见区域内
     *
     * @param element
     * @param {Number=} ON_SCREEN_HEIGHT  用来设置元素出现在屏幕中 N px的条件，也就是这里的ON_SCREEN_HEIGHT。只要保证元素的上下左右四个边界都在屏幕内显示超过npx，我们就可以认为元素出现在页面中了。
     * @param {Number=} ON_SCREEN_WIDTH
     * @returns {boolean}
     */
    var isOnScreen = function (element, ON_SCREEN_HEIGHT, ON_SCREEN_WIDTH) {
        var ON_SCREEN_HEIGHT = ON_SCREEN_HEIGHT || 20;
        var ON_SCREEN_WIDTH = ON_SCREEN_WIDTH || 20;

        var rect = element.getBoundingClientRect();
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        var windowWidth = window.innerWidth || document.documentElement.clientWidth;

        var elementHeight = element.offsetHeight;
        var elementWidth = element.offsetWidth;

        var onScreenHeight = ON_SCREEN_HEIGHT > elementHeight ? elementHeight : ON_SCREEN_HEIGHT;
        var onScreenWidth = ON_SCREEN_WIDTH > elementWidth ? elementWidth : ON_SCREEN_WIDTH;

        // 元素在屏幕上方
        var elementBottomToWindowTop = rect.top + elementHeight;
        var bottomBoundingOnScreen = elementBottomToWindowTop >= onScreenHeight;

        // 元素在屏幕下方
        var elementTopToWindowBottom = windowHeight - (rect.bottom - elementHeight);
        var topBoundingOnScreen = elementTopToWindowBottom >= onScreenHeight;

        // 元素在屏幕左侧
        var elementRightToWindowLeft = rect.left + elementWidth;
        var rightBoundingOnScreen = elementRightToWindowLeft >= onScreenWidth;

        // 元素在屏幕右侧
        var elementLeftToWindowRight = windowWidth - (rect.right - elementWidth);
        var leftBoundingOnScreen = elementLeftToWindowRight >= onScreenWidth;

        return bottomBoundingOnScreen && topBoundingOnScreen && rightBoundingOnScreen && leftBoundingOnScreen;
    };

    /**
     *  用JS实现EL表达式功能，默认支持 " "、{ }、${ }、“”包裹，
     *  可通过设置 sepLeft，sepRight 自定义, 如果想自定义匹配正则，那么设置sepLeft为你需要的正则
     *  不允许嵌套
     *  eg:
     *  <pre>
     *  var str = "path:\"Jeffrey\";name:{Jeffrey},attr:${Jeffrey},desc:“Jeffrey”";
     *  var result = replaceByEL(str, function(index, key){
     *      return "replace_" + key + "_" + index;
     *  });
     *  result: "path:replace_Jeffrey_1;name:replace_Jeffrey_2,attr:replace_Jeffrey_3,desc:replace_Jeffrey_4" </pre>
     * @author Jeffrey.deng
     * @param {String} str
     * @param {Function} replace 替换函数，将匹配到的表达式替换成你想要的
     * @param {String|RegExp=} sepLeft - 自定义分隔符左，特殊字符自己转义（分割符前面加“\\”）, 如果想自定义匹配正则，那么设置sepLeft为你需要的正则
     * @param {String=} sepRight - 自定义分隔符右，特殊字符自己转义, 如果想自定义匹配正则，那么设置sepRight为不需要设置
     * @returns {string}
     */
    var replaceByEL = function (str, replace, sepLeft, sepRight) {
        if (!str) {
            return str;
        }
        var regex = null;
        if (sepLeft && sepLeft instanceof RegExp) {
            regex = sepLeft;
        } else if (sepLeft && sepRight) {
            regex = new RegExp(sepLeft + "([\s\S]*?)" + sepRight, "g")
        } else {
            regex = /\$\{([\s\S]*?)\}|\{([\s\S]*?)\}|"([\s\S]*?)"|“([\s\S]*?)”|”([\s\S]*?)“/g;
        }
        var result;
        var lastMatchEndIndex = 0;
        var partArr = [];
        var key = "";
        var keyIndex = 0;
        while ((result = regex.exec(str)) != null) {
            for (var i = 1; i < result.length; i++) {
                if (result[i] != undefined) {
                    key = result[i].trim();
                    break;
                }
            }
            partArr.push(str.substring(lastMatchEndIndex, result.index) + replace.call(result, ++keyIndex, key));
            lastMatchEndIndex = regex.lastIndex;
        }
        if (lastMatchEndIndex > 0 && lastMatchEndIndex < str.length) {
            partArr.push(str.substring(lastMatchEndIndex));
        }
        return keyIndex == 0 ? str : partArr.join('');
    };

    /*  Class: TaskQueue
     *  Constructor: handler
     *      takes a function which will be the task handler to be called,
     *      handler should return Deferred object(not Promise), if not it will run immediately;
     *  methods: append
     *      appends a task to the Queue. Queue will only call a task when the previous task has finished
     *  @author Jeffrey.deng
     */
    var TaskQueue = function (handler) {
        var tasks = [];
        // empty resolved deferred object
        var deferred = $.when();

        // handle the next object
        function handleNextTask() {
            // if the current deferred task has resolved and there are more tasks
            if (deferred.state() == "resolved" && tasks.length > 0) {
                // grab a task
                var task = tasks.shift();
                // set the deferred to be deferred returned from the handler
                deferred = handler(task);
                // if its not a deferred object then set it to be an empty deferred object
                if (!(deferred && deferred.promise)) {
                    deferred = $.when();
                }
                // if we have tasks left then handle the next one when the current one
                // is done.
                if (tasks.length >= 0) {
                    deferred.fail(function () {
                        tasks = [];
                        return;
                    });
                    deferred.done(handleNextTask);
                }
            }
        }

        // appends a task.
        this.append = function (task) {
            // add to the array
            tasks.push(task);
            // handle the next task
            handleNextTask();
        };
    };

    var ajaxDownload = function (url, callback, args, tryTimes) {
        // new Promise(function (resolve, reject) {
        //     resolve(xhr.response);
        // }).then(function (blob) {
        //     callback(blob);
        // });
        tryTimes = tryTimes || 0;
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = "blob";
            xhr.onreadystatechange = function (evt) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 304 || xhr.status === 0) {
                        callback(xhr.response, args);
                    } else {
                        if (tryTimes++ == 3) {
                            callback(null, args);
                        } else {
                            ajaxDownload(url, callback, args, tryTimes);
                        }
                    }
                }
            };
            xhr.send();
        } catch (e) {
            if (tryTimes++ == 3) {
                console.warn("url: " + url + " 下载失败，exception: ", e);
                callback(null, null);
            } else {
                console.warn("url: " + url + " 下载失败，重试中，exception: ", e);
                ajaxDownload(url, callback, args, tryTimes);
            }
        }
    };

    var fileNameFromHeader = function (disposition, url) {
        if (disposition && /filename=(.*)/i.test(disposition)) {
            return decodeURI(RegExp.$1);
        }
        return url.substring(url.lastIndexOf('/') + 1);
    };

    var downloadBlobFile = function (content, fileName) {
        // saveAs(content, fileName);
        if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(content, fileName);
        } else {
            var aLink = document.createElement('a');
            aLink.download = fileName;
            aLink.target = "_blank";
            aLink.style.display = "none";
            var blob = new Blob([content]);
            aLink.href = window.URL.createObjectURL(blob);
            document.body.appendChild(aLink);
            if (document.all) {
                aLink.click(); //IE
            } else {
                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", true, true);
                aLink.dispatchEvent(evt); // 其它浏览器
            }
            window.URL.revokeObjectURL(aLink.href);
            document.body.removeChild(aLink);
        }
    };

    var downloadUrlFile = function (url, fileName) {
        var aLink = document.createElement('a');
        if (fileName) {
            aLink.download = fileName;
        } else {
            aLink.download = url.substring(url.lastIndexOf('/') + 1);
        }
        aLink.target = "_blank";
        aLink.style.display = "none";
        aLink.href = url;
        document.body.appendChild(aLink);
        if (document.all) {
            aLink.click(); //IE
        } else {
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            aLink.dispatchEvent(evt); // 其它浏览器
        }
        document.body.removeChild(aLink);
    };

    var zipRemoteFilesAndDownload = function (ZipObject, config) {
        var JSZip = ZipObject;
        var options = {
            "isNeedConfirmDownload": true,
            "useQueueDownloadThreshold": 0,
            "suffix": null,
            "callback": {
                "parseLocationInfo_callback": function (location_info, options) {
                    return parseURL(document.location.href);
                },
                "parseFiles_callback": function (location_info, options) {
                    // file.url file.folder_sort_index
                    // not folder_sort_index -> use fileName
                    var files = [];
                    return files;
                },
                "makeNames_callback": function (arr, location_info, options) {
                    var names = {};
                    var time = new Date().getTime();
                    names.zipName = "pack_" + time;
                    names.folderName = names.zipName;
                    names.infoName = null;
                    names.infoValue = null;
                    names.prefix = time;
                    names.suffix = options.suffix;
                    return names;
                },
                "beforeFilesDownload_callback": function (files, names, location_info, options, zip, main_folder) {
                },
                "eachFileOnload_callback": function (blob, file, location_info, options, zipFileLength, zip, main_folder, folder) {
                },
                "allFilesOnload_callback": function (files, names, location_info, options, zip, main_folder) {
                },
                "beforeZipFileDownload_callback": function (zip_blob, files, names, location_info, options, zip, main_folder) {
                    downloadBlobFile(zip_blob, names.zipName + ".zip");
                }
            }
        };

        var ajaxDownloadAndZipFiles = function (files, names, location_info, options) {
            var notify_start = toastr.success("正在打包～", names.zipName, {
                "progressBar": false,
                "hideDuration": 0,
                "showDuration": 0,
                "timeOut": 0,
                "closeButton": false
            });
            if (files && files.length > 0) {
                var zip = new JSZip();
                var main_folder = zip.folder(names.folderName);
                var zipFileLength = 0;
                var maxIndex = files.length;
                var paddingZeroLength = (files.length + "").length;
                if (names.infoName) {
                    main_folder.file(names.infoName, names.infoValue);
                }
                options.callback.beforeFilesDownload_callback(files, names, location_info, options, zip, main_folder);
                var downloadFile = function (file, resolveCallback) {
                    ajaxDownload(file.url, function (blob, file) {
                        var folder = file.location ? main_folder.folder(file.location) : main_folder;
                        var isSave = options.callback.eachFileOnload_callback(blob, file, location_info, options, zipFileLength, zip, main_folder, folder);
                        if (isSave != false) {
                            if (file.fileName) {
                                folder.file(file.fileName, blob);
                            } else {
                                var suffix = names.suffix || file.url.substring(file.url.lastIndexOf('.') + 1);
                                file.fileName = names.prefix + "_" + paddingZero(file.folder_sort_index, paddingZeroLength) + "." + suffix;
                                folder.file(file.fileName, blob);
                            }
                        }
                        zipFileLength++;
                        notify_start.find(".toast-message").text("正在打包～ 第 " + zipFileLength + " 张");
                        resolveCallback && resolveCallback();   // resolve延迟对象
                        if (zipFileLength >= maxIndex) {
                            options.callback.allFilesOnload_callback(files, names, location_info, options, zip, main_folder);
                            zip.generateAsync({type: "blob"}).then(function (content) {
                                options.callback.beforeZipFileDownload_callback(content, files, names, location_info, options, zip, main_folder);
                            });
                            toastr.remove(notify_start, true);
                            toastr.success("下载完成！", names.zipName, {"progressBar": false});
                        }
                    }, file);
                };
                if (maxIndex < options.useQueueDownloadThreshold) {
                    // 并发数在useQueueDownloadThreshold内，直接下载
                    for (var i = 0; i < maxIndex; i++) {
                        downloadFile(files[i]);
                    }
                } else {
                    // 并发数在useQueueDownloadThreshold之上，采用队列下载
                    var queue = new TaskQueue(function (file) {
                        if (file) {
                            var dfd = $.Deferred();
                            downloadFile(file, function () {
                                dfd.resolve();
                            });
                            return dfd;
                        }
                    });
                    for (var j = 0; j < maxIndex; j++) {
                        queue.append(files[j]);
                    }
                }
            } else {
                toastr.remove(notify_start, true);
                toastr.error("未解析到图片！", "错误", {"progressBar": false});
            }
        };

        try {
            options = $.extend(true, options, config);
            var location_info = options.callback.parseLocationInfo_callback(options);
            var files = options.callback.parseFiles_callback(location_info, options);
            if (!(files && files.promise)) {
                files = $.when(files);
            }
            files.done(function (files) {
                if (files && files.length > 0) {
                    if (!options.isNeedConfirmDownload || confirm("是否下载 " + files.length + " 个文件")) {
                        var names = options.callback.makeNames_callback(files, location_info, options);
                        ajaxDownloadAndZipFiles(files, names, location_info, options);
                    }
                } else {
                    toastr.error("未找到图片~", "");
                }
            }).fail(function (text) {
                toastr.error(text, "程序放弃下载");
            });
        } catch (e) {
            console.warn("批量下载照片 出现错误！, exception: ", e);
            toastr.error("批量下载照片 出现错误！", "");
        }
    };

    /**
     * 上传贴图
     * @param {Array}images
     * @param {String}classNames
     * @param {Function}call
     */
    var postImage = function (images, classNames, call) {
        var uploadNotifyElement = context.notify({
            "progressBar": false,
            "hideDuration": 0,
            "showDuration": 0,
            "timeOut": 0,
            "closeButton": false,
            "iconClass": "toast-success-no-icon",
            "hideOnHover": false
        }).success("正在上传第 1 张~", "", "notify_post_image_uploading");
        var imageArr = [];
        var imageHtml = "";
        var taskQueue = new context.TaskQueue(function (task) {
            var dfd = $.Deferred();
            var formData = new FormData();
            formData.append("file", task.file);
            uploadNotifyElement.find(".toast-message").text("正在上传第 " + (task.index + 1) + " 张~");
            $.ajax({
                url: "cloud.api?method=postImage",
                data: formData,
                type: "POST",
                contentType: false,
                cache: false,
                processData: false,
                success: function (response) {
                    if (response.status == 200) {
                        var data = response.data;
                        imageArr.push(data);
                        imageHtml += '<img ' + (classNames ? ('class="' + classNames + '" ') : "") + 'src="' + data.image_cdn_path +
                            '" data-raw-width="' + data.raw_width + '" data-raw-height="' + data.raw_height + '" data-relative-path="' + data.image_path + '">\n';
                        // imageHtml += config.path_params.cloudPath + data.image_path + "\n";
                        dfd.resolve();
                    } else {
                        dfd.reject(response.message);
                        toastr.error(response.message, "错误", {"progressBar": false});
                        console.warn("Error Code: " + response.status);
                    }
                    if ((response.status != 200 || task.isLastOne) && imageHtml) {
                        context.removeNotify("notify_post_image_uploading");
                        call(imageHtml, imageArr, response.status == 200);
                    }
                },
                error: function (XHR, TS) {
                    context.removeNotify("notify_post_image_uploading");
                    dfd.reject(TS);
                    toastr.error(TS, "错误", {"progressBar": false});
                    console.warn("Error Code: " + TS);
                }
            });
            return dfd;
        });
        $.each(images, function (i, file) {
            taskQueue.append({
                "file": file,
                "isLastOne": (i == (images.length - 1)),
                "index": i
            });
        });
    };

    /**
     * 提示通知
     * @type {{}}
     */
    var notifyPool = {};

    var notifyObject = (function () {
        var notify_options = {};
        var context = {
            "config": function (json) {
                notify_options = $.extend(true, {}, json);
                return context;
            },
            "default": function (json) {
                json && toastr.options(json);
            },
            "lastNotifyName": null,
            "success": function (content, title, notifyName) {
                context.lastNotifyName = notifyName = notifyName || "default";
                var toastElement = toastr.success(content, title, notify_options).attr("data-name", notifyName);
                notifyPool[notifyName] = toastElement;
                return toastElement;
            },
            "error": function (content, title, notifyName) {
                context.lastNotifyName = notifyName = notifyName || "default";
                var toastElement = toastr.error(content, title, notify_options).attr("data-name", notifyName);
                notifyPool[notifyName] = toastElement;
                return toastElement;
            },
            "info": function (content, title, notifyName) {
                context.lastNotifyName = notifyName = notifyName || "default";
                var toastElement = toastr.info(content, title, notify_options).attr("data-name", notifyName);
                notifyPool[notifyName] = toastElement;
                return toastElement;
            }
        };
        return context;
    })();

    /**
     * 返回通知对象
     * @param {Object|Boolean} options - json为配置，boolean设置为true则为继承上次通知配置
     * @returns notifyObject - {config, default, lastNotifyName, success, error, info}
     */
    var notify = function (options) {
        var extendLast = (typeof options == "boolean" ? options : false);
        if (!extendLast) {
            if (options) {
                notifyObject.config(options);
            } else {
                notifyObject.config({});
            }
        }
        return notifyObject;
    };

    /**
     * 移除通知
     * @param notifyName 为空则删除所有通知
     */
    var removeNotify = function (notifyName) {
        if (!notifyName) {
            notifyPool = {};
            toastr.clear();
        } else if (notifyPool.hasOwnProperty(notifyName)) {
            if (notifyPool[notifyName]) {
                toastr.remove(notifyPool[notifyName], true);
            }
            delete notifyPool[notifyName];
        }
        $('#toast-container').find('.toast[data-name="' + notifyName + '"]').each(function (i, toastElement) {
            toastr.remove($(toastElement), true);
        });
    };

    /**
     * 得到通知jquery对象
     * @param {String} notifyName
     * @param {Boolean=} force
     *  - 为true利用jquery选择器查找，100%查到所有的，可能返回多个（notifyName名称相同）
     *  - 为false从记录中查找，只会返回一个
     *  - 两个都会删除隐藏的通知对象
     * @returns {*}
     */
    var getNotify = function (notifyName, force) {
        if (force) {
            var toastElements = $('#toast-container').find('.toast[data-name="' + notifyName + '"]').filter(function (toastElement, i) {
                if ($(toastElement).is(':visible')) {
                    return true;
                } else {
                    toastr.remove($(toastElement), true);
                    return false;
                }
            });
            return toastElements.length != 0 ? toastElements : null;
        } else {
            var notify = notifyPool[notifyName];
            if (notify && !force && !notify.is(':visible')) {
                notify = null;
                delete notifyPool[notifyName];
                toastr.remove(notify, true);
            }
            return notify;
        }
    };

    /**
     * 客户端本地配置
     * @param {String|Object=} module - 模块名称，当取所有配置时，此处可填所有配置的默认值
     * @param {Object=} defaultValue - module模块的默认值
     * @returns {*} 当module为传入的模块名称时，返回该模块配置；当module传入的是所有配置默认值或为空时，返回所有配置；
     */
    var getLocalConfig = function (module, defaultValue) {
        if (config_upgrade_start && !config_upgrade_completed) {
            if (!getNotify("notify_upgrade_config")) {
                notify({
                    "progressBar": false,
                    "timeOut": 10000,
                    "onclick": function () {
                        document.location.href = document.location.href;
                    }
                }).info("刷新页面应用新配置~", "Upgraded new local config", "notify_upgrade_config");
            }
            return (typeof module == "string") ? defaultValue : (module || {});
        }
        var localConfig = localStorage.getItem("blog_local_config");
        if (!localConfig) {
            localConfig = {};
            localStorage.setItem("blog_local_config", JSON.stringify(localConfig));
        } else {
            localConfig = JSON.parse(localConfig);
        }
        if (defaultValue) {
            localConfig[module] = $.extend(true, defaultValue, localConfig[module]);
            localStorage.setItem("blog_local_config", JSON.stringify(localConfig));
        } else if (typeof module == "object") {
            localConfig = $.extend(true, module, localConfig);
            localStorage.setItem("blog_local_config", JSON.stringify(localConfig));
        }
        return (typeof module == "string") ? localConfig[module] : localConfig;
    };

    /**
     * 保存配置
     * @param moduleName
     * @param moduleValue
     */
    var setLocalConfig = function (moduleName, moduleValue) {
        var localConfig = getLocalConfig();
        if (typeof moduleName == "string") {
            if (localConfig[moduleName]) {
                localConfig[moduleName] = $.extend(true, localConfig[moduleName], moduleValue);
            } else {
                localConfig[moduleName] = moduleValue;
            }
            localStorage.setItem("blog_local_config", JSON.stringify(localConfig));
        } else if (typeof moduleName == "object") {
            $.extend(true, localConfig, moduleName);
            localStorage.setItem("blog_local_config", JSON.stringify(localConfig));
        }
    };

    var context = {
        "extendNonNull": extendNonNull,
        "cookieUtil": cookieUtil,
        "parseURL": parseURL,
        "removeParamForURL": removeParamForURL,
        "setParamForURL": setParamForURL,
        "addStyle": addStyle,
        "encodeHTML": encodeHTML,
        "decodeHTML": decodeHTML,
        "canvasDataURL": canvasDataURL,
        "convertBase64UrlToBlob": convertBase64UrlToBlob,
        "convertRadix62to10": convertRadix62to10,
        "convertRadix10to62": convertRadix10to62,
        "formatDate": formatDate,
        "paddingZero": paddingZero,
        "convertLinkToHtmlTag": convertLinkToHtmlTag,
        "convertImageLinkToHtmlTag": convertImageLinkToHtmlTag,
        "formatJson": formatJson,
        "isOnScreen": isOnScreen,
        "replaceByEL": replaceByEL,
        "TaskQueue": TaskQueue,
        "ajaxDownload": ajaxDownload,
        "fileNameFromHeader": fileNameFromHeader,
        "downloadBlobFile": downloadBlobFile,
        "downloadUrlFile": downloadUrlFile,
        "zipRemoteFilesAndDownload": zipRemoteFilesAndDownload,
        "postImage": postImage,
        "notify": notify,
        "removeNotify": removeNotify,
        "getNotify": getNotify,
        "getLocalConfig": getLocalConfig,
        "setLocalConfig": setLocalConfig
    };


    // 检查是否需要升级配置
    var config_upgrade_start = false;
    var config_upgrade_completed = false; // 配置应用完成标记
    var require_node = document.getElementById("require_node");
    if (require_node) {
        var urlArgs = require_node.getAttribute("urlArgs");
        var last_upgrade_url = localStorage.getItem("blog_last_upgrade_url");
        if (urlArgs && last_upgrade_url != urlArgs) {
            config_upgrade_start = true;
            // js等主线程执行完成才会执行异步线程，既在这之前需要"阻止"网页在加载新配置完成之前使用旧配置
            $.ajax({
                "type": "GET",
                "url": "site.api?method=getConfigUpgrade",
                "global": false,    // 去掉全局事件
                "success": function (response) {
                    if (response.status == 200 && typeof response.data.config == "object") {
                        var config = response.data.config;
                        var localConfig = JSON.parse(localStorage.getItem("blog_local_config") || "{}");
                        var needUpgrade = config.version > (localConfig.version || "0");    // 版本是否需要升级
                        if (needUpgrade) {
                            if (config.force == true) {
                                localStorage.setItem("blog_local_config", JSON.stringify(config));
                            } else {
                                config.force = false;
                                setLocalConfig(config);
                            }
                        }
                        localStorage.setItem("blog_last_upgrade_url", urlArgs);
                        config_upgrade_completed = true;
                        var info = getNotify("notify_upgrade_config");
                        if (info && needUpgrade) {
                            info.find(".toast-message").html("刷新页面应用新配置 <b>v" + config.version + "</b> ~");
                        } else {
                            removeNotify("notify_upgrade_config");  // 不是新版本
                        }
                    } else {
                        // 如果加载失败
                        removeNotify("notify_upgrade_config");
                        config_upgrade_completed = true;
                        if (response.status != 404) {
                            console.warn("Error Code: " + response.status);
                            notify({
                                "progressBar": false,
                                "timeOut": 10000,
                                "onclick": function () {
                                    document.location.href = document.location.href;
                                }
                            }).error("刷新页面恢复旧配置~", "升级新配置失败", "notify_upgrade_config_fail");
                        }
                    }
                },
                "error": function (XHR, textStatus) {
                    removeNotify("notify_upgrade_config");
                    config_upgrade_completed = true;
                    console.warn("Error Code: " + textStatus);
                    notify({
                        "progressBar": false,
                        "timeOut": 10000,
                        "onclick": function () {
                            document.location.href = document.location.href;
                        }
                    }).error("刷新页面恢复旧配置~", "升级新配置失败/" + textStatus, "notify_upgrade_config_fail");
                }
            });
        }
    }

    return context;
});