var jck = Ext.ns("GTP.JsCheck");

//检查号码是否符合规范，包括长度，类型
jck.isCardNo = function (s) {
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(s) === false) {
        return false;
    }
    return true;
};

//获得字符串实际长度，中文2，英文1
//<param name="s">要获得长度的字符串</param>
jck.getLength = function (s) {
    var l = 0, len = s.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = s.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) l += 1;
        else l += 2;
    }
    return l;
};


jck.IsURL = function (str_url) {
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
  + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@  
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
        + "|" // 允许IP和DOMAIN（域名） 
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
        + "[a-z]{2,6})" // first level domain- .com or .museum  
        + "(:[0-9]{1,4})?" // 端口- :80  
        + "((/?)|" // a slash isn't required if there is no file name  
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re = new RegExp(strRegex);
    //re.test() 
    if (re.test(str_url)) {
        return (true);
    } else {
        return (false);
    }
}

//限制字符只能是中文、字母、数字、_、$、.、@、-、(、)、顿号、*、空格、·、#、全角字符
//<param name="s">要判断的字符串</param>
jck.isLimitString = function (s) {
    var reg = /^[\u4e00-\u9fa5\w_\$\.\@\-\(\)\【\】\ \*\、\#\·\uFF00-\uFFFF]*$/g;
    //var reg = /^[^'\\]+$/
    if (reg.test(s) === false) {
        return false;
    }
    return true;
};

//限制字符只能是中文、英文、数字、_、$、.、-、(、)、【、】、顿号、*
//用户帐号限制
jck.isLimitAccount = function (s) {
    var reg = /^[\u4e00-\u9fa5\w_\$\.\-\(\)\【\】\*\、\uFF00-\uFFFF]*$/g;
    if (reg.test(s) === false) {
        return false;
    }
    return true;
};

//限制字符只能是英文、数字、下划线、减号、“@”、“.”、"【"、"】"、“$”
//用户帐号限制
jck.isLimitPinYin = function (s) {
    var reg = /^[a-zA-Z0-9\w_\@\$\.\-\(\)\【\】\*\、\uFF00-\uFFFF]*$/g;
    if (reg.test(s) === false) {
        return false;
    }
    return true;
};

//验证电子邮箱
jck.checkEmail = function (s) {
    var reg = /^([a-zA-Z0-9\_\-\.])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,10}){1,9})$/;
    if (reg.test(s) === false) {
        return false;
    }
    return true;
};

//获取URL传入参数值
jck.QueryString = function (Name, LocationSearch) {
    var sValue = null;
    if (LocationSearch == null)
        sValue = location.search.match(new RegExp("[\?\&]" + Name + "=([^\&]*)(\&?)", "i"));
    else
        sValue = LocationSearch.match(new RegExp("[\?\&]" + Name + "=([^\&]*)(\&?)", "i"));
    return sValue ? sValue[1] : sValue;
};

//电话号码验证
jck.checkPhoneNumber = function (s) {
    //var reg = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
    var reg = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)){1,12})+$/;
    if (reg.test(s) === false) {
        return false;
    }
    return true;
};


jck.checkIsNumber = function (s) {
    //var reg = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
    var reg = /^\d+$/;
    if (reg.test(s) === false) {
        return false;
    }
    return true;
};

jck.checkIP = function (str) { //IP正则表达式
    IP = '(25[0-5]|2[0-4]\\d|1\\d\\d|\\d\\d|\\d)';
    IPdot = IP + '\\.';
    isIPaddress = new RegExp('^' + IPdot + IPdot + IPdot + IP + '$');
    //验证IP，返回结果
    return (isIPaddress.test(str));
}

//截取字符串
jck.subString = function (str, length, left) {
    var len = this.getLength(str);
    if (len <= length) return str;
    var t1 = str.replace(/([\u0391-\uffe5])/ig, '$1a');
    var idx = (left === false) ? (len - length) : 0;
    var idxEnd = (left === false) ? len : length;
    var t2 = t1.substring(idx, idxEnd);
    return t3 = t2.replace(/([\u0391-\uffe5])a/ig, '$1');
};

///举例：alert(compareDate('2004-12-01','2004-05-02'));目前支持年－月－日这样的格式
///比较日期大小
///哪果第一个日期参数大于第二个日期参数返回值为true，返之返回false
jck.compareDate = function (DateOne, DateTwo) {

    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf("-"));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf("-") + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf("-"));

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf("-"));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf("-") + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf("-"));

    if (Date.parse(OneMonth + "/" + OneDay + "/" + OneYear) > Date.parse(TwoMonth + "/" + TwoDay + "/" + TwoYear)) {
        return true;
    }
    else {
        return false;
    }

}

///全角空格为12288，半角空格为32 
///其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248 
//半角转换为全角函数
jck.toDBC = function (txtstring) {
    var tmp = "";
    for (var i = 0; i < txtstring.length; i++) {
        var charC = txtstring.charCodeAt(i);
        if (charC == 32) {//空格
            tmp += String.fromCharCode(12288);
        }
        else if (charC < 127) {
            tmp += String.fromCharCode(charC + 65248);
        }
        else tmp += String.fromCharCode(charC);
    }
    return tmp;
}
jck.specialCharToDBC = function (txtstring) {
    var tmp = "";
    for (var i = 0; i < txtstring.length; i++) {
        var charC = txtstring.charCodeAt(i);
        if (charC == 32) {
            tmp += String.fromCharCode(12288);
        }
        else if (charC < 48 || charC > 57 && charC < 65 || charC > 90 && charC < 97 || charC > 122 && charC < 127) {
            tmp += String.fromCharCode(charC + 65248);
        }
        else tmp += String.fromCharCode(charC);
    }
    return tmp;
}
jck.limtCharToDBC = function (txtstring) {
    var tmp = "";
    for (var i = 0; i < txtstring.length; i++) {
        var charC = txtstring.charCodeAt(i);
        //        if (charC == 32) {//空格
        //            tmp += String.fromCharCode(12288);
        //        }
        //        else 
        if (charC == 39) {//“'”号
            tmp += String.fromCharCode(charC + 65248);
        }
        else tmp += String.fromCharCode(charC);
    }
    return tmp;
}

//全角转换为半角函数 
jck.toCDB = function (str) {
    var tmp = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        }
        else {
            tmp += String.fromCharCode(str.charCodeAt(i));
        }
    }
    return tmp
}

jck.TJsEncrypt = function (str) {
    var o = new Date().getMilliseconds();
    var a = Math.round(Math.random() * 14) + 1;
    var s = o + '#|,|#' + str;
    var len = s.length;
    var buf = '';
    for (var i = 0; i < len; i++) {
        var x = (s.charCodeAt(i) ^ a).toString(16);
        if (x.length == 1)
            x = '000' + x;
        else if (x.length == 2)
            x = '00' + x;
        else if (x.length == 3)
            x = '0' + x;
        buf += x;
    }
    return a.toString(16) + buf;
}

jck.TJsDecrypt = function (str) {
    if (str.length == 0)
        return "";
    var a = parseInt(str.substr(0, 1), 16);
    var len = str.length - 1;
    var buf = '';
    for (var i = 0; i < len; i += 4) {
        buf += String.fromCharCode(parseInt(str.substr(i + 1, 4), 16) ^ a);
    }
    var arr = buf.split('#|,|#');
    return arr[1];
}

﻿Ext.onReady(function () {
    var fnBanBackKey = function (e) {
        e = e || window.event;
        var elm = e.srcElement;
        if (e.keyCode == 8 && elm && elm.tagName.toUpperCase() == "INPUT" && elm.readOnly) {
            return false;
        }
    };
    var fnOld = document.onkeydown || document.onkeypress;
    var fnDoEvent = function (e) {
        var ban = (fnBanBackKey(e) === false);
        var ret;
        if (fnOld) {
            ret = fnOld(e);
        }
        if (ban) return false;
        else if (ret !== undefined) return ret;
    }
    if (document.onkeydown !== undefined && document.onkeydown !== fnDoEvent) {
        document.onkeydown = fnDoEvent;
    }
    else if (document.onkeypress !== undefined && document.onkeypress !== fnDoEvent) {
        document.onkeypress = fnDoEvent;
    }
});
Ext.ns("Gjs");
Ext.ns("Gjs.__Resource").Default = {
    Dlg_ErrorTitle: '出错',
    Dlg_WarningTitle: '警告',
    Dlg_QuestionTitle: '提示',
    Dlg_InfoTitle: '提示',
    Info_RequestFail: '请求失败。',
    Sta_Error: '出错',
    Sta_Failure: '失败',
    Sta_Timeout: '超时',
    Sta_Success: '成功',
    Sta_Complete: '完成',
    Sta_Cancel: '取消',
    Lab_More: '更多',
    Lab_FirstPage: '首页',
    Lab_PrevPage: '上页',
    Lab_NextPage: '下页',
    Lab_LastPage: '末页',
    Lab_PageSelect: '页 共{0}页',
    Lab_PageSelectTotal: '页 共{0}页/{1}条',
    Lab_DetailedRecPage: '当前{0}-{1} 共{2}条',
    Lab_Empty: '没有数据',
    Lab_PageAt: '第',
    Act_Close: '关闭',
    Act_Detailed: '详细',
    Lab_Waiting: '请稍候...',
    Vld_NotAllowBlank: '不允许为空.',
    Vld_MaxLength: '最大有效长度为',
    Vld_MinLength: '最小有效长度为',
    Vld_MaxValue: '最大有效值为',
    Vld_MinValue: '最小有效值为',
    Vld_Account: '仅允许包含英文、数字、"_"、"-"、"@"、".".'
};
Gjs.Res = function () {
    var _res;
    var _getSysLanFn = function () {
        return (window.GTPExtJsResourceLanguageLocale || navigator.systemLanguage || navigator.language || navigator.browserLanguage);
    };
    var _getAppLanFn = function () {
        return (Gjs.language || _getSysLanFn()).toLowerCase();
    };
    var _getRes = function () {
        var res = Gjs.resource;
        if (!res) {
            var lan = _getAppLanFn();
            if (lan.indexOf("en") == 0) res = Gjs.__Resource.EN;
            if (!res) res = Gjs.__Resource.Default;
        }
        return res;
    };
    return {
        isEnglish: function () {
            var lan = _getAppLanFn();
            return (lan.indexOf("en") == 0);
        },
        isSChinese: function () {
            var lan = _getAppLanFn();
            return (lan.indexOf("cn") == 0);
        },
        isTChinese: function () {
            var lan = _getAppLanFn();
            return (lan.indexOf("tw") == 0);
        },
        get: function (name) {
            if (!_res) _res = _getRes();
            return _res ? _res[name] : "";
        }
    };
} ();

Gjs.ScriptLoader = function () {
    var arr = new Array();
    var scriptParentNode;
    var fnBuildScriptTag = function (filename, fn) {
        if (!scriptParentNode) {
            if (!Ext.isEmpty(document.getElementsByTagName("head"))) {
                scriptParentNode = document.getElementsByTagName("head")[0];
            }
            else {
                scriptParentNode = document.body;
            }
        }
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = filename;
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    fn();
                }
            };
        }
        else {
            script.onload = fn;
            script.onerror = fn;
        }
        scriptParentNode.appendChild(script);
    };
    var fnFindScript = function (s) {
        var iLen = arr.length;
        var scriptNode;
        for (var i = 0; i < iLen; i++) {
            var n = arr[i];
            if (n.src == s) {
                scriptNode = n;
                break;
            }
        }
        return scriptNode;
    };
    var fnRegScript = function (s, fn) {
        var iLen = arr.length;
        var scriptNode = fnFindScript(s);
        if (!scriptNode) {
            var scriptNode = {
                src: s,
                state: 0,
                fnArr: [fn]
            };
            arr.push(scriptNode);
            fnBuildScriptTag([s], function () {
                scriptNode.state = 1;
                var iFnLen = scriptNode.fnArr.length;
                for (var i = 0; i < iFnLen; i++) {
                    var f = scriptNode.fnArr[i];
                    if (f) f.call();
                }
                scriptNode.fnArr.length = 0;
            });
        }
        else {
            if (scriptNode.state == 1) {
                if (fn) fn.call();
            }
            else {
                scriptNode.fnArr.push(fn);
            }
        }
        return scriptNode;
    };
    var fnCheckAllFileLoaded = function (list) {
        var ret = true;
        for (var i = 0; i < list.length; i++) {
            var n = fnFindScript(list[i]);
            if (!n || n.state == 0) {
                ret = false;
                break;
            }
        }
        return ret;
    };
    var fnLoadByOrder = function (list, fn, scope) {
        list._idx++;
        if (list._idx < list.length) {
            fnRegScript(list[list._idx], function () {
                fnLoadByOrder(list, fn);
            });
        }
        else {
            if (fn)
                fn.call(scope);
        }
    };
    var pub = {
        load: function (src, fn, preserveOrder, scope) {
            scope = scope || window;
            if (Ext.isArray(src)) {
                if (preserveOrder) {
                    src._idx = 0;
                    fnRegScript(src[0], function () {
                        fnLoadByOrder(src, fn, scope);
                    });
                }
                else {
                    for (var i = 0; i < src.length; i++) {
                        fnRegScript(src[i], function () {
                            var isOk = fnCheckAllFileLoaded(src);
                            if (isOk && fn) fn.call(scope);
                        });
                    }
                }
            }
            else {
                fnRegScript(src, function () {
                    fn.call(scope);
                });
            }
        }
    };
    return pub;
} ();

var $webAppPath, $webReqType, $webImgPath;
Gjs.getWebAppPath = function () {
    return $webAppPath || "";
};
Gjs.webReqType = function () {
    return $webReqType || null;
};
Gjs.getScriptPath = function () {
    var arr = document.getElementsByTagName("SCRIPT");
    var s = arr[arr.length - 1].src.replace(/\\/g, "/");
    return (s.lastIndexOf("/") < 0) ? "./" : s.substring(0, s.lastIndexOf("/")) + "/";
};
Gjs.scriptPath = Gjs.getScriptPath();
Gjs.commonPath = function () {
    var s = Gjs.scriptPath;
    var idx = s.lastIndexOf("Common/js/org/");
    return (idx > 0) ? s.substring(0, idx) + "Common/" : "./";
} ();
Gjs.deepSeek = function (obj, fn) {
    var _ds = Gjs.Util.deepSeek;
    if (Ext.isArray(obj)) for (var i = 0; i < obj.length; i++) _ds(obj[i], fn);
    else if (Ext.isObject(obj)) {
        for (var s in obj) {
            var attr = obj[s];
            if (fn(attr, obj, s) !== false && Ext.isObject(attr)) _ds(attr, fn);
        }
    }
};
Gjs.clone = function (source, properties, deepClone) {
    var _setAttribute = function (obj, property, value) {
        obj[property] = (deepClone && Ext.isObject(value)) ? _clone(value) : value;
    };
    var _clone = function (src, props) {
        var obj;
        if (Ext.isArray(src) && !Ext.isArray(props)) {
            obj = new Array();
            for (var i = 0; i < src.length; i++) obj[i] = (deepClone && Ext.isObject(src[i])) ? _clone(src[i]) : src[i];
        }
        else {
            obj = new Object();
            if (Ext.isArray(props)) for (var i = 0; i < props.length; i++) _setAttribute(obj, props[i], src[props[i]]);
            else for (var property in source) _setAttribute(obj, property, src[property]);
        }
        return obj;
    };
    return _clone(source, properties);
};
Gjs.EntityHelper = function () {
    var $HASH_FIELD = "__hash", $REFERENCE_FIELD = "__reference";
    var _isPoco = function (obj) {
        if (!Ext.isArray(obj)) return false;
        for (var i = 0; i < obj.length; i++) {
            var n = obj[i];
            var attr = n.Key;
            var value = n.Value;
            if (!attr || !Ext.isDefined(value)) return false;
        }
        return true;
    };
    var _isPocoArr = function (arr) {
        if (!Ext.isArray(arr)) return false;
        for (var i = 0; i < arr.length; i++) {
            var n = arr[i];
            if (!_isPoco(n)) return false;
        }
        return true;
    };
    var _decodePocoFn = function (poco) {
        if (!Ext.isArray(poco)) return null;
        var obj = {};
        for (var i = 0; i < poco.length; i++) {
            var n = poco[i];
            var attr = n.Key;
            var value = n.Value;
            if (!attr || !Ext.isDefined(value)) continue;
            var isPoco = _isPoco(value);
            if (isPoco) obj[attr] = _decodePocoFn(value);
            else if (_isPocoArr(value)) {
                var arr = new Array();
                for (var j = 0; j < value.length; j++) arr.push(_decodePocoFn(value[j]));
                obj[attr] = arr;
            }
            else obj[attr] = value;
        }
        return obj;
    };
    return {
        decodeEntityReference: function (data) {
            var hashIndex = {}, arrRefs = new Array();
            var _deepSeek = function (obj) {
                if (Ext.isArray(obj)) for (var i = 0; i < obj.length; i++) _deepSeek(obj[i]);
                else if (Ext.isObject(obj)) {
                    var hash = obj[$HASH_FIELD];
                    if (hash && !hashIndex["_" + hash]) hashIndex["_" + hash] = obj;
                    for (var s in obj) {
                        var attr = obj[s];
                        if (Ext.isArray(attr)) {
                            for (var i = 0; i < attr.length; i++) _deepSeek(attr[i]);
                        }
                        else if (Ext.isObject(attr)) {
                            var ref = attr[$REFERENCE_FIELD];
                            if (ref) {
                                if (hashIndex["_" + ref]) obj[s] = hashIndex["_" + ref];
                                else arrRefs.push({ obj: obj, attr: s, ref: ref });
                            }
                            else _deepSeek(attr);
                        }
                    }
                }
            };
            _deepSeek(data);
            for (var i = 0; i < arrRefs.length; i++) {
                var n = arrRefs[i];
                if (hashIndex["_" + n.ref]) n.obj[n.attr] = hashIndex["_" + n.ref];
            }
            return data;
        },
        encodeEntityReference: function (data) {
            var hashIndex = {};
            var _deepSeek = function (obj) {
                if (Ext.isArray(obj)) for (var i = 0; i < obj.length; i++) _deepSeek(obj[i]);
                else if (Ext.isObject(obj)) {
                    var hash = obj[$HASH_FIELD];
                    if (hash) hashIndex["_" + hash] = obj;
                    for (var s in obj) {
                        var attr = obj[s];
                        if (Ext.isObject(attr)) {
                            var ref = attr[$HASH_FIELD];
                            if (ref && hashIndex["_" + ref]) {
                                obj[s] = {};
                                obj[s][$REFERENCE_FIELD] = ref;
                            }
                            else _deepSeek(attr);
                        }
                    }
                }
            };
            _deepSeek(data);
            return data;
        },
        decodePoco: function (poco) {
            return _decodePocoFn(poco);
        },
        decodePocoString: function (s) {
            return _decodePocoFn(Ext.util.JSON.decode(s));
        }
    };
} ();

Gjs.validate = function (value, rule, editor) {
    var _isValidAccount = function (s) {
        var reg = /^[\w_\@\.\-]*$/g;
        return reg.test(s);
    };
    var r = rule;
    var dt = (r.dataType || "string").toLowerCase();
    var _isNumberType = (dt == "num" || dt == "number" || dt == "int" || dt == "integer" || dt == "long");
    var v = value;
    if (r.autoTrim && Ext.isString(v)) {
        v = v.trim();
        if (editor && Ext.isFunction(editor.setValue)) editor.setValue(v);
    }
    if (r.allowBlank == false && Ext.isEmpty(v)) return Gjs.Res.get("Vld_NotAllowBlank");
    if (_isNumberType) {
        if (r.minValue && v < r.minValue) return Gjs.Res.get("Vld_MinValue") + r.minValue + ".";
        if (r.maxValue && v > r.maxValue) return Gjs.Res.get("Vld_MaxValue") + r.maxValue + ".";
    }
    else {
        if (r.minLength && v.length < r.minLength) return Gjs.Res.get("Vld_MinLength") + r.minLength + ".";
        if (r.maxLength && v.length > r.maxLength) return Gjs.Res.get("Vld_MaxLength") + r.maxLength + ".";
        if (r.dataType == "account" && !_isValidAccount(v)) return Gjs.Res.get("Vld_Account");
    }
    return true;
};

Gjs.Msg = function () {
    var $Msg = Ext.Msg;
    var _parseArgsFn = function (args) {
        var i = 0, m = {};
        switch (args.length) {
            case 1:
                m.msg = args[0];
                break;
            case 2:
                if (Ext.isFunction(args[1])) {
                    m.msg = args[0];
                    m.fn = args[1];
                }
                else {
                    m.title = args[0];
                    m.msg = args[1];
                }
                break;
            case 3:
                m.title = args[0];
                m.msg = args[1];
                m.fn = args[2];
                break;
        }
        return m;
    };
    var _showFn = function (callArguments, alertType, buttons) {
        var m = _parseArgsFn(callArguments);
        var title = m.title, msg = m.msg, fn = m.fn;
        if (Ext.isEmpty(title)) {
            switch (alertType) {
                case $Msg.ERROR:
                    title = Gjs.Res.get("Dlg_ErrorTitle");
                    break;
                case $Msg.WARNING:
                    title = Gjs.Res.get("Dlg_WarningTitle");
                    break;
                case $Msg.QUESTION:
                    title = Gjs.Res.get("Dlg_QuestionTitle");
                    break;
                default:
                    title = Gjs.Res.get("Dlg_InfoTitle");
                    break;
            }
        }
        $Msg.show({ title: title, msg: msg, buttons: buttons || $Msg.OK, fn: fn, icon: alertType });
    };
    var _detailMsgDlg = function () {
        var dlg, opt, msgEl, textareaEl,
            defaultTextHeight = 75, maxWidth = 600, minWidth = 100, textareaElHeight;
        var switchDetail = function () {
            if (!textareaEl.isVisible()) {
                if (textareaEl.getHeight() != textareaElHeight)
                    textareaEl.setHeight(textareaElHeight);
                textareaEl.show();
                dlg.setHeight(dlg.getHeight() + textareaElHeight + 80);
            }
            this.hide();
        };
        var btnDetail = new Ext.Button({
            text: Gjs.Res.get("Act_Detailed"),
            handler: switchDetail,
            hideMode: 'offsets'
        });
        var updateText = function (text) {
            if (!dlg.isVisible() && !opt.width) { dlg.setSize(maxWidth, 100); }
            // Append a space here for sizing. In IE, for some reason, it wraps text incorrectly without one in some cases
            msgEl.update(text ? text + ' ' : '&#160;');
            var mw = msgEl.getWidth() + msgEl.getMargins('lr'),
            fw = dlg.getFrameWidth('lr'), bw = dlg.body.getFrameWidth('lr'), w;

            w = Math.max(Math.min(opt.width || mw + fw + bw, opt.maxWidth || maxWidth), Math.max(opt.minWidth || minWidth, 0));

            textareaEl.setWidth(w - fw - bw);
            msgEl.update(text || '&#160;');
            dlg.setSize(w, 'auto').center();
        };
        var winResize = function (el, w, h) {
            if (Ext.isNumber(h)) textareaEl.setHeight(h - msgEl.getHeight() - 80);
            if (Ext.isNumber(w)) textareaEl.setWidth(w - 35);
        };
        var createDialog = function () {
            dlg = new Ext.Window({
                plain: true, modal: true, title: "",
                closeAction: "hide", buttonAlign: "center",
                fbar: [{ text: Gjs.Res.get("Act_Close"), handler: function () { dlg.hide(); } }, btnDetail]
            });
            dlg.render(document.body);
            dlg.getEl().addClass('x-window-dlg');
            var bodyEl = dlg.body.createChild({
                html: '<div class="ext-mb-content"><span class="ext-mb-text"></span><br /><textarea readonly=true class="ext-mb-textarea"></textarea></div>'
            });
            var contentEl = bodyEl.dom.firstChild;
            msgEl = Ext.get(contentEl.firstChild);
            textareaEl = Ext.get(contentEl.lastChild);
            bodyEl.createChild({ cls: 'x-clear' });
            dlg.on("resize", winResize);
            return dlg;
        };
        return {
            show: function (options) {
                opt = options;
                if (!dlg) dlg = createDialog();
                dlg.setTitle(opt.title);
                textareaElHeight = Ext.isNumber(opt.height) ? opt.height : defaultTextHeight;
                textareaEl.setHeight(textareaElHeight);
                textareaEl.dom.value = opt.detailMsg || "";
                dlg.focusEl = textareaEl;
                updateText(opt.msg);
                if (Ext.isEmpty(opt.detailMsg)) btnDetail.hide();
                else btnDetail.show();
                textareaEl.hide();
                var h = dlg.getHeight();
                var ah = textareaEl.getHeight();
                dlg.setHeight(h - ah);
                if (!dlg.isVisible()) {
                    // force it to the end of the z-index stack so it gets a cursor in FF
                    document.body.appendChild(dlg.el.dom);
                    dlg.show();
                }
            }
        };
    } ();
    return {
        error: function () { _showFn(arguments, $Msg.ERROR); },
        info: function () { _showFn(arguments, $Msg.INFO); },
        warning: function () { _showFn(arguments, $Msg.WARNING); },
        confirm: function () { _showFn(arguments, $Msg.QUESTION, $Msg.YESNO); },
        detailError: function (title, msg, detail) { _detailMsgDlg.show({ title: title || Gjs.Res.get("Dlg_ErrorTitle"), msg: msg, detailMsg: detail, width: 350 }); },
        prompt: function (title, msg, fn, value, advConfig) {
            var mLine, maxLength, minLength;
            var autoTrim = true;
            var allowEmpty = false;
            if (advConfig) {
                mLine = advConfig.multiline;
                autoTrim = (advConfig.autoTrim !== false);
                allowEmpty = (advConfig.allowEmpty === true);
                maxLength = advConfig.maxLength;
                minLength = advConfig.minLength;
                verifyFn = advConfig.verifyHandler;
            }
            var innerFn = function (btn, v) {
                if (btn == 'ok') {
                    var isOk = true;
                    var err;
                    if (autoTrim) v = v.trim();
                    if (v == "" && !allowEmpty) {
                        isOk = false;
                        err = "输入内容不可以为空。";
                    }
                    if (isOk && (maxLength || minLength)) {
                        var iLen = v.length;
                        if (maxLength > 0 && iLen > maxLength) {
                            isOk = false;
                            err = "文本长度不可以超过" + maxLength + "。";
                        }
                        else if (minLength > 0 && iLen < minLength) {
                            isOk = false;
                            err = "文本长度不可以小于" + minLength + "。";
                        }
                    }
                    if (isOk && verifyFn) {
                        isOk = (verifyFn(v) !== false);
                    }
                    if (!isOk) {
                        if (err) Gjs.Msg.info(err, function () {
                            Ext.Msg.prompt(title, msg, innerFn, null, mLine, v);
                        });
                    }
                    else {
                        fn(v);
                    }
                }
            };
            Ext.Msg.prompt(title, msg, innerFn, null, mLine, value);
        }
    };
} ();
Ext.ns("Gjs.View.InfoBox");

Gjs.View.InfoBox.create = function (cfg) {
    cfg = cfg || {};
    cfg.style = cfg.style || {};
    cfg.bodyStyle = cfg.bodyStyle || {};
    var _setIcon = function (s) {
        if (s.iconClass || s.icon) {
            if (s.iconClass) divImg.className = s.iconClass;
            if (s.icon) divImg.style.background = "url('" + _style.icon + "') no-repeat center center";
            tdImg.style.display = "";
        }
        else tdImg.style.display = "none";
    };
    var _getStyleByType = function (alertType) {
        var s = {
            color: "#3366AA",
            background: "#FFFFC2",
            border: "1px dashed #B4C9E4"
        };
        switch (alertType) {
            case "info":
            case "information":
                s.iconClass = "gx-infoicon";
                break;
            case "warning":
                s.color = "#D46204";
                s.iconClass = "gx-warningicon";
                break;
            case "error":
            case "failure":
                s.color = "#000000";
                s.background = "#F5B6DB";
                s.border = "1px dashed #FF7777";
                s.iconClass = "gx-erroricon";
                break;
            case "hint":
                s.background = "#E2F9C7";
                s.iconClass = "gx-hinticon";
                break;
        }
        return s;
    };

    var _interval = cfg._interval || 5000, _intervalHandler, _msgIdx;
    var _setMessage = function (msg) {
        if (_intervalHandler) clearInterval(_intervalHandler);
        _msgIdx = 1;
        if (Ext.isString(msg)) tdText.innerText = msg;
        else if (Ext.isArray(msg)) {
            tdText.innerText = msg[0];
            if (msg.length > 1) {
                _intervalHandler = setInterval(function () {
                    tdText.innerText = msg[_msgIdx];
                    _msgIdx++;
                    if (_msgIdx >= msg.length) _msgIdx = 0;
                }, _interval);
            }
        }
    };

    var _style = _getStyleByType(cfg.alertType);
    if (cfg.color) _style.color = cfg.color;
    if (cfg.background) _style.background = cfg.background;
    if (cfg.icon) _style.icon = cfg.icon;
    var _imgWidth = (cfg.iconWidth || 16) + 2;
    var _message = cfg.message || "";

    delete cfg.interval;
    delete cfg.messageType;
    delete cfg.background;
    delete cfg.iconWidth;
    delete cfg.color;
    delete cfg.message;
    delete cfg.items;
    delete cfg.icon;

    Ext.applyIf(cfg.style, { backgroundColor: "#FFFFFF", fontSize: "9pt" });
    Ext.applyIf(cfg.bodyStyle, {
        color: _style.color,
        border: _style.border,
        background: _style.background,
        overflow: "hidden"
    });

    var tb = document.createElement("table");
    tb.className = this.frameClass;
    tb.setAttribute("height", "100%");
    tb.setAttribute("width", "100%");
    tb.setAttribute("cellSpacing", "0");
    tb.setAttribute("cellPadding", "0");
    tb.setAttribute("cellSpacing", "0");
    tb.style.border = "1px solid #ffffff";
    tb.style.tableLayout = "fixed";

    var tdImg = tb.insertRow(0).insertCell(0);
    tdImg.width = _imgWidth + "px";
    var divImg = document.createElement("div");
    divImg.style.marginLeft = "2px";
    divImg.style.width = _imgWidth + "px";
    divImg.style.height = _imgWidth + "px";
    tdImg.appendChild(divImg);
    _setIcon(_style);
    var tdText = tb.rows[0].insertCell(1);
    tdText.style.paddingLeft = "4px";
    _setMessage(_message);
    var tdBtn = tb.rows[0].insertCell(2);
    tdBtn.width = "21px";
    var divBtn = document.createElement("div");
    divBtn.className = "gx-closebutton";
    divBtn.onclick = function () {
        if (!pnl.fireEvent("closebuttonclick")) return;
        pnl.hide();
    };
    tdBtn.appendChild(divBtn);
    tdBtn.style.display = (cfg.showCloseButton == true) ? "" : "none";
    cfg.height = cfg.height || 30;
    cfg.layout = "fit";
    var pnl = new Ext.Panel(cfg);
    pnl.on("afterrender", function () { pnl.body.dom.appendChild(tb); });
    var _setBg = function (bg) {
        if (pnl.rendered) pnl.body.dom.style.background = bg;
        else pnl.bodyStyle.background = bg;
    };
    var _setStyle = function (s) {
        _setIcon(s);
        if (s.color) tdText.style.color = s.color;
        if (s.background) _setBg(s.background);
    };
    pnl.showMessage = function () {
        var arg = arguments[0];
        if (Ext.isString(arg) || Ext.isArray(arg)) {
            _setMessage(arg);
            if (arguments.length > 1) _setStyle(_getStyleByType(arguments[1]));
        }
        else {
            _setStyle(arg);
            _setMessage(arg.message);
        }
    };
    pnl.restore = function () {
        _setStyle(_style);
        _setMessage(_message);
    };
    return pnl;
};
Ext.ns("Gjs.Part");

Gjs.Part.WindowMask = function () {
    var extMask, maskDiv, suspend;
    return {
        show: function (hold) {
            if (suspend) return;
            if (hold) suspend = true;
            if (!extMask) extMask = new Ext.LoadMask(Ext.getBody(), { msg: Gjs.Res.get("Lab_Waiting") });
            if (!maskDiv) {
                maskDiv = document.createElement("div");
                Ext.apply(maskDiv.style, {
                    position: "absolute", top: "0", left: "0", height: "100%", width: "100%",
                    zIndex: "65535",
                    backgroundImage: "url('__fake.gif')"
                });
                document.body.appendChild(maskDiv);
            }
            extMask.show();
            maskDiv.style.display = "";
        },
        hide: function (release) {
            if (release) suspend = false;
            if (suspend) return;
            extMask.hide();
            maskDiv.style.display = "none";
        },
        hold: function () { suspend = true; },
        release: function () { suspend = false; }
    };
} ();

Gjs.DomHelper = {
    createDocument: function (xmlStr) {
        var doc;
        if (xmlStr && window.DOMParser) {
            doc = (new DOMParser()).parseFromString(xmlStr, "application/xml");
        }
        else if (document.implementation && document.implementation.createDocument) {
            doc = document.implementation.createDocument("", "", null);
            xmlDoc.async = false;
        }
        else if (window.ActiveXObject) {
            doc = new ActiveXObject("Microsoft.XMLDOM");
            if (xmlStr) doc.loadXML(xmlStr);
        }
        return doc;
    },
    addNode: function (doc, parent, name, value, attributes) {
        var node = doc.createElement(nodeName);
        if (value) Gjs.DomHelper.setNodeValue(doc, node, value);
        if (attributes) Gjs.DomHelper.setNodeAttrs(node, attributes);
        parent = parent || doc.documentElement || doc;
        parent.appendChild(node);
        return node;
    },
    removeAllChildren: function (doc, parent) {
        while (parent.childNodes && (parent.childNodes.length > 0)) {
            parent.removeChild(parent.childNodes[0]);
        }
    },
    setNodeValue: function (doc, node, value) {
        Gjs.DomHelper.removeAllChildren(node);
        node.appendChild(doc.createTextNode(value));
    },
    setNodeAttributes: function (node, attributes) {
        for (var attr in attributes) node.setAttribute(attr, attributes[attr]);
    },
    setNodeAttribute: function (node, name, value) {
        node.setAttribute(name, value);
    },
    getXmlString: function (doc) {
        var s;
        if (doc.xml) s = doc.xml;
        else if (window.XMLSerializer) s = (new XMLSerializer).serializeToString(doc, "text/xml");
        return s;
    }
};

Gjs.Ajax = function () {
    var _createHttpRequest = function () {
        var obj;
        if (window.XMLHttpRequest) obj = new XMLHttpRequest();
        else if (window.ActiveXObject) {
            try {
                obj = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e0) {
                try {
                    obj = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e1) { }
            }
        }
        return obj;
    };
    var _connUrl = function (url, params) {
        var _url = url;
        if (_url.indexOf("?") < 0) _url += "?_ts=" + (new Date()).getTime();
        if (Ext.isObject(params)) {
            for (var s in params) _url += "&" + s + "=" + params[s];
        }
        else if (Ext.isString(params)) {
            _url += "&" + params;
        }
        return _url;
    };
    var _syncReq = function (cfg) {
        var httpReq = _createHttpRequest();
        if (!httpReq) {
            return false;
        }
        var url = cfg.url;
        if (cfg.params) url = _connUrl(url, cfg.params);
        httpReq.open("post", url, false);
        httpReq.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) cfg.success(this);
                else cfg.failure(this);
            }
        };
        httpReq.send(cfg.data);
    };
    var _asyncReq = function (cfg) {
        Ext.Ajax.request({
            url: cfg.url,
            params: cfg.params,
            method: "post",
            timeout: cfg.timeout,
            jsonData: cfg.data,
            success: cfg.success,
            failure: cfg.failure
        });
    };
    var _jsonpReq = function () {
        var me = this;
        var _createScript = function (url, key) {
            var script = document.createElement('script');
            //script.setAttribute("src", url);
            script.setAttribute("async", true);
            script.setAttribute("id", key);
            script.setAttribute("type", "text/javascript");
            return script;
        };
        var _statics = {
            requestCount: 0,
            requests: {}
        };
        var _setupErrorHandling = function (request) {
            request.script.onerror = function () {
                _handleResponse(null, request);
            }
        };
        _handleError = function (request) {
            request.errorType = 'error';
            _handleResponse(null, request);
        };
        _cleanupErrorHandling = function (request) {
            request.script.onerror = null;
        };
        _handleTimeout = function (request) {
            request.errorType = 'timeout';
            _handleResponse(null, request);
        };
        _handleResponse = function (result, request) {
            var success = true;
            if (request.timeout) {
                clearTimeout(request.timeout);
            }
            delete request.callbackName;
            delete _statics.requests[request.id];
            _cleanupErrorHandling(request);
            Ext.fly(request.script).remove();
            if (result || request.errorType)
                if (request.errorType) {
                    success = false;
                    Ext.callback(request.failure, request.scope, [request.errorType]);
                } else {
                    Ext.callback(request.success, request.scope, [result]);
                }
        };
        return {
            request: function (cfg) {
                var id = ++_statics.requestCount,
                callbackName = 'callback' + id,
                callbackKey = cfg.callbackKey || "callback",
                timeout = cfg.timeout || "60000",
                params = Ext.apply({}, cfg.params),
                url = cfg.url + "?callbackKey=" + callbackName,
                request,
                script;
                if (cfg.params) url = _connUrl(url, cfg.params);
                if (cfg.data) url = _connUrl(url, "data=" + cfg.data);
                script = _createScript(url, callbackName);
                _statics.requests[id] = request = {
                    url: url,
                    params: params,
                    script: script,
                    id: id,
                    scope: cfg.scope,
                    success: cfg.success,
                    failure: cfg.failure,
                    callback: cfg.callback,
                    callbackName: callbackName
                };

                if (timeout > 0) {
                    request.timeout = setTimeout(function () {
                        _handleTimeout(request);
                    }, timeout);
                }
                _setupErrorHandling(request);
                me[callbackName] = function (requestData) {
                    requestData["responseText"] = Ext.util.JSON.encode(requestData);
                    _handleResponse(requestData, request);
                };
                script.setAttribute("src", url);
                Ext.getHead().appendChild(script);
                return request;
            }
        }
    } ();
    return {
        createHttpRequest: _createHttpRequest,
        request: function (cfg) {
            var _url = cfg.url || Gjs.Ajax.url || "WebHttpHandle.ashx";
            var _lastRequestFlg = '';
            var _uncaughtErrMsg = function (response) {
                var s = response.status;
                switch (response.status) {
                    case 0:
                        return false;
                        break;
                    case -1:
                        s = "-1_请求超时";
                        break;
                    case 400:
                        s = "400_失败的请求";
                        break;
                    case 403:
                        s = "403_禁止访问";
                        break;
                    case 404:
                        s = "404_资源未找到";
                        break;
                    case 500:
                        s = "500_服务器内部错误";
                        break;
                    case 503:
                        s = "503_服务器不可用";
                        break;
                }
                var ret = "(请求地址=" + (_url || "未知")
					+ ",<br> Response状态=" + s
					+ ",<br> 控制器=" + (cfg.controller || cfg.ctrl || "未知")
					+ ",<br> 方法=" + (cfg.action || cfg.cmd || "未知")
					+ ",<br> 数据=" + (cfg.data || "空") + ")";
                return ret;
            };
            var _alertError = function (response, msg, detail) {
                if (Ext.isEmpty(detail)) {
                    if (Ext.isEmpty(msg) && response) {
                        var s = _uncaughtErrMsg(response);
                        if (s !== false) {
                            Gjs.Msg.error("未知的请求异常。<br>" + (s || ""));
                        }
                    }
                    else Gjs.Msg.error(msg);
                }
                else Gjs.Msg.detailError(null, msg, detail);
            };
            var _decFn = cfg.decoder || function (s) { return Ext.util.JSON.decode(s); };
            var _encFn = cfg.encoder || function (d) { return Ext.util.JSON.encode(d); };
            var _reqType = cfg.reqType || "ajax";
            var _reqFn = (_reqType != "ajax") ? _jsonpReq.request : (cfg.async === false) ? _syncReq : _asyncReq;
            var _successFn = function (response) {
                if (cfg.loadMask) Gjs.Part.WindowMask.hide();
                var fn = cfg.callback || cfg.cb || cfg.success;
                if (!fn) return;
                data = _decFn(response.responseText);
                if (data["IsSuccess"]) {
                    var d = cfg.dataNode ? data[cfg.dataNode] : data;
                    if (cfg.decodeEntityReference) Gjs.EntityHelper.decodeEntityReference(d);
                    fn(d, _lastRequestFlg);
                }
                else {
                    _failureFn(response, data, _lastRequestFlg);
                }
            };
            var _failureFn = function (response, data) {
                if (cfg.loadMask) Gjs.Part.WindowMask.hide();
                if (cfg.failure) cfg.failure(response, data);
                else {
                    if (Ext.isObject(data)) {
                        var fType = data["StatusCode"];
                        if (fType == "permissionError" && cfg.authFailure) cfg.authFailure(data);
                        else if (fType == "validateError") Gjs.Msg.info(data["ResultMsg"]);
                        else _alertError(response, data["ResultMsg"], data["StackMsg"]);
                    }
                    else _alertError(response, Gjs.Res.get("Info_RequestFail"), data || response.responseText);
                }
            };
            var _params = cfg.params;
            var _data = _params ? cfg.data : {
                controller: cfg.controller || cfg.ctrl,
                action: cfg.action || cfg.cmd,
                args: cfg.data
            };
            if (cfg.loadMask) Gjs.Part.WindowMask.show();
            if (Ext.isFunction(cfg.beforeRequest)) {
                _lastRequestFlg = cfg.beforeRequest();
            }
            _reqFn({
                url: _url,
                timeout: cfg.timeout || 60000,
                params: _params,
                data: _encFn(_data),
                success: _successFn,
                failure: _failureFn
            });
        }
    };
} ();
Ext.ns("Gjs.Part.DropDownLayer");
Ext.ns("Gjs.Form.PopupEdit");
Ext.ns("Gjs.Form.ComboBox");
Ext.ns("Gjs.Form.SearchBox");
Ext.ns("Gjs.Form.ColorPickEdit");

Gjs.Part.DropDownLayer.create = function (cfg) {
    var _isWin = cfg.resizable;
    var layer;
    var _cfg;
    var _h = cfg.height || 200;
    var _w = cfg.width || 150;
    if (_isWin) {
        _cfg = Ext.apply({ resizable: true, border: false, closable: false, draggable: false, width: _w, height: _h, layout: "fit", items: [cfg.popupElement] }, cfg);
        layer = new Ext.Window(_cfg);
    }
    else {
        layer = new Ext.Layer(cfg);
        layer.swallowEvent('mousewheel');
        layer.setSize(_w, _h);
    }
    layer.popupElement = cfg.popupElement;
    Ext.getDoc().on('mousedown', function (e) {
        if (!layer.isVisible()) return;
        var el = _isWin ? layer.el : layer;
        if (!e.within(layer.baseWrap) && !e.within(el)) {
            layer.hide();
            if (layer.baseElm) layer.baseElm.el.focus();
        }
    });
    layer.popup = function (wrap, elm) {
        var pe = this.popupElement;
        if (!_isWin && !pe.rendered) {
            pe.setWidth(_h);
            pe.setHeight(_w);
            pe.render(this);
        }
        this.show();
        this.alignTo(wrap, this.alignPosition || "tl-bl?");
        this.baseWrap = wrap;
        this.baseElm = elm;

    };
    return layer;
};
Gjs.Form.PopupEdit.create = function (cfg) {
    var rs = cfg.resizable;
    delete cfg.resizable;
    var ed = new Ext.form.TriggerField(cfg);
    var _layer = cfg.dropDownLayer || Gjs.Part.DropDownLayer.create(Ext.apply({
        resizable: rs,
        popupElement: cfg.popupElement,
        width: cfg.popupWidth,
        height: cfg.popupHeight
    }, cfg.layerConfig || cfg.popupConfig));
    ed.dropDownLayer = _layer;
    ed.collapse = function () {
        _layer.hide();
        this.el.focus();
    };
    ed.expand = function () {
        _layer.popup(this.wrap, this);
        this.fireEvent("onpopup");
    };
    ed.onTriggerClick = function () {
        if (this.disabled) return;
        if (_layer.isVisible()) this.collapse();
        else this.expand();
    };
    ed.setMixedValue = function (v) {
        this.mixedValue = v;
        if (v.value) this.setValue(v.value);
    };
    ed.getMixedValue = function (v) {
        return this.mixedValue || this.getValue();
    };
    ed.clearMixedValue = function () {
        this.mixedValue = "";
        this.reset();
    };
    return ed;
};
Gjs.Form.ComboBox.create = function (cfg) {
    var _store;
    var _fields = [{ name: 'key' }, { name: 'value'}];
    var _vm = cfg.viewModel;

    if (cfg.items) {
        var _data = new Array();
        for (var i = 0; i < cfg.items.length; i++) {
            var item = cfg.items[i];
            _data.push([item.key, item.value]);
        }
        _store = new Ext.data.ArrayStore({
            fields: _fields,
            data: _data
        });
    }
    else {
        var _meta = cfg.metadata || _vm.metadata;
        var flds = [];
        for (var i = 0; i < _meta.length; i++) {
            var f = _meta[i];
            flds.push({ name: f.name });
        };
        _store = new Ext.data.JsonStore({
            fields: Ext.isEmpty(flds) ? _fields : flds,
            root: cfg.root || 'Data'
        });
    }
    var _cfg = Ext.apply({
        store: _store,
        editable: false,
        mode: 'local',
        triggerAction: 'all',
        displayField: 'value',
        valueField: 'key',
        enableKeyEvents: true
    }, cfg);
    delete _cfg.items;
    delete _cfg.viewModel;
    var _cb = new Ext.form.ComboBox(_cfg);
    /*
    _cb.on('keydown', function (obj, e) {
    if (e.getKey() == 8) {
    e.stopEvent();
    }
    });
    */
    if (!cfg.items) {
        var _fillData = function (data) {
            if (_store.getCount() > 0) _store.removeAll();
            _store.loadData(data);
            _cb.fireEvent("afterLoadData");
        };
        var _loadData = function () {
            _vm.loadData(_fillData);
        };
        _cb.reloadData = function () {
            _loadData();
        };
        _cb.addData = function (rec) {
            var r = new _store.recordType(rec);
            _store.insert(0, r);
        };
        if (cfg.autoload !== false) _loadData();
    }
    return _cb;
};
Gjs.Form.SearchBox.create = function (cfg) {
    var _searchText, _delayText;
    var _query = function () {
        _searchText = ed.getValue().trim();
        ed.fireEvent("query", ed, _searchText);
    };
    var _delayQuery = function () {
        var s = ed.getValue().trim();
        if (_delayText == s && s != _searchText) _query();
    };
    var _getDelayText = function () {
        _delayText = ed.getValue();
    };
    var _cfg = Ext.apply({
        enableKeyEvents: true,
        listeners: {
            keydown: function (el, e) {
                if (e.keyCode == 13) {
                    _query();
                    e.stopEvent();
                }
                else
                    if (cfg.smartMode !== false) {
                        setTimeout(_getDelayText, 500);
                        setTimeout(_delayQuery, 1000);
                    }
            }
        }
    }, cfg);
    var ed;
    if (cfg.hideClearButton !== true) {
        _cfg.trigger1Class = 'x-form-search-trigger';
        _cfg.trigger2Class = 'x-form-clear-trigger';
        _cfg.onTrigger1Click = _query;
        _cfg.onTrigger2Click = function () {
            this.resetBox();
        };
        ed = new Ext.form.TwinTriggerField(_cfg);
    }
    else {
        _cfg.triggerClass = 'x-form-search-trigger';
        _cfg.onTriggerClick = _query;
        ed = new Ext.form.TriggerField(_cfg);
    }
    ed.resetBox = function (preventEvent) {
        this.reset();
        _searchText = "";
        if (preventEvent !== false) _query();
    };
    return ed;
};
Gjs.Form.ColorPickEdit.create = function (cfg) {
    var colorPalette = new Ext.ColorPalette({
    });
    colorPalette.on('select', function (palette, sel) {
        var color = '#' + sel;
        var c = ed.getValue();
        if (c == color) return;
        ed.setValue(color);
        //ed.el.dom.style.color = color;
        ed.collapse();
        ed.fireEvent("change", ed, color, c);
    });
    var pnl = new Ext.Panel({
        items: colorPalette,
        border: true
    });
    var _cfg = Ext.applyIf({
        popupElement: pnl,
        //editable: false,
        popupHeight: 100,
        value: '#000000'
    }, cfg);
    var ed = Gjs.Form.PopupEdit.create(_cfg);
    ed.on("onpopup", function () {
        colorPalette.select(ed.getValue());
    });
    return ed;
};
Ext.ns("Gjs.View");

Gjs.View.EntityView = function () {
    var _createEditor = function (item) {
        var ed;
        var cfg = item.cfg || item.config || {};
        cfg.id = cfg.id || item.id;
        switch (item.type) {
            case "number":
                ed = new Ext.form.NumberField(cfg);
                break;
            case "text":
                ed = new Ext.form.TextArea(cfg);
                break;
            case "date":
                Ext.applyIf(cfg, { format: "Y-m-d", value: new Date() });
                ed = new Ext.form.DateField(cfg);
                break;
            case "bool":
                Ext.applyIf(cfg, { style: "margin-top:3px" });
                ed = new Ext.form.Checkbox(cfg);
                break;
            case "trigger":
                ed = new Ext.form.TriggerField(cfg);
                break;
            case "multiLang":
                ed = Gjs.Editor.MultiLangField.create(cfg);
            default:
                ed = new Ext.form.TextField(cfg);
                break;
        }
        return ed;
    };
    var _buildLayoutItems = function (rows, cfg, editors) {
        var _vid = cfg.id;
        var rowPnls = new Array();
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var rowPnl = {
                border: false,
                items: new Array(),
                layout: (row.length == 1) ? 'form' : 'column',
                bodyStyle: 'background:transparent;',
                items: []
            };
            if (i) {
                rowPnl.bodyStyle += "margin-top:" + (cfg.rowSpace || 10) + "px;"
            }
            rowPnls.push(rowPnl);
            for (var j = 0; j < row.length; j++) {
                var item = row[j];
                item.name = item.name || item.id;
                //item.id = item.id || item.name;
                //item.editorWidth = item.width;
                //item.editorHeight = item.height;
                var editor = item.editor || _createEditor(item);
                editor.__fieldType = item.type;
                var vc = editor.validateConfig || item.validateConfig;
                if (vc) vc.dataType = vc.dataType || item.type;
                editor._validateConfig = vc;
                var sEditorName = item.name || ("editor" + j);
                editors[sEditorName] = editor;
                editor.id = editor.id || ((_vid && item.id) ? (_vid + item.id) : undefined);
                if (editor instanceof Ext.form.Field) {
                    editor.width = editor.width || item.editorWidth;
                    editor.height = editor.height || item.editorHeight;
                    editor.anchor = editor.anchor || item.anchor;
                    if (!editor.anchor && !editor.width) editor.anchor = "100%";
                }
                editor.fieldLabel = editor.fieldLabel || item.label || item.fieldLabel;
                editor.readOnly = editor.readOnly || cfg.readOnly || item.readOnly;
                editor.disabled = editor.disabled || cfg.disabled || item.disabled;
                editor.clearAble = editor.clearAble || item.clearAble;
                editor.setMixedValue = editor.setMixedValue || item.setMixedValue;
                editor.getMixedValue = editor.getMixedValue || item.getMixedValue;
                if (row.length == 1) {
                    rowPnl.items.push(editor);
                    editor._form = rowPnl;
                }
                else {
                    var cellForm = new Ext.Panel({
                        border: false,
                        layout: 'form',
                        items: editor,
                        columnWidth: item.columnWidth,
                        width: item.width
                    });
                    editor._form = cellForm;
                    rowPnl.items.push(cellForm);
                }
                var vc = item.vc || {};
                editor.validateConfig = vc;
            }
        }
        return rowPnls;
    };
    var _buildRows = function (items, columns) {
        var rows = new Array(), cols, iColCount;
        if (Ext.isNumber(columns) || !columns) {
            iColCount = columns || 1;
            cols = new Array();
            for (var i = 0; i < iColCount; i++) cols.push({ columnWidth: 1 / iColCount });
        }
        else if (Ext.isArray(columns)) {
            iColCount = columns.length;
            cols = columns;
        }
        var row, idx;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            //item.editorWidth = item.width;
            item.editorHeight = item.height;
            if (iColCount == 1) item.exclusive = true;
            if (item.exclusive || item.newline || idx >= iColCount) row = null;
            if (!row) {
                idx = 0;
                row = new Array();
                rows.push(row);
            }
            row.push(item);
            if (item.exclusive) {
                item.columnWidth = 1;
                delete item.width;
                row = null;
            }
            else {
                item.columnWidth = cols[idx].columnWidth;
                item.width = cols[idx].width;
                if (item.linefeed) row = null;
            }
            idx++;
        }
        return rows;
    };
    return {
        create: function (cfg) {
            var editors = {};
            var rows = cfg.rows || _buildRows(cfg.items, cfg.columns);
            cfg.items = _buildLayoutItems(rows, cfg, editors);
            delete cfg.rows;
            delete cfg.columns;
            delete cfg.rowSpace;
            var view = new Ext.FormPanel(cfg);
            view.getViewItem = function (name) {
                return editors[name];
            };
            view.getAllItems = function () {
                return editors;
            };
            view.setValue = function () {
                var ags = arguments;
                var i = ags.length;
                if (i == 1) {
                    var data = ags[0];
                    for (var key in data) {
                        var ed = editors[key];
                        if (ed) {
                            var v = data[key];
                            if (v == undefined) v = null;
                            if (ed.setMixedValue) ed.setMixedValue(v);
                            else if (ed.setValue) ed.setValue(v);
                        }
                    }
                }
                else if (i > 1) {
                    var ed = this.getViewItem(ags[0]);
                    if (ed) {
                        if (ed.setMixedValue) ed.setMixedValue(ags[1]);
                        else if (ed.setValue) ed.setValue(ags[1]);
                    }
                }
            };
            view.setFieldLabel = function (fieldName, text) {
                var ed = this.getViewItem(fieldName);
                if (ed) {
                    if (ed.rendered) {
                        var itm = ed._form.items[0] || ed._form.items.items[0];
                        itm.label.dom.innerHTML = text + ":";
                    }
                    else ed.fieldLabel = text;
                }
            };
            view.getValue = function () {
                var ags = arguments, v;
                var i = ags.length;
                if (i == 0) {
                    v = {};
                    for (var key in editors) {
                        var ed = editors[key];
                        if (ed) {
                            if (ed.getMixedValue) v[key] = ed.getMixedValue();
                            else if (ed.getValue) {
                                var s = ed.getValue();
                                if (!Ext.isEmpty(s) && ed.__fieldType == "date") s = s.format('Y-m-d');
                                v[key] = s;
                            }
                        }
                    }
                }
                else if (i > 0) {
                    var ed = this.getViewItem(ags[0]);
                    if (ed) {
                        if (ed.getMixedValue) v = ed.getMixedValue();
                        else if (ed.getValue) {
                            v = ed.getValue();
                            if (!Ext.isEmpty(s) && ed.__fieldType == "date") v = v.format('Y-m-d');
                        }
                    }
                }
                return v;
            };
            view.clear = function () {
                for (var key in editors) {
                    var ed = editors[key];
                    if (ed && ed.clearAble !== false) {
                        delete ed.originalValue;
                        if (ed.setMixedValue) ed.setMixedValue(null);
                        else if (ed.reset) {
                            ed.reset();
                        }
                        else if (ed.setValue) ed.setValue(null);
                    }
                }
            };
            view.validate = function (focus) {
                var _failFn = function (ed, msg) {
                    if (focus && Ext.isFunction(ed.focus)) ed.focus(true);
                    view.fireEvent("validatefail", ed, msg);
                };
                for (var key in editors) {
                    var ed = editors[key];
                    if (ed && ed._validateConfig) {
                        var vc = ed._validateConfig;
                        if (vc.validate) {
                            var vr = vc.validate(ed);
                            if (vr != true) {
                                _failFn(ed, vr);
                                return false;
                            }
                        }
                        else if (Gjs.validate) {
                            var vr = Gjs.validate(ed.getValue(), vc, ed);
                            if (vr != true) {
                                _failFn(ed, vr);
                                return false;
                            }
                        }
                    }
                }
                return true;
            };
            return view;
        }
    };
} ();
Ext.ns("Gjs.Part.PagingBar");

Gjs.Part.PagingBar.create = function (cfg) {
    var _pi = 0;
    var _pc = 0;
    var _vid = cfg ? cfg.id : undefined;
    var _gid = function (id) {
        return _vid ? (_vid + "_" + id) : undefined;
    };
    var _pagebarAlign = cfg.pagebarAlign || "left";
    var _navi = function () { if (cfg && cfg.handle) { cfg.handle(_pi, _upd); } };
    var _newPgBtn = function (fnc) {
        var s, h;
        switch (fnc) {
            case "first":
                s = Gjs.Res.get("Lab_FirstPage");
                h = function () {
                    _pi = 0;
                    _navi();
                };
                break;
            case "prev":
                s = Gjs.Res.get("Lab_PrevPage");
                h = function () {
                    _pi--;
                    _navi();
                };
                break;
            case "next":
                s = Gjs.Res.get("Lab_NextPage");
                h = function () {
                    _pi++;
                    _navi();
                };
                break;
            case "last":
                s = Gjs.Res.get("Lab_LastPage");
                h = function () {
                    _pi = _pc - 1;
                    _navi();
                };
                break;
        }
        return new Ext.Toolbar.Button({
            id: _gid(fnc),
            tooltip: s,
            overflowText: s,
            iconCls: 'x-tbar-page-' + fnc,
            disabled: true,
            handler: h
        });
    };
    var _btF = _newPgBtn("first");
    var _btP = _newPgBtn("prev");
    var _ipt = new Ext.form.NumberField({
        id: _gid('edNum'),
        width: cfg.IsDisplayTotal ? 22 : 30,
        cls: 'x-tbar-page-number',
        allowDecimals: false,
        allowNegative: false,
        enableKeyEvents: true,
        selectOnFocus: true,
        submitValue: false,
        listeners: {
            keydown: function (o, e) {
                var k = e.getKey();
                if (k == e.RETURN) {
                    _pi = this.getValue();
                    _pi = (_pi <= 0 || _pc == 0) ? 0 : (_pi < _pc) ? (_pi - 1) : (_pc - 1);
                    _navi();
                }
            }
        }
    });
    var _btN = _newPgBtn("next");
    var _btL = _newPgBtn("last");
    var _atx = new Ext.Toolbar.TextItem({ id: _gid("Lab_PageSelect"), text: cfg.IsDisplayTotal ? String.format(Gjs.Res.get("Lab_PageSelectTotal"), 0, 0) : String.format(Gjs.Res.get("Lab_PageSelect"), 0) });
    var _upd = function (pc, pi, recN, recC, curC) {
        _pi = parseInt((pi || pi == 0) ? pi : _pi);
        _pc = parseInt(pc);
        if (_pi > (_pc - 1) && _pc > 0) _pi = _pc - 1;
        _btF.setDisabled(_pi < 1);
        _btP.setDisabled(_pi < 1);
        _btN.setDisabled(_pi >= (_pc - 1));
        _btL.setDisabled(_pi >= (_pc - 1));
        _ipt.setValue((_pc > 0) ? (_pi + 1) : 0);
        cfg.IsDisplayTotal ? _atx.setText(String.format(Gjs.Res.get("Lab_PageSelectTotal"), _pc, recC)) : _atx.setText(String.format(Gjs.Res.get("Lab_PageSelect"), _pc));
        if (!cfg.simpleBar) setDetailedRec(pi, pc, recN, recC, curC);
    };

    var _detailedRec = new Ext.Toolbar.TextItem({ id: _gid('pageText'), text: Gjs.Res.get("Lab_Empty"), hidden: cfg.simpleBar });
    var setDetailedRec = function (pi, pc, rN, rC, curC) {
        var i = pi;
        var ci = ++i;
        var bc = (ci - 1) * rN + 1;
        var ec = curC ? (bc + curC - 1) : ((ci < pc) ? ci * rN : rC);
        var t = String.format(Gjs.Res.get("Lab_DetailedRecPage"), (_pc == 0) ? 0 : bc, (_pc == 0) ? 0 : ec, rC);
        if (_pc == 0) t = Gjs.Res.get("Lab_Empty");
        _detailedRec.setText(t);
    };

    var bar = [_btF, _btP, Gjs.Res.get("Lab_PageAt"), _ipt, _atx, _btN, _btL];
    if (_pagebarAlign != "left") bar.unshift("->");
    else bar.push("->");
    bar.push(_detailedRec);
    var pb = new Ext.Toolbar({ items: bar });
    pb.updatePageState = function (pc, pi, recNo, recCount, curC) {
        //curC是当前页实际显示的记录数
        _upd((pc || pc == 0) ? pc : _pc, (pi || pi == 0) ? pi : _pi, recNo, recCount, curC);
    };
    pb.navi = function (idx) {
        _pi = idx || 0;
        _navi();
    };
    return pb;
};
Ext.ns("Gjs.View.Grid");
Gjs.View.Grid.create = function (cfg) {
    var _storeType = {
        arySt: "arrayStore",
        jsnSt: "jsonStore"
    };
    var _vm = cfg.viewModel;
    //if (!_vm) return;
    //设置表格初始化参数
    var _meta;
    var _cfg = Ext.apply({ autoScroll: true, stripeRows: true, cls: 'g-grid-norowsline' }, cfg);
    var _sPath = cfg.imagePath || "";
    var _st, _cm, _sm, _gridIdx, _cusCachSt = new Array();
    var _dragable = _cfg.enableDragDrop || _cfg.enableDrag;
    var _multiSel = _cfg.multiSelect;
    var _showCheckColumn = _multiSel && !_dragable;
    var _stType = cfg.storeType || _storeType.arySt;
    var _stIdProperty = cfg.storeType || 'id';
    var _jsnDataRoot = cfg.root || 'Entities';
    var _clientPageAble = cfg.clientPageAble || false;
    var _curCell;
    _sm = (_showCheckColumn) ? new Ext.grid.CheckboxSelectionModel() : new Ext.grid.RowSelectionModel({ singleSelect: !_multiSel });
    //根据metadata设置columns和fields
    var _initGridParams = function (meta) {
        _meta = meta;
        var flds = new Array();
        var cols = new Array();
        if (_showCheckColumn) cols.push(_sm);
        if (!_meta) {
            flds.push({ name: "$" });
            cols.push({ header: "", dataIndex: "$" });
        }
        else {
            if (_cfg.showRowNumber) cols.push(new Ext.grid.RowNumberer());
            for (var i = 0; i < _meta.length; i++) {
                var f = _meta[i];
                f.name = (f.dataIndex || f.fieldName || f.name || f.id || "").trim();
                f.alias = (f.header || f.alias || f.name || "").trim();
                flds[i] = { name: f.name };
                if (f.hidden) continue;
                var col = {
                    id: f.id,
                    header: f.alias,
                    dataIndex: f.name,
                    width: f.width,
                    icon: f.icon,
                    align: f.align,
                    sortable: f.sortable,
                    editor: f.editor,
                    menuDisabled: (f.menuDisabled != false),
                    link: f.link,
                    renderer: f.renderer,
                    getIconFn: f.getIconFn,
                    getTextFn: f.getTextFn
                };
                if (!col.renderer && (f.icon || f.link || f.getIconFn || f.getTextFn)) {
                    col.renderer = function (v, m, r, ri, ci) {
                        if ((typeof v == 'string') && v.constructor == String)
                            v = v.replace("<", "&lt;").replace(">", "&gt;");
                        var c = _cm.config[ci];
                        var ic = c.getIconFn ? c.getIconFn(v, r, c) : c.icon;
                        v = c.getTextFn ? c.getTextFn(v, r, c) : v;
                        v = v || "";
                        if (c.link) {
                            var sLink = (c.link == true) ? "javascript:window.__ggrid[" + _gridIdx + "].__cellLinkClick(" + ri + "," + ci + ");" : c.link;
                            v = "<a href='" + sLink + "' class='g-link'>" + v + "</a>";
                        }
                        if (!Ext.isEmpty(ic)) {
                            if (ic.indexOf(".") < 0) ic = r.get(ic);
                            if (!Ext.isEmpty(ic)) v = "<img style='margin-right:2px;vertical-align:middle' src='" + _sPath + ic + "' />" + v;
                        }
                        return v;
                    };
                }
                cols.push(col);
            }
        }
        _st = (_stType == _storeType.arySt) ?
         new Ext.data.ArrayStore({ fields: flds, _storeType: _storeType.arySt }) : new Ext.data.JsonStore({
             fields: flds,
             totalProperty: 'TotalCount',
             _storeType: _storeType.jsnSt,
             idProperty: _stIdProperty,
             root: (cfg.root) ? cfg.root : 'Entities'
         });
        _st.on("update", function () { this.commitChanges(); });
        _cm = new Ext.grid.ColumnModel(cols);
    };
    var _pa = _cfg.pagingAble || _clientPageAble;
    var _pb, _pi = 0, _rn = 0, _rc = 0, _pbTrigger = false;
    var _transData = function (d) {
        var data;
        if (Ext.isArray(d) && d.length > 0 && !Ext.isArray(d[0]) && (_stType == _storeType.arySt)) {
            data = new Array();
            for (var i = 0; i < d.length; i++) {
                data[i] = new Array();
                for (var j = 0; j < _meta.length; j++) data[i][j] = d[i][_meta[j].name];
            }
        }
        else data = d;
        return data;
    };
    var _fillGrid = function (d) {
        var data;
        var _getClientData = function (idx, num) {
            var data = new Object();
            var cusD = _cusCachSt.slice(idx * num, (idx + 1) * num);
            if (_stType == _storeType.jsnSt) data[_jsnDataRoot] = cusD;
            else data = _transData(cusD);
            return data;
        };
        if (_pa) {
            var pc, rn, rc;
            if (!Ext.isArray(d)) {
                _pi = d.pageIndex || _pi;
                _rn = d.recordNum || 0;
                _rc = d.recordCount || 0;
                pc = d.pageCount || Math.ceil(_rc / parseFloat(_rn)) || 0;
                d = d.data;
                if (_pi >= pc && pc > 0) {
                    _pi = pc - 1;
                    _vm.loadData(_fillGrid, _pi);
                    return;
                }
            }
            _pb.updatePageState(pc, _pi, _rn, _rc);
            v.pageIndex = _pi;
        }
        if (!_clientPageAble) data = _transData(d);
        else {
            if (!_pbTrigger) {
                var dd = _transData(d);
                if (Ext.isArray(dd)) _cusCachSt = dd;
                else if (Ext.isObject(dd) && Ext.isArray(dd[_jsnDataRoot])) _cusCachSt = dd[_jsnDataRoot];
                else _cusCachSt = [];
            }
            data = _getClientData(_pi, _rn);
        }
        _st.loadData(data);
        if (v.fireEvent('appendData', _st) === false) return;
        if (v._viewReady && _sel) {
            _selectRecords(_sel);
            _sel = null;
        }
        v.fireEvent('loaddata', data);
        _pbTrigger = false;
    };
    if (_pa) {
        _pb = Gjs.Part.PagingBar.create({
            id: cfg.id ? (cfg.id + '_pagebar') : undefined,
            IsDisplayTotal: cfg.IsDisplayTotal,
            handle: function (idx) {
                _pbTrigger = true;
                _pi = idx;
                v.fireEvent('beforepagechange');
                _vm.loadData(_fillGrid, idx);
            },
            simpleBar: _cfg.simpleBar
        });
        _cfg.bbar = _pb;
    }
    var _updatePageState = function (oper, count, custom) {
        var pc, rn = _rn;
        var curCount = _st.getCount();
        switch (oper) {
            case "insert":
                _rc += count;
                var pc = (_rc > 0) ? Math.ceil(_rc / _rn) : 0;
                break;
            case "delete":
                _rc -= count; //lzj修改调换位置
                var pc = (_rc > 0) ? Math.ceil(_rc / _rn) : 0;
                break;
            case "clear":
                _rc = 0;
                break;
        }
        if (_rc == 0) pc = 0;
        _pi = (pc > 0) ? _pi : 0;
        if ((oper == "delete" && (curCount == 0) && !custom) || (_rc > 0 && _rc % _rn == 0)) {
            _pb.navi(_pi);
        }
        else
            _pb.updatePageState(pc, _pi, _rn, _rc, curCount);
    };
    _initGridParams(_cfg.metadata || _cfg.meta || _vm.metadata || _vm.meta);
    Ext.apply(_cfg, { store: _st, sm: _sm, colModel: _cm, viewModel: null });
    var v = _cfg.editable ? new Ext.grid.EditorGridPanel(_cfg) : new Ext.grid.GridPanel(_cfg);
    if (!window.__ggrid) window.__ggrid = new Array();
    _gridIdx = window.__ggrid.push(v) - 1;
    var _selectRecords = function (recs) {
        if (!_st.getCount()) return;
        if (recs.length) _sm.selectRecords(recs);
    };
    var _sel;
    v.fillGrid = _fillGrid;
    v.on("cellmousedown", function (grid, ri, ci) {
        _curCell = { ri: ri, ci: ci };
    });
    v.on("viewready", function () {
        v._viewReady = true;
        if (_cfg.autoLoadData !== false) this.loadData();
        if (_sel) {
            _selectRecords(_sel);
            _sel = null;
        }
    });
    //获取表格数据
    v.loadData = function (data) {
        if (Ext.isArray(data)) _st.loadData(_transData(data));
        else {
            _pi = data || 0;
            _vm.loadData(_fillGrid, _pi);
        }
    };
    //添加记录
    v.appendNodes = function (data, append) {
        if (data.length < 1) return;
        var arr;
        if (!Ext.isArray(data[0])) {
            arr = new Array();
            for (var i = 0; i < data.length; i++) {
                var n = data[i];
                var arrN = new Array();
                for (var j = 0; j < _meta.length; j++) {
                    var v = n[_meta[j].name];
                    arrN.push(v);
                }
                arr.push(arrN);
            }
        }
        else arr = data;
        _st.loadData(arr, append !== false);
    };
    //插入记录
    v.insertNodes = function (data, index) {
        if (data.length < 1) return;
        var idx = index || 0;
        var arr = new Array();
        var fields = new Array();
        for (var i = 0; i < _meta.length; i++) fields.push(_meta[i].name);
        if (!Ext.isArray(data)) {
            arr.push(new _st.recordType(Gjs.clone(data, fields)));
        }
        else {
            for (var i = 0; i < data.length; i++) {
                var n = data[i];
                var obj;
                if (!Ext.isArray(n)) {
                    obj = Gjs.clone ? Gjs.clone(n, fields) : n;
                }
                else {
                    obj = new Object();
                    for (var j = 0; j < n.length; j++) {
                        if (fields.length <= j) break;
                        obj[fields[j]] = n[j];
                    }
                }
                arr.push(new _st.recordType(obj));
            }
        }
        _st.insert(idx, arr);
        if (_pa) _updatePageState("insert", arr.length); //相关代码问题太多，先临时注释掉
    };
    //移除多条记录
    v.removeNodes = function (nodes) {
        if (Ext.isArray(record)) {
            Ext.each(record, function (r) {
                this.remove(r);
            }, this);
            return;
        }
        var index = this.data.indexOf(record);
        if (index > -1) {
            record.join(null);
            this.data.removeAt(index);
        }
        if (this.pruneModifiedRecords) {
            this.modified.remove(record);
        }
        if (this.snapshot) {
            this.snapshot.remove(record);
        }
        if (index > -1) {
            this.fireEvent('remove', this, record, index);
        }
    };
    //移除单条记录
    v.removeNode = function (node) {
        var n = node || _sm.getSelected();
        var idx = _st.indexOf(n);
        _st.remove(n);
        var iCount = _st.getCount();
        if (idx == iCount && iCount > 0) idx--;
        else if (iCount == 0) idx = -1;
        if (idx != -1) _sm.selectRow(idx);
        if (_pa) _updatePageState("delete", 1);
    };
    //清空列表
    v.removeAll = function (silent) {
        _st.removeAll();
        if (_clientPageAble) _cusCachSt.length = 0;
        if (_pa) _updatePageState("clear");
        if (!silent) v.fireEvent('removeall');
    };
    v.clear = function () {
        this.removeAll(true);
        if (_pa) _updatePageState("clear");
    };
    //移除选中记录
    v.removeSelectNodes = function (node) {
        var n = node || _sm.getSelections();
        for (var i = 0; i < n.length; i++)
            this.removeNode(n[i]);
    };
    //修改记录
    v.modifyNode = function (data, node, onlySetDefinedAttrs) {
        node = node || _sm.getSelected();
        var m = this.metadata || this.meta;
        for (var i = 0; i < m.length; i++) {
            var at = m[i].name;
            if (onlySetDefinedAttrs && !Ext.isDefined(data[at])) continue;
            var v = (Ext.isDefined(data[at])) ? data[at] : "";
            node.set(at, v);
        }
    };
    //清除选择
    v.clearSelections = function () { if (v._viewReady && _st.getCount()) _sm.clearSelections(); };
    //查找包含对应值的记录
    v.find = function (field, value) {
        if (v._viewReady && _st.getCount()) {
            var i = _st.find(field, value);
            return (i >= 0) ? _st.getAt(i) : null;
        }
        else return null;
    };
    //获取选中的记录
    v.getSelectNodes = function () {
        var r;
        if (_cfg.multiSelect) r = _sm.getSelections();
        else {
            var s = _sm.getSelected();
            r = s ? [s] : null;
        }
        return r;
    };
    //选择记录
    v.selectRecord = function (rec) { this.selectRecords([rec]); };
    //选择多个记录
    v.selectRecords = function (recs) {
        if (v._viewReady) _selectRecords(recs);
        else _sel = recs;
    };
    v.selectBy = function (field, value) {
        var arr = Ext.isArray(value) ? value : [value];
        var recs = new Array();
        for (var i = 0; i < arr.length; i++) {
            var v = arr[i];
            if (v == null || v == undefined) continue;
            var rec = this.find(field, v);
            if (rec) recs.push(rec);
        }
        this.selectRecords(recs);
    };
    var _loadMeta = function (meta) {
        var procMeta = function (meta) {
            _initGridParams(meta);
            v._metadata = meta;
            v.reconfigure(_st, _cm);
            if (_cfg.autoLoadData !== false && v._viewReady) v.loadData();
        };
        if (meta) procMeta(meta);
        else _vm.getMetadata(procMeta);
    };
    v.getClientData = function () {
        var d = null;
        if (_clientPageAble) {
            if (_stType == _storeType.arySt) d = _cusCachSt;
            else {
                d = {};
                d[_jsnDataRoot] = _cusCachSt;
            }
        }
        return d;
    };
    v.setSelectedNodes = function (data) {
        _fillGrid(data);
    };
    v.reconfig = function (meta, autoLoad) {
        if (autoLoad) _cfg.autoLoadData = true;
        else if (autoLoad === false) _cfg.autoLoadData = false;
        _loadMeta(meta);
    };
    v.updatePageState = function (oper, count, recordNum, custom) {
        if (_pb) {
            _rn = recordNum || 0;
            _updatePageState(oper, count, custom);
        }
    };
    v.__cellLinkClick = function () { //ri, ci
        var ri = _curCell.ri;
        var ci = _curCell.ci;
        var r = _st.getAt(ri);
        var c = _cm.config[ci];
        this.fireEvent("celllinkclick", this, r, c, ri, ci);
    };
    if (!_meta) _loadMeta();
    else {
        v._metadata = _meta;
        if (_cfg.autoLoadData !== false && v._viewReady) v.loadData();
    }
    return v;
};
Ext.ns("Gjs.View.List");

Gjs.View.List.create = function (cfg) {
    var _vm = cfg.viewModel;
    if (!_vm) return;
    //设置表格初始化参数
    var _cfg = Ext.apply({ autoScroll: true, layout: "fit" }, cfg);
    var _meta = _cfg.metadata || _cfg.meta || _vm.metadata || _vm.meta;
    //根据metadata设置columns和fields
    var _flds = new Array();
    var _cols = new Array();
    for (var i = 0; i < _meta.length; i++) {
        var f = _meta[i];
        _cols.push({ header: f.alias || f.Name || f.name, hidden: f.hidden, dataIndex: f.name, width: f.width });
        _flds.push({ name: f.name });
    }
    var _st = new Ext.data.ArrayStore({ fields: _flds });
    var _pa = _cfg.pagingAble;
    var _pb, _pi;
    var _fillGrid = function (d) {
        if (_pa) {
            var pc;
            if (!Ext.isArray(d)) {
                _pi = d.pageIndex || _pi;
                pc = d.pageCount;
                d = d.data;
            }
            _pb.updatePageState(pc, _pi);
        }
        var data;
        if (d.length > 0 && !Ext.isArray(d[0])) {
            data = new Array();
            for (var i = 0; i < d.length; i++) {
                data[i] = new Array();
                for (var j = 0; j < _meta.length; j++) data[i][j] = d[i][_meta[j].name];
            }
        }
        else data = d;
        _st.loadData(data);
        v.fireEvent('loaddata');
    };
    if (_pa) {
        _pb = Gjs.Part.PagingBar.create({
            handle: function (idx) {
                _pi = idx;
                _vm.loadData(_fillGrid, idx);
            }
        });
        _cfg.bbar = _pb;
    }
    var _list = new Ext.list.ListView({
        autoScroll: _cfg.autoScrol,
        singleSelect: _cfg.singleSelect,
        multiSelect: _cfg.multiSelect,
        columns: _cols,
        store: _st
    });
    Ext.apply(_cfg, { viewModel: null, items: _list });
    var v = new Ext.Panel(_cfg);
    v.list = _list;
    var _sel;
    var _ready = false;
    //获取表格数据
    v.loadData = function (idx) {
        _pi = idx || 0;
        _vm.loadData(_fillGrid, _pi);
    };
    //添加记录
    v.appendNodes = function (data) { _st.loadData(data, true); };
    //移除单条记录
    v.removeNode = function (node) {
        if (!node) {
            var arr = _list.getSelectedRecords();
            if (arr.length > 0) node = arr[0];
        }
        if (node) _st.remove(node);
    };
    //清空列表
    v.removeAll = function (silent) {
        _st.removeAll();
        if (!silent) v.fireEvent('removeall');
    };
    v.clear = function () {
        this.removeAll(true);
        if (_pa) _pb.updatePageState(0, 0);
    };
    //移除选中记录
    v.removeSelectNodes = function () {
        var arr = _list.getSelectedRecords();
        for (var i = 0; i < arr.length; i++) {
            _st.remove(arr[i]);
        }
    };
    //修改记录
    v.modifyNode = function (data, node) {
        if (!node) {
            var arr = _list.getSelectedRecords();
            if (arr.length > 0) node = arr[0];
        }
        if (node) for (var attr in data) { if (node.get(attr)) node.set(attr, data[attr]); }
    };
    //清除选择
    v.clearSelections = function () {
        _list.clearSelections();
    };
    //查找包含对应值的记录
    v.find = function (f, v) {
        if (_ready && _st.getCount()) {
            var i = _st.find(f, v);
            return (i >= 0) ? _st.getAt(i) : null;
        }
        else return null;
    };
    //获取选中的记录
    v.getSelectNodes = function () {
        return _list.getSelectedRecords();
    };
    //选择
    v.select = function (r) { _list.select(r); };
    //选择记录
    v.selectRecord = function (rec) { _list.select(rec); };
    //选择多个记录
    v.selectRecords = function (recs) { _list.select(recs); };
    if (_cfg.autoLoadData !== false) v.loadData();
    v.fillGrid = _fillGrid;
    return v;
};
Ext.ns("Gjs.View.Tree");
Gjs.View.Tree.create = function (cfg) {
    var _vm = cfg.viewModel;
    if (!_vm) return;
    var _badBrowser = Ext.isIE8;
    //设置初始化参数
    var _loadBlock = (cfg.autoLoadData === false);
    var _root = new Ext.tree.TreeNode({ isRoot: true });
    var _cfg = Ext.apply({ viewModel: null, animate: false, autoScroll: true, rootVisible: false,
        fitToFrame: true, containerScroll: true, root: _root, cls: 'g-tree-cls'
    }, cfg);
    var _iMaxNodeCount = (_cfg.childNodesLoadCount == 0) ? 0 : (_cfg.childNodesLoadCount || 50);
    var v = new Ext.tree.TreePanel(_cfg);
    var _appendChildNode = function (d, pNode, batch, isMoreOptNode) {
        if (!batch) pNode.beginUpdate();
        if (_cfg.multiSelect && d.checkable !== false && !isMoreOptNode) {
            d.checked = _cfg.checkedAttr ? d[_cfg.checkedAttr] : (d.checked || false);
            if (_cfg.multiSelect && _cfg.cascadeCheck && d.checked === false && pNode.attributes.checked) d.checked = true;
        }
        else d.checked = undefined;

        var n = new Ext.tree.TreeNode(isMoreOptNode ? { isMoreNode: true, text: Gjs.Res.get("Lab_More") + "...", expandable: false, checkable: false} : {
            text: _cfg.displayAttr ? d[_cfg.displayAttr] : ((d.text == undefined) ? d.name : d.text),
            icon: _cfg.iconAttr ? d[_cfg.iconAttr] : d.icon,
            qtip: _cfg.qtipAttr ? d[_cfg.qtipAttr] : "",
            expandable: _cfg.leafAttr ? !d[_cfg.leafAttr] : !d.leaf,
            expanded: d.expanded,
            disabled: d.disabled,
            checked: d.checked,
            hidden: d.hidden
        });
        Ext.apply(n.attributes, d);
        n.get = function (attr) { return this.attributes[attr]; };
        var mNode;
        if (!isMoreOptNode) {
            var arr = pNode.childNodes;
            if (!Ext.isEmpty(arr)) {
                var ln = arr[arr.length - 1];
                if (ln.get('isMoreNode')) mNode = ln;
            }
        }
        var cNode = mNode ? pNode.insertBefore(n, mNode) : pNode.appendChild(n);
        if (_iMaxNodeCount > 0) {
            cNode.eachChild = function (fn, scope, args) {
                var cs = this.childNodes;
                for (var i = 0, len = cs.length; i < len; i++) {
                    if (cs[i].get('isMoreNode')) continue;
                    if (fn.apply(scope || cs[i], args || [cs[i]]) === false) {
                        break;
                    }
                }
            };
        }
        if (!batch) pNode.endUpdate();
        if (_badBrowser && v.rendered) {
            v.show();
        }
        if (!isMoreOptNode) v.fireEvent('appendnode', pNode, cNode, batch);
        return cNode;
    };
    var _expandNode = function (node) {
        if ((!node.childNodes || !node.childNodes.length) && (node.expandable || (node.get("leaf") == false))) {
            node.expand();
        }
    };
    var _appendNodes = function (nodes, pNode) {
        pNode = pNode || _root;
        pNode.beginUpdate();
        var firstNode, lastNode;
        for (var i = 0; i < nodes.length; i++) {
            if (_iMaxNodeCount > 0 && i > _iMaxNodeCount - 1) {
                var arrRest = nodes.slice(i);
                lastNode = _appendChildNode({}, pNode, true, true);
                lastNode.__restNodes = arrRest;
                break;
            }
            n = _appendChildNode(nodes[i], pNode, true);
            firstNode = firstNode || n;
        }
        pNode.endUpdate();
        if (lastNode) {
            lastNode.on("beforeclick", function (node, e) {
                var p = node.parentNode;
                _appendNodes(node.__restNodes, p);
                p.removeChild(node, true);
                e.stopEvent();
                return false;
            });
        }
        if (_cfg.autoExpandRoot && v.rendered && !_vLocateKey && firstNode) {
            if (pNode == _root) {
                if (!pNode.isExpanded()) {
                    pNode.expanded = false;
                    pNode.expand();
                }
                _expandNode(pNode.childNodes[0]);
            }
            else if (pNode.parentNode == _root && pNode.childNodes.length == 1 && pNode == _root.childNodes[0]) {
                _expandNode(pNode.childNodes[0]);
            }
        }
        v.fireEvent('appendnodes', pNode, firstNode);
    };
    if (_cfg.autoExpandRoot) v.on('afterrender', function () {
        if (_root.childNodes.length > 0) {
            _expandNode(_root.childNodes[0]);
        }
    });
    v.on("beforeexpandnode", function (node) {
        if (node.childNodes.length) return;
        var loadNodes = function (data) {
            if (!node.childNodes) return;
            if (data && data.length > 0 && node.childNodes.length == 0) {
                _appendNodes(data, node);
                if (_vLocateKey) _locateNode(node);
            }
            else {
                node.attributes.expandable = false;
                node.ui.updateExpandIcon();
                if (_vLocateKey) _locateOver();
            }
        };
        if (node == _root) {
            if (_loadBlock) {
                loadNodes([]);
                _loadBlock = undefined;
            }
            else _vm.getRootNodes(loadNodes);
        }
        else _vm.getChildNodes(node.attributes, loadNodes);
    });
    if (_cfg.multiSelect && !_cfg.dblclickCheck) {
        v.on("beforedblclick", function (node, e) {
            if (node.isExpandable()) {
                if (!node.ui.animating) {
                    node.toggle();
                }
                this.fireEvent("dblclick", node, e);
                return false;
            }
        });
    }
    if (_cfg.multiSelect && _cfg.cascadeCheck) {
        v.on("checkchange", function (node, checked) {
            if (node._nocasc) return;
            if (!checked) {
                var pn = node.parentNode;
                while (pn && pn.attributes.checked) {
                    pn._nocasc = true;
                    pn.getUI().toggleCheck(false);
                    pn._nocasc = false;
                    pn = pn.parentNode;
                }
            }
            var f = function () {
                var s = this.attributes.checked;
                if (s == checked) return false;
                if (s === false || s === true) {
                    this._nocasc = true;
                    this.getUI().toggleCheck(checked);
                    this._nocasc = false;
                }
            };
            Ext.each(node.childNodes, function (cn) {
                cn.cascade(f);
            });
        });
    }
    v.getSelectNodes = function () {
        var ms = _cfg.multiSelect;
        var nodes;
        if (ms && _cfg.cascadeCheck) {
            nodes = [];
            var f = function () {
                if (this.attributes.checked) {
                    nodes.push(this);
                    return false;
                }
            };
            v.root.cascade(f);
        }
        else {
            nodes = ms ? this.getChecked() : this.getSelectionModel().getSelectedNode();
        }
        var ret = new Array();
        if (ms) {
            for (var i = 0; i < nodes.length; i++) {
                ret[i] = nodes[i];
            }
        }
        else {
            if (nodes) {
                ret[0] = nodes;
            }
        }
        return ret;
    };
    v.getSingleSelectNode = function () {
        var arr = this.getSelectNodes();
        return (arr.length > 0) ? arr[0] : null;
    };
    v.reloadChildNodes = function (node) {
        if (node) {
            node.removeAll();
            node.expanded = false;
            node.attributes.expandable = true;
            node.expand();
        }
        else this.reloadNodes();
    };
    v.reloadNodes = function () {
        this.clearNodes();
        _root.expand();
    };
    v.appendChildNode = function (data, pNode) {
        var pn = pNode || this.getSelectionModel().getSelectedNode() || _root;
        return _appendChildNode(data, pn);
    };
    v.removeSelectNode = function (node) {
        var n = node || this.getSelectionModel().getSelectedNode();
        if (!n) return;
        var p = n.parentNode;
        p.removeChild(n, true);
        p.ui.updateExpandIcon();
    };
    v.modifySelectNode = function (nodeData, node) {
        var nd = nodeData;
        var n = node || this.getSelectionModel().getSelectedNode();
        if (!n) return;
        n.setText(nd.text || nd.name);
        Ext.apply(n.attributes, nd);
    };
    v.clearSelections = function () {
        var ms = _cfg.multiSelect;
        if (ms) {
            var arr = this.getChecked();
            for (var i = 0; i < arr.length; i++) {
                var n = arr[i];
                var attrs = n.attributes;
                if (attrs.checked != undefined) {
                    arr[i].ui.checkbox.checked = false;
                    attrs.checked = false;
                }
            }
        }
    };
    v.moveUp = function (node, preNode) {
        var n = node || this.getSelectionModel().getSelectedNode();
        var preN = preNode || n.previousSibling;
        if (!n.isFirst() && !n.get('isMoreNode') && !preN.get('isMoreNode')) {
            n.parentNode.insertBefore(n, preN);
            this.getSelectionModel().select(n);
        }
    };
    v.moveDown = function (node, nextNode) {
        var n = node || this.getSelectionModel().getSelectedNode();
        var nexN = nextNode || n.nextSibling;
        if (!n.isLast() && !n.get('isMoreNode') && !nexN.get('isMoreNode')) {
            n.parentNode.insertBefore(nexN, n);
            this.getSelectionModel().select(n);
        }
    };
    var _vLocateKey, _vLocatePathArray, _vLocateCallback;
    var _locateOver = function (node) {
        _vLocateKey = null;
        _vLocatePathArray = null;
        if (_vLocateCallback) _vLocateCallback(node);
        else if (node) node.select();
        Gjs.Part.WindowMask.hide(true);
    };
    var _locateNode = function (pNode, keyValue) {
        if (!pNode.isLeaf()) {
            var nodes = pNode.childNodes;
            if (nodes.length < 1) {
                pNode.expand();
                return;
            }
            var key = _vLocateKey;
            var arr = _vLocatePathArray;
            var kv = arr.shift();
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                if (n.get(key) == kv) {
                    if (!pNode.isExpanded()) pNode.expand();
                    if (arr.length > 0) _locateNode(n);
                    else _locateOver(n);
                    return;
                }
            }
        }
        _locateOver();
    };
    v.locate = function (keyField, keyPathArray, callback) {
        Gjs.Part.WindowMask.show(true);
        _vLocateKey = keyField;
        _vLocatePathArray = keyPathArray;
        _vLocateCallback = callback;
        _locateNode(_root);
    };
    v.clearNodes = function () {
        _root.removeAll(true);
        _root.expanded = false;
    };
    return v;
};

Gjs.Framework = function (cfg) {
    this.requestMethods = {};
    this.methods = {};
    this.actions = {};
    this.items = {};
    var _idIdx = {};
    this.imagePath = cfg.imagePath || "";
    this.request = cfg.request || function (req) { Gjs.Ajax.request(req); };
    this.addRequestMethod = function (name, fn) {
        this.requestMethods[name] = fn;
        return fn;
    };
    this.addMethod = function (name, fn) {
        this.methods[name] = fn;
        return fn;
    };
    this.addAct = function (cfg) {
        var act;
        var c = Ext.apply({}, cfg);
        var _id = c.id || c.name;
        if (_id) {
            var _idw = _id;
            while (_idIdx[_idw]) _idw += "_1";
            c.id = _idw;
            _idIdx[_idw] = true;
        };
        if (c.type == "-" || c.type == "|" || c.type == "separator") {
            act = (c.isMenu == "menu") ? new Ext.menu.Separator() : new Ext.Toolbar.Separator();
        }
        else {
            if (cfg.icon) {
                if (!c.cls) c.cls = "x-btn-text-icon";
                c.icon = this.imagePath + c.icon;
            }
            delete c.name;
            if (Ext.isString(c.handler)) {
                var h = this.methods[c.handler];
                c.handler = h;
                c.scope = this;
            }
            if (c.rightMenu) {
                act = new Ext.menu.Item(c);
            }
            else if (c.menu) {
                if (!c.handler) c.handler = function () { this.showMenu(); };
                act = new Ext.Toolbar.SplitButton(c);
                //else act = new Ext.menu.Menu(c);
            }
            else if (Ext.isDefined(c.checked)) {
                act = new Ext.menu.CheckItem(c);
            }
            else act = new Ext.Action(c);
        }
        act.groupId = c.group;
        if (cfg.name) this.actions[cfg.name] = act;
        return act;
    };
    this.addItem = function (name, item) {
        this.items[name] = item;
        return item;
    };
    this.foreachAction = function (fn) {
        for (var act in this.actions) fn(this.actions[act]);
    };
    this.foreachActionInGroup = function (groupId, fn) {
        this.foreachAction(function (act) { if (act.groupId == groupId) fn(act); });
    };
    this.disableActGroup = function (groupId) {
        this.foreachActionInGroup(groupId, function (act) { act.setDisabled(true); });
    };
    this.enableActGroup = function (groupId) {
        this.foreachActionInGroup(groupId, function (act) { act.setDisabled(false); });
    };
    this.showActGroup = function (groupId) {
        this.foreachActionInGroup(groupId, function (act) { act.show(true); });
    };
    this.hideActGroup = function (groupId) {
        this.foreachActionInGroup(groupId, function (act) { act.hide(false); });
    };
    var _ready;
    this.run = cfg.run;
    this.init = function () {
        cfg.init.apply(this);
        Ext.apply(this, this.items);
        _ready = true;
    };
    if (cfg.show) {
        this.show = function () {
            if (!_ready) this.init();
            cfg.show.apply(this, arguments);
        };
    }
    else this.init();
};﻿//功能：将Ext的TreePanel简单封装
//最后修改：2011-6-23
//创建方法：GTP.View.SimpleTree.create({viewModel: {}, multiSelect: bool})
//获取选择结果方法：getSelectNodes() //返回： [{}, {}, {}]
//增加节点方法：appendChildNode(nodeData, pNode)  //若pNode为空，则默认为当前选中节点，再为空则为根节点
//修改节点方法：modifySelectNode(nodeData, node)  //若node为空，则默认为当前选中节点
//移除节点方法：removeSelectNode(node)  //若node为空，则默认为当前选中节点
//需模型支持方法(viewModel创建参数中实现)：
//1、getRootNodes: function (callback) //callback参数：[{name:'',alias:'',width:''}, {}]
//2、getChildNodes: function (pNode, callback) //callback参数：[{text:'', leaf:bool, checked:bool, checked:bool}, {}]

Ext.ns("GTP.View.SimpleTree").create = function (cfg) {
    var _vm = cfg.viewModel;
    if (!_vm) return;
    //设置初始化参数
    var _loadBlock = (cfg.autoLoadData === false);
    var _root = new Ext.tree.TreeNode({ isRoot: true });
    var _cfg = Ext.apply({ viewModel: null, animate: false, autoScroll: true, rootVisible: false,
        fitToFrame: true, containerScroll: true, root: _root
    }, cfg);
    var v = new Ext.tree.TreePanel(_cfg);
    var _appendChildNode = function (d, pNode, batch) {
        if (!batch) pNode.beginUpdate();
        if (_cfg.multiSelect && d.checkable !== false) {
            d.checked = d.checked || false;
        }
        else d.checked = undefined;
        var n = new Ext.tree.TreeNode({
            text: _cfg.displayAttr ? d[_cfg.displayAttr] : ((d.text == undefined) ? d.name : d.text),
            icon: _cfg.iconAttr ? d[_cfg.iconAttr] : d.icon,
            expandable: _cfg.leafAttr ? !d[_cfg.leafAttr] : !d.leaf,
            checked: _cfg.checkedAttr ? !d[_cfg.checkedAttr] : !d.checked
        });
        Ext.apply(n.attributes, d);
        n.get = function (attr) { return this.attributes[attr]; };
        pNode.appendChild(n);
        if (!batch) pNode.endUpdate();
        v.fireEvent('appendnode', pNode, n, batch);
        return n;
    };
    var _appendNodes = function (nodes, pNode) {
        pNode = pNode || _root;
        pNode.beginUpdate();
        var firstNode;
        for (var i = 0; i < nodes.length; i++) {
            n = _appendChildNode(nodes[i], pNode, true);
            firstNode = firstNode || n;
        }
        pNode.endUpdate();
        v.fireEvent('appendnodes', pNode, firstNode);
    };
    v.on("beforeexpandnode", function (node) {
        if (node.childNodes.length) return;
        var loadNodes = function (data) {
            if (data && data.length > 0 && node.childNodes.length == 0) {
                _appendNodes(data, node);
                if (_vLocateKey) _locateNode(node);
            }
            else {
                node.attributes.expandable = false;
                node.ui.updateExpandIcon();
                if (_vLocateKey) _locateOver();
            }
        };
        if (node == _root) {
            if (_loadBlock) {
                loadNodes([]);
                _loadBlock = undefined;
            }
            else _vm.getRootNodes(loadNodes);
        }
        else _vm.getChildNodes(node.attributes, loadNodes);
    });
    v.getSelectNodes = function () {
        var ms = _cfg.multiSelect;
        var nodes = ms ? this.getChecked() : this.getSelectionModel().getSelectedNode();
        var ret = new Array();
        if (ms) {
            for (var i = 0; i < nodes.length; i++) {
                ret[i] = nodes[i];
            }
        }
        else {
            if (nodes) {
                ret[0] = nodes;
            }
        }
        return ret;
    };
    v.getSingleSelectNode = function () {
        var arr = this.getSelectNodes();
        return (arr.length > 0) ? arr[0] : null;
    };
    v.reloadChildNodes = function (node) {
        if (node) {
            node.removeAll();
            node.expanded = false;
            node.attributes.expandable = true;
            node.expand();
        }
        else this.reloadNodes();
    };
    v.reloadNodes = function () {
        this.clearNodes();
        _root.expand();
    };
    v.appendChildNode = function (data, pNode) {
        var pn = pNode || this.getSelectionModel().getSelectedNode() || _root;
        return _appendChildNode(data, pn);
    };
    v.removeSelectNode = function (node) {
        var n = node || this.getSelectionModel().getSelectedNode();
        if (!n) return;
        var p = n.parentNode;
        p.removeChild(n, true);
        p.ui.updateExpandIcon();
    };
    v.modifySelectNode = function (nodeData, node) {
        var nd = nodeData;
        var n = node || this.getSelectionModel().getSelectedNode();
        if (!n) return;
        n.setText(nd.text || nd.name);
        Ext.apply(n.attributes, nd);
    };
    v.clearSelections = function () {
        var ms = _cfg.multiSelect;
        if (ms) {
            var arr = this.getChecked();
            for (var i = 0; i < arr.length; i++) {
                var n = arr[i];
                var attrs = n.attributes;
                if (attrs.checked != undefined) {
                    arr[i].ui.checkbox.checked = false;
                    attrs.checked = false;
                }
            }
        }
    };
    v.moveUp = function (node, preNode) {
        var n = node || this.getSelectionModel().getSelectedNode();
        var preN = preNode || n.previousSibling;
        if (!n.isFirst()) {
            n.parentNode.insertBefore(n, preN);
            this.getSelectionModel().select(n);
        }
    };
    v.moveDown = function (node, nextNode) {
        var n = node || this.getSelectionModel().getSelectedNode();
        var nexN = nextNode || n.nextSibling;
        if (!n.isLast()) {
            n.parentNode.insertBefore(nexN, n);
            this.getSelectionModel().select(n);
        }
    };
    var _vLocateKey, _vLocatePathArray, _vLocateCallback;
    var _locateOver = function (node) {
        _vLocateKey = null;
        _vLocatePathArray = null;
        if (_vLocateCallback) _vLocateCallback(node);
        else if (node) node.select();
        GTP.Util.hideMask(true);
    };
    var _locateNode = function (pNode, keyValue) {
        if (!pNode.isLeaf()) {
            var nodes = pNode.childNodes;
            if (nodes.length < 1) {
                pNode.expand();
                return;
            }
            var key = _vLocateKey;
            var arr = _vLocatePathArray;
            var kv = arr.shift();
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                if (n.get(key) == kv) {
                    if (!pNode.isExpanded()) pNode.expand();
                    if (arr.length > 0) _locateNode(n);
                    else _locateOver(n);
                    return;
                }
            }
        }
        _locateOver();
    };
    v.locate = function (keyField, keyPathArray, callback) {
        GTP.Util.showMask(true);
        _vLocateKey = keyField;
        _vLocatePathArray = keyPathArray;
        _vLocateCallback = callback;
        _locateNode(_root);
    };
    v.clearNodes = function () {
        _root.removeAll(true);
        _root.expanded = false;
    };
    return v;
};
﻿//功能：将Ext的GridPanel简单封装
//最后修改：2011-8-10
//创建方法：GTP.View.SimpleGrid.create({viewModel: {}, multiSelect: bool, pagingAble: bool})
//获取选择结果方法：getSelectNodes() //返回： [{}, {}, {}]
//添加表格行方法：appendNode(nodeData)
//修改表格行方法：modifyNode(data, node) //若node为空，则默认为当前选中节点
//移除(唯一)选中行方法：removeNode(node) //若node为空，则默认为当前选中节点
//移除所有选中行方法：removeSelectNodes()
//清除选择方法：clearSelections()
//需模型支持方法(viewModel创建参数中实现)：
//1、getMetadata: function (callback) //callback参数：[{name:'',alias:'',width:'', icon:''}]
//2、loadData: function (callback, [pageIndex]) //callback参数：[[],[],[]] or [{}, {}, {}] or {pageIndex:n, pageCount:m , data:[]}
//更新日志：
//2011-8-10 增加单元格中显示图标的功能
Ext.ns("GTP.View.SimpleGrid").create = function (cfg) {
    var _vm = cfg.viewModel;
    //if (!_vm) return;
    //设置表格初始化参数
    var _meta;
    var _cfg = Ext.apply({ autoScroll: true, stripeRows: true }, cfg);
    var _sPath = cfg.imagePath || "";
    var _st, _cm, _sm;
    var _dragable = _cfg.enableDragDrop || _cfg.enableDrag;
    var _multiSel = _cfg.multiSelect;
    var _useCustomCheckSM = _cfg.useCustomCheckSM;
    var _canMultiSel = _multiSel && !_dragable && !_useCustomCheckSM;
    _sm = (_canMultiSel) ? new Ext.grid.CheckboxSelectionModel() : (_useCustomCheckSM) ? new Ext.ux.grid.GtpCheckColumn({ dataIndex: "$useCustomCheck$", width: 23, resizable: false, align: 'center' }) : new Ext.grid.RowSelectionModel({ singleSelect: !_multiSel });
    //根据metadata设置columns和fields
    var _initGridParams = function (meta) {
        _meta = meta;
        var flds = new Array();
        var cols = new Array();
        if (_canMultiSel || _useCustomCheckSM) cols.push(_sm);
        if (!_meta) {
            flds.push({ name: "$" });
            cols.push({ header: "", dataIndex: "$" });
        }
        else {
            if (_cfg.showRowNumber) cols.push(new Ext.grid.RowNumberer());
            for (var i = 0; i < _meta.length; i++) {
                var f = _meta[i];
                f.name = (f.dataIndex || f.fieldName || f.name || f.id || "").trim();
                f.alias = (f.header || f.alias || f.name || "").trim();
                if (!f.hidden) cols.push({
                    id: f.id,
                    header: f.alias,
                    dataIndex: f.name,
                    width: f.width,
                    icon: f.icon,
                    align: f.align,
                    sortable: f.sortable,
                    editor: f.editor,
                    menuDisabled: (f.menuDisabled != false),
                    renderer: f.renderer || (f.icon ? function (v, m, r, ri, ci) {
                        var s = v;
                        if (v != "") {
                            var ic = _cm.config[ci].icon;
                            s = _sPath + ((ic.indexOf(".") > 0) ? ic : r.get(ic));
                            s = s ? "<img style='vertical-align:middle' src='" + s + "'>" + v + "</img>" : v;
                        }
                        return s;
                    } : undefined)
                });
                flds[i] = { name: f.name };
            }
        }
        _st = new Ext.data.ArrayStore({ fields: flds,
            listeners: {
                "update": function () { this.commitChanges(); }
            }
        });
        _cm = new Ext.grid.ColumnModel(cols);
    };
    var _pa = _cfg.pagingAble;
    var _pb, _pi;
    var _transData = function (d) {
        var data;
        if (Ext.isArray(d) && d.length > 0 && !Ext.isArray(d[0])) {
            data = new Array();
            for (var i = 0; i < d.length; i++) {
                data[i] = new Array();
                for (var j = 0; j < _meta.length; j++) data[i][j] = d[i][_meta[j].name];
            }
        }
        else data = d;
        return data;
    };
    var _fillGrid = function (d) {
        if (_pa) {
            var pc, rn, rc;
            if (!Ext.isArray(d)) {
                _pi = d.pageIndex || _pi;
                rn = d.recordNum;
                rc = d.recordCount;
                pc = d.pageCount || Math.ceil(d.recordCount / parseFloat(rn));
                d = d.data;
            }
            _pb.updatePageState(pc, _pi, rn, rc);
            v.pageIndex = _pi;
        }
        _st.loadData(_transData(d));
        if (v._viewReady && _sel) {
            _selectRecords(_sel);
            _sel = null;
        }
        v.fireEvent('loaddata');
    };
    if (_pa) {
        _pb = GTP.View.Wgt.PagingBar.create({
            handle: function (idx) {
                _pi = idx;
                _vm.loadData(_fillGrid, idx);
            },
            simpleBar: _cfg.simpleBar
        });
        _cfg.bbar = _pb;
    }
    _initGridParams(_cfg.metadata || _cfg.meta || _vm.metadata || _vm.meta);
    Ext.apply(_cfg, { store: _st, sm: _sm, colModel: _cm, viewModel: null });
    var v = _cfg.editable ? new Ext.grid.EditorGridPanel(_cfg) : new Ext.grid.GridPanel(_cfg);
    var _selectRecords = function (recs) {
        if (!_st.getCount()) return;
        if (recs.length) _sm.selectRecords(recs);
    };
    var _sel;
    v.on("viewready", function () {
        v._viewReady = true;
        if (_cfg.autoLoadData !== false) this.loadData();
        if (_sel) {
            _selectRecords(_sel);
            _sel = null;
        }
    });
    //获取表格数据
    v.loadData = function (data) {
        if (Ext.isArray(data)) _st.loadData(_transData(data));
        else {
            _pi = data || 0;
            _vm.loadData(_fillGrid, _pi);
        }
    };
    //添加记录
    v.appendNodes = function (data, append) {
        if (data.length < 1) return;
        var arr;
        if (!Ext.isArray(data[0])) {
            arr = new Array();
            for (var i = 0; i < data.length; i++) {
                var n = data[i];
                var arrN = new Array();
                for (var j = 0; j < _meta.length; j++) {
                    var v = n[_meta[j].name];
                    arrN.push(v);
                }
                arr.push(arrN);
            }
        }
        else arr = data;
        _st.loadData(arr, append !== false);
    };
    //插入记录
    v.insertNodes = function (data, index) {
        if (data.length < 1) return;
        var idx = index || 0;
        var arr = new Array();
        var fields = new Array();
        for (var i = 0; i < _meta.length; i++) fields.push(_meta[i].name);
        if (!Ext.isArray(data)) {
            arr.push(new _st.recordType(GTP.clone(data, fields)));
        }
        else {
            for (var i = 0; i < data.length; i++) {
                var n = data[i];
                var obj;
                if (!Ext.isArray(n)) {
                    obj = GTP.clone ? GTP.clone(n, fields) : n;
                }
                else {
                    obj = new Object();
                    for (var j = 0; j < n.length; j++) {
                        if (fields.length <= j) break;
                        obj[fields[j]] = n[j];
                    }
                }
                arr.push(new _st.recordType(obj));
            }
        }
        _st.insert(idx, arr);
    };
    //移除单条记录
    v.removeNode = function (node) {
        var n = node || _sm.getSelected();
        var idx = _st.indexOf(n);
        _st.remove(n);
        var iCount = _st.getCount();
        if (idx == iCount && iCount > 0) idx--;
        else if (iCount == 0) idx = -1;
        if (idx != -1)
            _sm.selectRow(idx);
    };
    //清空列表
    v.removeAll = function (silent) {
        _st.removeAll();
        if (!silent) v.fireEvent('removeall');
    };
    v.clear = function () {
        this.removeAll(true);
        if (_pa) _pb.updatePageState(0, 0, 0, 0);
    };
    //移除选中记录
    v.removeSelectNodes = function (node) {
        var n = node || _sm.getSelections();
        for (var i = 0; i < n.length; i++)
            this.removeNode(n[i]);
    };
    //修改记录
    v.modifyNode = function (data, node) {
        node = node || _sm.getSelected();
        var m = this.metadata || this.meta;
        for (var attr in m) {
            var at = m[attr].name;
            node.set(at, (Ext.isDefined(data[at])) ? data[at] : "");
        }
    };
    //清除选择
    v.clearSelections = function () { if (v._viewReady && _st.getCount()) _sm.clearSelections(); };
    //查找包含对应值的记录
    v.find = function (field, value) {
        if (v._viewReady && _st.getCount()) {
            var i = _st.find(field, value);
            return (i >= 0) ? _st.getAt(i) : null;
        }
        else return null;
    };
    //获取选中的记录
    v.getSelectNodes = function () {
        var r;
        if (_cfg.multiSelect) r = _sm.getSelections();
        else {
            var s = _sm.getSelected();
            r = s ? [s] : null;
        }
        return r;
    };
    //选择记录
    v.selectRecord = function (rec) { this.selectRecords([rec]); };
    //选择多个记录
    v.selectRecords = function (recs) {
        if (v._viewReady) _selectRecords(recs);
        else _sel = recs;
    };
    //按字段值选择记录
    v.selectBy = function (field, value) {
        var arr = Ext.isArray(value) ? value : [value];
        var recs = new Array();
        for (var i = 0; i < arr.length; i++) {
            var v = arr[i];
            if (v == null || v == undefined) continue;
            var rec = this.find(field, v);
            if (rec) recs.push(rec);
        }
        this.selectRecords(recs);
    };
    var _loadMeta = function (meta) {
        function procMeta(meta) {
            _initGridParams(meta);
            v._metadata = meta;
            v.reconfigure(_st, _cm);
            if (_cfg.autoLoadData !== false && v._viewReady) v.loadData();
        }
        if (meta) procMeta(meta)
        else _vm.getMetadata(procMeta);
    };
    v.reconfig = function (meta, autoLoad) {
        if (autoLoad) _cfg.autoLoadData = true;
        else if (autoLoad === false) _cfg.autoLoadData = false;
        _loadMeta(meta);
    };
    if (!_meta) _loadMeta();
    else {
        v._metadata = _meta;
        if (_cfg.autoLoadData !== false && v._viewReady) v.loadData();
    }
    return v;
};


//-----扩展CheckColumn---
Ext.ns('Ext.ux.grid');

Ext.ux.grid.GtpCheckColumn = Ext.extend(Ext.grid.Column, {
    /**
    * @private
    * Process and refire events routed from the GridView's processEvent method.
    */
    processEvent: function (name, e, grid, rowIndex, colIndex) {
        if (name == 'mousedown' || name == 'click') {
            var record = grid.store.getAt(rowIndex);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
            grid.store.commitChanges();
            //return false; // Cancel row selection.
        } else {
            return Ext.grid.ActionColumn.superclass.processEvent.apply(this, arguments);
        }
    },
    renderer: function (v, p, record) {
        p.css += ' x-grid3-check-col-td';
        //return String.format('<div><input type="checkbox" {0} ></div>', v ? 'checked' : '');
        return String.format('<div class="x-grid3-check-col{0}">&#160;</div>', v ? '-on' : '');
    },

    // Deprecate use as a plugin. Remove in 4.0
    init: Ext.emptyFn
});﻿//组织视图处理ViewModel
Ext.ns("Org.Wgt");
Org.Wgt.TreeViewModel = function () {

    //#region [字符资源，完成后挪走]
    var _res = {
        Alt_LoadInfo: '加载{0}',
        NewRootDept: '根部门',
        NewLowerDept: '下级部门',
        DeptList: '部门列表',
        DeptInfo: '部门信息',
        Act_Filter: '过滤',
        AuthItem: '权限项',
        VisibleParentNode: '查看父节点',
        SelectedOrgNode: '已选择组织节点'
    }
    //#endregion
    var _getOrgRoot = function () {
        return Gjs.getWebAppPath();
    };
    //#region [request方法]
    var _req = function (req) { Gjs.Ajax.request(Ext.apply(req, { url: _getOrgRoot() + 'WebHttpHandle.ashx' })); };
    var _requestMethods = {
        //获取指定组织类别的根组织
        getRootDepts: function (orgType, cb) {
            _req({
                ctrl: "GTP.Org.Action.DeptService",
                cmd: "GetRootDepts",
                data: [orgType, ''],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.NewRootDept),
                cb: cb
            });
        },
        //获取指定根节点的子节点信息，incDm：是否显示虚部门、incPt:是否显示岗位
        getChildDetps: function (pId, incDm, incPt, cb) {
            _req({
                ctrl: "GTP.Org.Action.DeptService",
                cmd: "GetChildDepts",
                data: [pId, incDm, incPt],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.NewLowerDept),
                cb: cb
            });
        },
        //获取指定类别下节点信息列表分页显示
        getAllDeptsPage: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.DeptService",
                cmd: "GetAllDeptsPage",
                data: data,
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.DeptList),
                cb: cb
            });
        },
        //获取全部组织数据 parentId为null时获取根组织数据
        getOrgUnitChildNodes: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetChildOrgUnitLists",
                data: data,
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.DeptInfo),
                cb: cb
            });
        },
        //查询全部组织列表数据，分页显示
        queryOrgObjectPage: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "QueryOrgObjectPage",
                data: data,
                dataNode: "Data",
                title: _res.Act_Filter + _res.DeptInfo,
                cb: cb
            });
        },
        //根据权限Code加载有权限的信息
        getOrgPermisByAuthCode: function (authCode, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetCommonAuthItem",
                data: [authCode],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.AuthItem),
                cb: cb
            });
        },
        //根据有权限的NodeId获取所有父节点Id
        getParentIdByNodeId: function (ids, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetDeptParentListByDeptIds",
                data: [ids],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.VisibleParentNode),
                cb: cb
            });
        },
        //根据Id获取对应的组织节点对象
        getSelectorNodesByNodeId: function (ids, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetOrgUnitListByOrgUnit",
                data: [ids],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.SelectedOrgNode),
                cb: cb
            });
        },
        getOrgNodeByBizTypeCode: function (typeCode, cb) {
            _req({
                ctrl: "GTP.Org.Action.DeptService",
                cmd: "GetQueryDeptsByLevelOrBizType",
                data: [typeCode, 0, null],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.SelectedOrgNode),
                cb: cb
            });
        },
        //部门树查询列表
        queryOrgUnitPage: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetQueryOrgUnitListPage",
                data: data,
                dataNode: "Data",
                title: _res.Act_Filter + _res.DeptInfo,
                cb: cb
            });
        }
    }
    //#endregion

    var _rp = function () { return "/Common/images/org/"; };
    var _calcImage = function (type) {
        var img = isRoot ? "dept_root.png" : ((type == "Common") ? "dept.png" : (type == "Position") ? "post.png" : "dummy.png");
        return _rp() + img;
    };
    var _calcImageByObjType = function (rec) {
        var img;
        var tp = rec.get("ObjType");
        var stp = rec.get("SubType");
        switch (tp) {
            case 0:
                img = (stp == 1) ? "post.png" : "dept.png";
                break;
            case 1:
                img = (stp == 1) ? "female.png" : "male.png";
                break;
            case 2:
                img = "role.png";
                break;
            case 3:
                img = "role_group.png";
                break;
        };
        return _rp() + img;
    };
    var _calcGroupImage = function (rec) {
        var tp = rec.get("ObjType");
        var img = (tp < 2) ? "dept.png" : "role_group.png";
        return _rp() + img;
    };

    //格式化节点节点属性
    var _formatNodes = function (node, isRoot, multiSelect) {
        var d = Gjs.EntityHelper.decodeEntityReference(node);
        var n = {
            id: node.DeptId,
            name: node.Name,
            leaf: node.IsLeaf,
            nodeType: node.NodeType.name,
            viewType: node.DeptGroup.ViewType.Id,
            icon: _calcImage(node.NodeType.name),
            fullDeptId: node.FullDeptId,
            orgRoot: isRoot === true
        };
        if (multiSelect && n.checkable !== false) {
            n.checked = n.checked || false;
        }
        else n.checked = undefined;
        return n;
    };

    var changeNodeAttrToLower = function (node) {
        var n = new Object();
        for (var ar in node) {
            var r = ar.toLowerCase();
            n[r] = node[ar];
        }
        return n;
    };

    var _formatPropertys = function (pty) {
        var r = {};
        for (var i = 0; i < pty.length; i++) {
            var p = pty[i];
            var ar = p.Key;
            var v = p.Value;
            r[ar] = v;
        }
        return r;
    };
    var _formatOrgUnitNode = function (node, pNode, deptSelectAble, userSelectAble, multiSelect, postSelectAble, dummySelectAble) {
        //var n = changeNodeAttrToLower(node);
        //Ext.apply(n, node);
        var n = node;
        var pfPId = (pNode.FullPathId && pNode.FullPathId != "null") ? pNode.FullPathId : "";
        var pfPName = (pNode.FullPathName) ? pNode.FullPathName : "";
        var pfEx = pNode.fullidEx ? pNode.fullidEx + "/" : "";
        n.ObjType = parseInt(n.ObjType);
        if (node.Propertys) n.Propertys = _formatPropertys(node.Propertys);
        n.FullPathId = (pfPId == "") ? n.Id : pfPId + "/" + n.Id;
        n.FullPathName = (pfPName == "") ? n.Name : pfPName + "/" + n.Name;
        if (multiSelect && n.checkable !== false) {
            n.checked = n.checked || false;
        }
        else n.checked = undefined;
        n.SubType = (isNaN(n.SubType)) ? null : parseInt(n.SubType);
        var sEx = n.Id;
        switch (n.ObjType) {
            case 0:
                //n.checked = deptSelectAble ? n.checked : undefined;
                switch (n.SubType) {
                    case 0:
                        n.Icon = _rp() + (pNode.isRoot ? "dept_root.png" : "dept.png");
                        if (multiSelect && !deptSelectAble) n.checkable = false;
                        sEx += ".DPT";
                        break;
                    case 1:
                        n.Icon = _rp() + "post.png";
                        if (multiSelect && (!postSelectAble || !deptSelectAble))
                            n.checkable = false;
                        sEx += ".POS";
                        break;
                    case 2:
                        n.Icon = _rp() + "dummy.png";
                        if (multiSelect && (!dummySelectAble || !deptSelectAble))
                            n.checkable = false;
                        sEx += ".DUM";
                        break;
                }
                if (userSelectAble) n.Leaf = null;
                break;
            case 1:
                if (n.SubType == "0") n.Icon = _rp() + "male.png";
                else if (n.SubType == "1") n.Icon = _rp() + "female.png";
                if (n.Propertys) {
                    n.FullName = n.Propertys.FullDeptName;
                    n.HId = n.Propertys.DeptId;
                    n.Propertys.FullId = n.FullId;
                }
                sEx += ".PS";
                break;
            case 2:
                n.Icon = _rp() + "role.png";
                sEx += ".RL";
                n.FullId = (pfPId == "") ? n.Id : pfPId;
                n.FullName = (pfPName == "") ? n.Name : pfPName;
                break;
            case 3:
                n.Icon = _rp() + (pNode.isRoot ? "role_root.png" : "role_group.png");
                sEx += ".RLG";
                //n.FullId = (pfPId == "") ? n.Id : pfPId;
                n.FullName = n.FullPathName;
                break;
            case 10:
                if (!pNode.isRoot) n.Icon = _rp() + "dep_function.png";
                n.FullId = (pfPId == "") ? n.Id : pfPId;
                n.FullName = (pfPName == "") ? n.Name : pfPName;
                sEx += ".FTN";
                break;
        }
        n.fullidEx = pfEx + sEx;
        return n;
    };

    return {
        //获取指定组织类别的根组织
        getRootNodeByOrgType: function (orgType, cb) {
            var orgType = orgType || "";
            _requestMethods.getRootDepts(orgType, cb);
        },
        //获取指定根节点的子节点信息，includeDummy：是否显示虚部门、includePost:是否显示岗位
        getChildNodeById: function (parentId, includeDummy, includePost, cb) {
            var incDm = includeDummy || true;
            var incPt = includePost || true;
            _requestMethods.getChildDetps(parentId, incDm, incPt, cb);
        },
        //获取指定类别下节点信息列表分页显示
        getOrgNodeListByOrgType: function (orgType, strKey, pageIndex, pageSize, isCount, includeDummy, cb) {
            var oty = orgType ? orgType : "";
            var ic = isCount ? isCount : true;
            var idm = includeDummy ? includeDummy : true;
            var d = [oty, strKey, pageIndex, pageSize, ic, idm, true];
            _requestMethods.getAllDeptsPage(d, cb);
        },
        //获取全部组织数据 parentId为null时获取根组织数据
        getOrgUnitChildNodes: function (parentId, objType, viewModel, dummyVisible, postVisible, roleOnlyAuthVisible, authCode, commonlyObjectVisible, includeMapOrg, cb) {
            var d = [parentId, objType, viewModel, dummyVisible, postVisible, true, roleOnlyAuthVisible, authCode, commonlyObjectVisible, includeMapOrg];
            _requestMethods.getOrgUnitChildNodes(d, cb);
        },
        //查询全部组织列表数据
        queryOrgNodePage: function (strKey, sType, pageIndex, pageSize, isCount, includeDummy, includePost, cb) {
            var ic = isCount ? isCount : true;
            var idm = includeDummy ? includeDummy : true;
            var d = [strKey, sType, pageIndex, pageSize, ic, idm, includePost];
            _requestMethods.queryOrgObjectPage(d, cb);
        },
        //根据authCode获取权限项
        getPermissionByAuthCode: function (authCode, cb) {
            var ac = authCode || null;
            _requestMethods.getOrgPermisByAuthCode(ac, cb);
        },
        //根据有权限的NodeId获取所有父节点nodeIds:[id,id1,id2]
        getVisibleNodesPath: function (nodeIds, cb) {
            _requestMethods.getParentIdByNodeId(nodeIds, cb);
        },
        //根据Id和objtype获取对应的组织节点对象nodeIds:[{Id:xx,ObjType:xx, IncludeChild:true},{Id:xx1,ObjType:xx1, IncludeChild:true}]
        getSelectorNodesByNodeId: function (nodeIds, cb) {
            _requestMethods.getSelectorNodesByNodeId(nodeIds, function (d) {
                if (Ext.isArray(d)) {
                    for (i = 0; i < d.length; i++)
                        d[i].Propertys = Gjs.EntityHelper.decodePoco(d[i].Propertys);
                }
                cb(d);
            });
        },
        //根据业务类型编码获取组织ID
        getOrgNodeByBizTypeCode: function (typeCode, cb) {
            _requestMethods.getOrgNodeByBizTypeCode(typeCode, cb);
        },

        //对标准的组织树节点格式化
        formatNode: function (node, isRoot, multiSelect) {
            return _formatNodes(node, isRoot, multiSelect);
        },
        //对包含角色、角色组的组织树节点格式化
        formatOrgUnitNode: function (node, pNode, deptSelectAble, userSelectAble, multiSelect, postSelectAble, dummySelectAble) {
            return _formatOrgUnitNode(node, pNode, deptSelectAble, userSelectAble, multiSelect, postSelectAble, dummySelectAble);
        },
        //查询全部组织列表数据根据权限
        queryOrgUnitPage: function (strKey, objType, pageIndex, pageSize, isCount, includeDummy, includePost, onlyMainDeptUser, onlyAuth, includeMapOrg, authCode, cb) {
            var ic = isCount ? isCount : true;
            var idm = includeDummy ? includeDummy : true;
            var d = [strKey, objType, pageIndex, pageSize, ic, idm, includePost, onlyMainDeptUser, onlyAuth, includeMapOrg, authCode];
            _requestMethods.queryOrgUnitPage(d, cb);
        },
        calcImageByObjType: function (r) {
            return _calcImageByObjType(r);
        },
        calcGroupImage: function (r) {
            return _calcGroupImage(r);
        }
    };
} ();﻿////////////////////////////////////////////////////////////////  
// 功能名称：组织树选择视图
////////////////////////////////////////////////////////////////
Ext.ns("Org.View.OrgTree");
Org.View.OrgTree.create = function (cfg) {
    var _vid = cfg.id;
    var _perLoadStus = true;
    var _gid = function (id) {
        return _vid ? (_vid + "_" + id) : undefined;
    };
    //#region [字符资源，完成后挪走]
    var _res = {
        Cpt_All: '全部',
        Obj_Dept: '部门',
        Obj_Role: '角色',
        Obj_CommonObject: '常用对象',
        Obj_CommonlyDept: '常用部门',
        Obj_CommonlyUser: '常用用户',
        Obj_MenuSelectAll: '全部选择',
        Obj_MenuUnSelectAll: '取消全选'
    };
    //#endregion

    //#region [全局常量]
    var _orgPermis, _cfg, _limt, _ctrlFirstExpand = true, _fixedNodes = null, _fixedRootNodes = new Array(), _keyPathArry, _cacheKeyPathArray;
    //#endregion
    //#region [初始化配置参数]
    var _init = function (cfg) {
        //对象选择能力
        //showOnlyLowerDept 是否显示近下级
        var _selectMode = cfg.selectMode || 'DeptUserRole';   //树显示视图 Dept(组织)、User(用户)、Role(角色)、DeptUser(部门用户)、DeptRole(部门角色)、UserRole(用户角色)、DeptUserRole(部门用户角色)、PostUserRole(岗位用户角色)
        var _selP = (cfg.postSelectAble !== false) && (cfg.postSelectAble !== "false");   //是否需要选择岗位     
        var _selDM = (cfg.dummySelectAble !== false) && (cfg.dummySelectAble !== "false"); //是否需要选择虚部门    
        var _selDdptAbl = (cfg.deptSelectAble !== false) && (cfg.deptSelectAble !== "false"); //是否需要选择部门
        var _dmVisible = (cfg.dummyVisible !== false) && (cfg.dummyVisible !== "false");  //是否需要显示虚部门
        var _psVisible = (cfg.postVisible !== false) && (cfg.postVisible !== "false");    //是否需要显示岗位
        var _bizTypeCode = cfg.bizTypeCode || null;                                       //业务类型 优先级 2 注：多个用逗号分割或传Array
        var _levelTypeCode = cfg.levelTypeCode || null;                                   //级别类型 优先级 2 注：多个用逗号分割或传Array
        var _authCode = cfg.authCode || null;                                             //树是否需要受控 优先级 3(注：如果增加“#”号，说明是分级控制方式；如果增加“$”+ 模块CODE 说明是选择模块的组织管理权限，格式：“$GTP.OGR”)
        var _onlyBizLimitness = (cfg.onlyBizLimitness === true) ? true : false;           //仅获取业务范围无限制的分级组织范围
        var _roleOnlyAuthVisible = cfg.roleOnlyAuthVisible || false;                      //仅授权使用 是否显示仅用于授权的角色
        var _userAuthCode = cfg.userAuthCode || null;                                     //用户模式树是否需要受控 优先级 3
        var _fixedNodeIds = cfg.fixedNodeIds || null;                                     //子树节点[{Id:,ObjType:类型0:部门 1：用户 2：角色 3：角色组,IncludeChild:1}] 优先级 1
        var _partTree = cfg.partTree || false;                                            //部分树_fixedNodeIds参数中，节点属性为Root的为根节点
        var _fixedRootNodesIds = cfg.fixedRootNodesIds || null;                           //指定显示的根部门
        var _multiSelect = cfg.multiSelect === true ? true : false;                       //多选
        var _coVisible = (cfg.commonObjectVisible === true) || (cfg.commonObjectVisible === "true");  //是否需要显示常用对象
        var _autoLoadData = (cfg.autoLoadData === false) ? false : true;                  //是否在创建树时加载数据 默认加载数据
        var _allRootNodeVisible = cfg.allRootNodeVisible || false;                        //是否显示“全部”根节点
        var _excludeNodeIds = cfg.excludeNodeIds || null;                                 //排除显示节点[{Id:,ObjType:类型0:部门 1：用户 2：角色 3：角色组,DeptId:1}]
        var _selectNoUnique = (cfg.selectNoUnique === true) ? true : false;                                //人员是否唯一选择
        var _autoSelectFirstNode = cfg.autoSelectFirstNode || false;                      //是否选中第一个节点
        var _commonlyObjectVisible = cfg.commonlyObjectVisible || false;                  //常用联系部门、用户是否显示
        var _isCommonlyUsrGrpSelect = cfg.isCommonlyUsrGrpSelect === true ? true : false; //常用联系人分组是否可以多选
        var _autoSelectSub = cfg.autoSelectSub || false;                                  //多选时勾选check是否自动选中下级
        var _includeMapOrg = (cfg.includeMapOrg === false) ? false : true;                //是否包含互信组织
        var _onlyDeptUser = (cfg.onlyDeptUser === true) ? false : true;                   //仅显示主部门用户
        var _customContextmenu = cfg.customContextmenu;                                   //是否需要外部右键事件处理
        var _autoSelectUserDept = (cfg.autoSelectUserDept === true) ? true : false;       //是否自动选中当前用户部门
        var _showTip = (cfg.showTip === true) ? true : false;                             //是否显示节点Tip
        var _authAndFixNodes = (cfg.authAndFixNodes === true) ? true : false;     //指定固定节点和权限项是否同时生效(cfg.authAndFixNodes === true && cfg.selectMode.indexOf('User') >= 0) ? true : false;
        var _showRoleUser = cfg.showRoleUser || 0;    //是否要显示角色下的用户
        var _flipFullName = (cfg.flipFullName === true) ? true : false; //是否将FullName翻转显示
        var _currentUserId = cfg.currentUserId ? cfg.currentUserId : -1;
        var _defaultSelectFullId = cfg.defaultSelectFullId || null;               //默认要展开的节点FullId
        var _expandAllRoot = (cfg.expandAllRoot === true) ? true : false;       //是否展开所有根节点
        var _selD = _selectMode == "Dept";
        var _selDU = _selectMode == "DeptUser";
        var _selU = _selectMode == "User";
        var _selDR = _selectMode == "DeptRole";
        var _selUR = _selectMode == "UserRole";
        var _selDUR = _selectMode == "DeptUserRole";
        _cfg = {
            selMode: _selectMode,
            selD: _selD,
            selU: _selU,
            selR: _selectMode == "Role" || _selectMode == "RoleGroup",
            selDU: _selDU,
            selDR: _selDR,
            selUR: _selUR,
            selDUR: _selDUR,
            selP: _selP,
            selDM: _selDM,
            dmVisible: _dmVisible,
            psVisible: _psVisible,
            selDdptAbl: _selDdptAbl,
            bizTypeCode: _bizTypeCode,
            levelTypeCode: _levelTypeCode,
            authCode: _authCode,
            roleOnlyAuthVisible: _roleOnlyAuthVisible,
            userAuthCode: _userAuthCode,
            fixedNodeIds: _fixedNodeIds,
            fixedRootNodesIds: _fixedRootNodesIds,
            multiSelect: _multiSelect,
            coVisible: _coVisible,
            autoLoadData: _autoLoadData,
            allRootNodeVisible: _allRootNodeVisible,
            excludeNodeIds: _excludeNodeIds,
            selectNoUnique: _selectNoUnique,
            autoSelectFirstNode: _autoSelectFirstNode,
            commonlyObjectVisible: _commonlyObjectVisible,
            commonlyDeptVisible: _commonlyObjectVisible,
            commonlyUserVisible: _commonlyObjectVisible,
            isCommonlyUsrGrpSelect: _isCommonlyUsrGrpSelect,
            autoSelectSub: _autoSelectSub,
            includeMapOrg: _includeMapOrg,
            _D: _selD || _selDU || _selDR || _selDUR,
            _U: _selU || _selDU || _selDUR || _selUR,
            customContextmenu: _customContextmenu,
            onlyDeptUser: _onlyDeptUser,
            partTree: _partTree,
            autoSelectUserDept: _autoSelectUserDept,
            onlyBizLimitness: _onlyBizLimitness,
            authAndFixNodes: _authAndFixNodes,
            currentUserId: _currentUserId,
            showRoleUser: _showRoleUser,
            flipFullName: _flipFullName,
            defaultSelectFullId: _defaultSelectFullId,
            expandAllRoot: _expandAllRoot,
            showTip: _showTip
        };

        delete cfg.postSelectAble;
        delete cfg.dummySelectAble;
        delete cfg.dummyVisible;
        delete cfg.postVisible;
        delete cfg.authCode;
        delete cfg.fixedNodeIds;
        delete cfg.excludeNodeIds;
    };
    //#endregion
    //#region[操作]    
    //加载树子节点
    var _loadChildNodes = function (d, pNode, selD, selU, multiSelect, selP, selDM, onlySelDept, cb) {
        if (typeof (d) == 'string')
            d = Ext.util.JSON.decode(d);
        //在这做数据转换        
        var arr = new Array();
        for (var i = 0; i < d.length; i++) {
            var n = d[i];
            var objType = n.ObjType;
            var pNd = (!pNode.Id || pNode.isRoot) ? null : pNode;
            var mtl = multiSelect;
            //_limt值为2：指定显示节点ID、1：授权控制
            if (_orgPermis) {
                var p = new Object();
                if (n.Id < 0) {
                    p.self = false;
                    p.hide = false;
                    p.viewChildren = false;
                    p.children = false;
                }
                else {

                    p = _orgPermis ? _orgPermis.getPermisByNode(n, pNd, objType) : null;
                    if (p && n.FullId && ((p.hide && (objType == 1 || objType == 2)) || (pNd && pNd.ObjType == 8 && pNd.Id > 0)) || (pNd && pNd.ObjType == 9)) {//用户、角色、常联系人部门情况下要判断一下所属父节点是否有权限
                        //var pId = (pNode && pNode.get) ? pNode.get("Id") : pNode.Id;
                        var fullId = n.FullId.split("/");
                        var pId = fullId[fullId.length - 1];
                        var pType = (objType == 1 || objType == 0) ? 0 : 3;
                        p = _orgPermis.getSinglePermis(pId, pType);
                        if (!p.self) p.hide = true;
                        if (pNd && (pNd.ObjType == 8 || pNd.ObjType == 9) && p.hide)   //常用联系人、常用联系部门控权处理
                        {
                            if (pNd.ObjType == 8) { p.self = true; p.children = true; p.hide = false; }
                            else
                                for (var j = 0; j < fullId.length - 1; j++) {
                                    pId = fullId[j];
                                    var p1 = _orgPermis.getSinglePermis(pId, pType);
                                    if (p1.children) { p.self = true; p.children = true; p.hide = false; break; }
                                }
                        }
                    }
                    else if (pNd && pNd.ObjType == 8 && pNd.Id < 0) {//常联系人分组可选择处理
                        p.self = true;
                    }
                }
                if (p && p.hide) continue;
                n.permissions = p;
                if (p.self === false) {
                    n.checkable = false;
                    mtl = false;
                }
            }
            n = Org.Wgt.TreeViewModel.formatOrgUnitNode(n, pNode, selD, selU, mtl, selP, selDM, _cfg.showTip, onlySelDept);
            if (pNode.nodeChecked) {
                n.nodeChecked = true;
                if (!Ext.isEmpty(n.checked)) n.checked = true;
            }
            //常联系部门9、用户分组8控制多选处理
            if ((pNode.ObjType == 8) && pNode.Id < 0) {//|| pNode.ObjType == 9
                n.checkable = _cfg.isCommonlyUsrGrpSelect;
            }
            if (_cfg.excludeNodeIds && _excludeNodeFn(n.Id, objType, n.HId)) continue;
            //_tree.fireEvent("",);
            arr.push(n);
        }
        if (_tree.fireEvent("beforeappendnodesformat", pNode, arr) === false) return;
        cb(arr);
    };
    //获取指定节点显示类型类型0:部门 1：用户 2：角色 3：角色组 10：函数变量
    var _getObjType = function () {
        var _getType = function () {
            return { fxD: true };
        };
        var _getFx = function (fx) {
            var ob = {};
            for (var i = 0; i < fx.length; i++) {
                var tp = fx[i];
                switch (tp.ObjType) {
                    case 0:
                        ob['fxD'] = true;
                        break;
                    case 1:
                        ob['fxU'] = true;
                        break;
                    case 2:
                        ob['fxR'] = true;
                        break;
                    case 3:
                        ob['fxRG'] = true;
                        break;
                }
            }
            return ob;
        };
        var _getAc = function () {
            var ob = {};
            var isLimited = _orgPermis.getIsLimited();
            if (!isLimited) _limt = 0;
            else {
                var p = _orgPermis.permisObj
                if (!Ext.isEmpty(p.DeptIds) || !Ext.isEmpty(p.DeptIdOnlyInCludeChilds))
                    ob['fxD'] = true;
                if (!Ext.isEmpty(p.UserIds))
                    ob['fxU'] = true;
                if (!Ext.isEmpty(p.RoleIds))
                    ob['fxR'] = true;
                if (!Ext.isEmpty(p.RoleGroupIds))
                    ob['fxRG'] = true;
            }
            return ob;
        };

        var bz = _cfg.bizTypeCode;
        var lv = _cfg.levelTypeCode;
        var fx = _cfg.fixedNodeIds || _cfg.fixedRootNodesIds;
        var ac = _cfg.authCode;
        var selD = _cfg.selD;
        return fx ? _getFx(fx) : (bz || lv) ? _getType() : (ac) ? _getAc() : {};
    };
    var _excludeNodeFn = function (id, objtype, deptid) {
        var exNodeIds = _cfg.excludeNodeIds;
        var noUni = _cfg.selectNoUnique;
        if (exNodeIds) {
            for (var i = 0; i < exNodeIds.length; i++) {
                var _id = exNodeIds[i].Id;
                var _ot = exNodeIds[i].ObjType;
                var _did = exNodeIds[i].DeptId;
                var con = id == _id && _ot == objtype;
                if (noUni && _did && objtype == 1) con = con && (_did == deptid)
                if (con) return true;
            }
        }
        return false;
    };
    var _reload = function () {
        _tree.reloadNodes();
    };
    var _reconfig = function () {
        _fixedRootNodes.length = 0;
        _orgPermis = null;
        var _cPermis = function (per) {
            _orgPermis = _createOrgPermissions(per);
            _perLoadStus = true;
            _tree.fireEvent("perMisLoad", _perLoadStus);
        };
        var _getTypeCodeId = function (bz, lv, cb, fixedNodes) {
            Org.Wgt.TreeViewModel.getOrgNodeByBizTypeCode(bz, lv, fixedNodes, cb);
        };
        var _getTypeCodeAndAuthCode = function (bz, lv, ac, fixedNodes, cb) {
            Org.Wgt.TreeViewModel.getOrgByFixNodeIdAndAuthCode(bz, lv, ac, fixedNodes, cb);
        };
        var _typeCode = function (bz, lv, cb) {
            _getTypeCodeId(bz, lv, function (d) {
                _cPermis({
                    IsLimited: true,
                    IsReadLimited: true,
                    DeptIds: d.DeptIds,
                    DeptVisableParentlds: d.ParentDeptIds
                });
                _limt = 2;
                cb();
            }, null);
        };

        var _acAndType = function (bz, lv, fxroot, ac, cb) {
            if (fxroot) {
                //_fixedRootNodes=fxroot;
                Org.Wgt.TreeViewModel.getSelectorNodesByNodeId(fxroot, false, function (d) {
                    _fixedRootNodes = d;
                }
			);
            }

            var _getTypeCodeAndAuthCodeAndFixed = function (x) {
                _getTypeCodeAndAuthCode(bz, lv, ac, fx, function (d) {
                    if (d && d.DeptIds) {
                        if (_fixedNodes) {
                            for (var i = 0; i < _fixedNodes.length; i++) {
                                var bol = _isIncludId(_fixedNodes[i], d.DeptIds)
                                if (bol) x.DeptIds.push(_fixedNodes[i].Id);
                                else
                                    x.DeptIds = [];
                            }
                        }
                        x.DeptIds = x.DeptIds.concat(d.DeptIds);
                        x.DeptVisableParentlds = x.DeptVisableParentlds.concat(d.ParentDeptIds);
                    }
                    _cPermis(Ext.apply({
                        IsLimited: true,
                        IsReadLimited: true
                    }, x));
                    _limt = 2;
                    cb();
                }, afx);
            };

            //判断id是否包含在授权列表里面
            var _isIncludId = function (fixedNode, DeptIds) {
                var fullId = fixedNode.FullId;
                var aryfid = fullId.split("/");
                for (var j = aryfid.length - 1; j > -1; j--) {
                    var idx = DeptIds.indexOf(aryfid[j]);
                    if (idx >= 0) return true;
                }
                return false;
            }
            var afx = { DeptIds: [], DeptVisableParentlds: [] };
            var x = Ext.apply({
                IsLimited: true,
                IsReadLimited: true
            }, afx);
            if (ac) {
                _ac(ac, limness, function (d) {
                    if ((bz || lv) && ac || _cfg.authAndFixNodes)
                        _getTypeCodeAndAuthCodeAndFixed(x)
                }, 1);
            }
            else if (bz || lv) {//对指定类型节点的处理
                if (_cfg.authAndFixNodes)
                    _getTypeCodeAndAuthCodeAndFixed(x);
                else
                    _getTypeCodeAndFixed(x);
            }
            else {
                _cPermis(Ext.apply({
                    IsLimited: true,
                    IsReadLimited: true
                }, afx));
                _limt = 2;
                cb();
            }
        };

        var _fx = function (fx, bz, lv, fxroot, ac, cb) {
            var aryFx = Ext.isArray(fx) ? fx : [fx];
            var aryFxroot = fxroot ? Ext.isArray(fxroot) ? fxroot : [fxroot] : null;
            if (fxroot && fx != fxroot) {
                aryFx = aryFx.concat(aryFxroot);
            }
            var _getFx = function (fx) {
                var ob = {},
                d = new Array(), vdParents = new Array(), vdChilds = new Array(), u = new Array(),
                r = new Array(), rg = new Array(), vrgParent = new Array();
                //#region [fullId处理]
                var _contains = function (a, obj) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i] === obj) {
                            return true;
                        }
                    }
                    return false;
                };

                var _getFullId = function (a, fullId, id) {
                    var aryFid = fullId.split("/");
                    for (var i = 0; i < aryFid.length; i++) {
                        var oId = aryFid[i];
                        if (oId != id && !_contains(a, oId))
                            a.push(oId);
                    }
                };
                //#endregion
                for (var i = 0; i < fx.length; i++) {
                    var ty = fx[i].ObjType; //0:部门 1：用户 2：角色 3：角色组 10：函数变量
                    var id = fx[i].Id;
                    var includeChild = fx[i].IncludeChild;
                    var fullId = fx[i].FullId;
                    switch (ty) {
                        case 0:
                            if (!fx[i].NoPermis)
                                d.push(id);
                            if (includeChild && Ext.isEmpty(_cfg.bizTypeCode) && Ext.isEmpty(_cfg.levelTypeCode) && Ext.isEmpty(_cfg.authCode)) vdChilds.push(id);
                            _getFullId(vdParents, fullId, id);
                            break;
                        case 1:
                            u.push(id);
                            _getFullId(vdParents, fullId, -1);
                            break;
                        case 2:
                            r.push(id);
                            _getFullId(vrgParent, fullId, -1);
                            break;
                        case 3:
                            rg.push(id);
                            _getFullId(vrgParent, fullId, id);
                            break;
                    }
                }
                ob["DeptIds"] = d;
                ob["DeptIdOnlyInCludeChilds"] = vdChilds;
                ob["DeptVisableOnlyChilds"] = vdChilds;
                ob["DeptVisableParentlds"] = vdParents;
                ob["UserIds"] = u;
                ob["RoleIds"] = r;
                ob["RoleGroupIds"] = rg;
                ob["AllParentRoleGroupIds"] = vrgParent;
                return ob;
            };

            var _getTypeCodeAndFixed = function (x) {
                _getTypeCodeId(bz, lv, function (d) {
                    if (d && d.DeptIds) {
                        x.DeptIds = x.DeptIds.concat(d.DeptIds);
                        x.DeptVisableParentlds = x.DeptVisableParentlds.concat(d.ParentDeptIds);
                    }
                    _cPermis(Ext.apply({
                        IsLimited: true,
                        IsReadLimited: true
                    }, x));
                    _limt = 2;
                    cb();
                }, aryFx);
            };

            var _getTypeCodeAndAuthCodeAndFixed = function (x) {
                _getTypeCodeAndAuthCode(bz, lv, ac, fx, function (d) {
                    if (d && d.DeptIds) {
                        if (_fixedNodes) {
                            for (var i = 0; i < _fixedNodes.length; i++) {
                                var bol = _isIncludId(_fixedNodes[i], d.DeptIds)
                                if (bol) x.DeptIds.push(_fixedNodes[i].Id);
                                else
                                    x.DeptIds = [];
                            }
                        }
                        x.DeptIds = x.DeptIds.concat(d.DeptIds);
                        x.DeptVisableParentlds = x.DeptVisableParentlds.concat(d.ParentDeptIds);
                    }
                    _cPermis(Ext.apply({
                        IsLimited: true,
                        IsReadLimited: true
                    }, x));
                    _limt = 2;
                    cb();
                }, aryFx);
            };

            //判断id是否包含在授权列表里面
            var _isIncludId = function (fixedNode, DeptIds) {
                var fullId = fixedNode.FullId;
                var aryfid = fullId.split("/");
                for (var j = aryfid.length - 1; j > -1; j--) {
                    var idx = DeptIds.indexOf(aryfid[j]);
                    if (idx >= 0) return true;
                }
                return false;
            }
            Org.Wgt.TreeViewModel.getSelectorNodesByNodeId(aryFx, _cfg.onlyDeptUser, function (d) {
                //返回对象可能有些属性与初始化属性不同，重新赋回初始化属性
                var arrt;
                for (var i = 0; i < aryFx.length; i++) {
                    arrt = null;
                    for (j = 0; j < d.length; j++) {
                        if (aryFx[i].Id == d[j].Id && aryFx[i].ObjType == d[j].ObjType) {
                            Ext.apply(d[j], aryFx[i]);
                            arrt = d[j];
                            break;
                        }
                    }
                    if (aryFxroot && aryFxroot.length > 0 && _fixedRootNodes.length < aryFxroot.length)
                        for (var k = 0; k < aryFxroot.length; k++) {
                            if (aryFx[i].Id == aryFxroot[k].Id && aryFx[i].ObjType == aryFxroot[k].ObjType) {
                                if (arrt)
                                    _fixedRootNodes.push(arrt);
                                break;
                            }
                        }
                }
                _fixedNodes = d; //显示部门树会用到
                var afx = _getFx(d);
                var x = Ext.apply({
                    IsLimited: true,
                    IsReadLimited: true
                }, afx);
                if (ac && _cfg.authAndFixNodes) {
                    _ac(ac, limness, function (d) {
                        if ((bz || lv) && ac)
                            _getTypeCodeAndAuthCodeAndFixed(x);
                        else if (bz || lv)
                            _getTypeCodeAndFixed(x);
                        else {
                            if (d) {
                                x.DeptVisableParentlds = x.DeptIds.concat(d.DeptVisableParentlds);
                                if (_fixedNodes && d.IsLimited) {
                                    for (var i = 0; i < _fixedNodes.length; i++) {
                                        var bol = _isIncludId(_fixedNodes[i], d.DeptIds)
                                        if (bol) x.DeptIds.push(_fixedNodes[i].Id);
                                        else
                                            x.DeptIds = [];
                                        bol = _isIncludId(_fixedNodes[i], d.DeptIdOnlyInCludeChilds);
                                        if (bol)
                                            x.DeptIdOnlyInCludeChilds.push(_fixedNodes[i].Id);
                                        else
                                            x.DeptIdOnlyInCludeChilds = [];
                                    }
                                }
                                if (d.DeptIds) x.DeptIds = x.DeptIds.concat(d.DeptIds);
                                if (d.DeptIdOnlyInCludeChilds) x.DeptIdOnlyInCludeChilds = x.DeptIdOnlyInCludeChilds.concat(d.DeptIdOnlyInCludeChilds);
                                x.DeptVisableParentlds = d.DeptVisableParentlds;
                                x.UserIds = d.UserIds;
                                x.RoleIds = d.RoleIds;
                                x.RoleGroupIds = d.RoleGroupIds;
                                x.AllParentRoleGroupIds = d.AllParentRoleGroupIds;
                            }

                            if (!d.IsLimited)
                                for (var i = 0; i < aryFx.length; i++) {
                                    if (aryFx[i].IncludeChild && aryFx[i].ObjType == 0) {
                                        x.DeptIdOnlyInCludeChilds.push(aryFx[i].Id);
                                    }
                                }
                            _cPermis(x);
                            _limt = 2;
                            cb();
                        }
                    }, 1);
                }
                else if (bz || lv) {//对指定类型节点的处理
                    _getTypeCodeAndFixed(x);
                }
                else {
                    _cPermis(Ext.apply({
                        IsLimited: true,
                        IsReadLimited: true
                    }, afx));
                    _limt = 2;
                    cb();
                }
            });
        };
        var _ac = function (ac, limness, cb, sn) {
            var __cb = cb;
            var _cb = sn ? __cb : function (d) {
                _cPermis(Ext.apply(d, { IsReadLimited: true }));
                _limt = 1;
                __cb();
            };
            Org.Wgt.TreeViewModel.getPermissionByAuthCode(ac, limness, _cfg.currentUserId, _cb);
        };
        var bz = _cfg.bizTypeCode;
        var lv = _cfg.levelTypeCode;
        var fx = _cfg.fixedNodeIds || _cfg.fixedRootNodesIds;
        var ac = _cfg.authCode;
        var limness = _cfg.onlyBizLimitness;
        //var uac = _cfg.userAuthCode;
        var sm = _cfg.selMode;
        var _D = _cfg.selD;
        //var _U = _cfg.selU;        
        //指定显示节点
        var cond = [];
        if (fx)
            cond.push(fx);
        if (lv)
            cond.push(lv);
        if (bz)
            cond.push(bz);
        if (ac)
            cond.push(ac);
        var ca = fx || bz || lv || ac || true;
        var tyCode = bz || lv;
        _limt = 0;
        if ((ac && (bz || lv)) && _cfg.authAndFixNodes) {
            //_getTypeCodeAndAuthCodeAndFixed(x)
            _acAndType(bz, lv, _cfg.fixedRootNodesIds, ac, _reload);
        }
        else if (cond.length > 1 && _cfg.authAndFixNodes) {
            _acAndType(bz, lv, _cfg.fixedNodeIds || _cfg.fixedRootNodesIds, ac, _reload);
        }
        else {
            switch (ca) {
                case bz: case lv:
                    _perLoadStus = false;
                    if (_D) _typeCode(bz, lv, _reload);
                    else _reload();
                    break;
                case fx:
                    _perLoadStus = false;
                    _fx(ca, bz, lv, _cfg.fixedRootNodesIds, ac, _reload);
                    break;
                case ac:
                    _perLoadStus = false;
                    _ac(ca, limness, _reload);
                    break;
                default:
                    _reload();
            }
        }
    };

    var _initReconfig = function () {
        if (!_cfg.fixedNodeIds && !_cfg.fixedRootNodesIds && (!_cfg.authCode || cfg.authCode == "") && (!_cfg.bizTypeCode || _cfg.bizTypeCode == "") && (!_cfg.levelTypeCode || _cfg.levelTypeCode == "")) {
            Org.Wgt.TreeViewModel.getOrgSelectorBelonesScope(-1, function (d) {
                if (d.OrgSelecterScope && d.OrgSelecterScope.length > 0) {
                    var ids = [];
                    var scope = d.OrgSelecterScope;
                    for (var i = 0; i < scope.length; i++) {
                        ids.push({ Id: scope[i], IncludeChild: true, ObjType: 0 });
                    }
                    _cfg.fixedNodeIds = ids;
                }
                _cfg.commonlyDeptVisible = d.ComonDeptCount > 0;
                _cfg.commonlyUserVisible = d.ComonUserCount > 0;
                initReconfig();
            })
        }
        else {
            if (_cfg.commonlyObjectVisible) {
                Org.Wgt.TreeViewModel.getUserCommonOrgScope(-1, function (d) {
                    if (d) {
                        _cfg.commonlyDeptVisible = d.ComonDeptCount > 0;
                        _cfg.commonlyUserVisible = d.ComonUserCount > 0;
                    }
                    initReconfig();
                })
            }
            else
                initReconfig();
        }
    }

    var initReconfig = function () {
        if (_cfg.autoSelectUserDept) {
            Org.Wgt.TreeViewModel.getUserFullDeptId(function (d) {
                if (!Ext.isEmpty(d)) {
                    _cacheKeyPathArray = d;
                    _keyPathArry = _cacheKeyPathArray.split('/');
                }
                _reconfig();
            });
        }
        else if (_cfg.defaultSelectFullId && !Ext.isEmpty(_cfg.defaultSelectFullId)) {
            _cfg.autoSelectUserDept = true;
            _cacheKeyPathArray = _cfg.defaultSelectFullId;
            _keyPathArry = _cacheKeyPathArray.split('/');
            _reconfig();
        }
        else {
            if (!_cfg.expandAllRoot) {
                Org.Wgt.TreeViewModel.getOrgSelectorExpandAllRoot(function (d) {
                    if (d > 0) {
                        _cfg.expandAllRoot = true;
                    }
                    _reconfig();
                });
            }
            else
                _reconfig();
        }
    };

    var _uiToggleCheck = function (node, checked) {
        node.attributes.nodeChecked = checked;
        if (node.ui.checkbox) node.ui.toggleCheck(checked);
    };
    var _loopNodeCheck = function (node, checked, sign) {
        if (sign && !_cfg.autoSelectSub) return;
        if (!sign) _uiToggleCheck(node, checked);
        node.attributes.nodeChecked = checked;
        var cn = node.childNodes;
        for (var i = 0; i < cn.length; i++) {
            var cn1 = cn[i];
            _uiToggleCheck(cn1, checked);
            if (cn1.hasChildNodes()) _loopNodeCheck(cn1, checked, false);
        }
    };
    var _menuItemHandler = function (checked, el) {
        el.hide();
        var n = el.contextNode || _tree.getSelectionModel().getSelectedNode();
        _loopNodeCheck(n, checked, false);
    };
    var _contextmenu = function (node, e) {
        if (!_cfg.multiSelect) return;
        var c = node.getOwnerTree().contextMenu;
        c.contextNode = node;
        c.showAt(e.getXY());
    };
    //endregion
    //#region [创建对象]
    var _createTree = function (cfg) {
        var _coNode = function () {
            return { Id: null, ObjType: 10, name: _res.Obj_CommonObject, checkable: false };
        };
        //常用联系部门
        var _colyDeptNode = function () {
            return { Id: -3, ObjType: 9, Name: _res.Obj_CommonlyDept, checkable: false, permissions: { self: false, hide: false, viewChildren: true, children: false} };
        };
        //常用联系用户分组
        var _colyUserNode = function () {
            return { Id: -4, ObjType: 8, Name: _res.Obj_CommonlyUser, checkable: false, permissions: { self: false, hide: false, viewChildren: true, children: false} };
        };
        var _loadRootNode = function (pNode, cb) {
            _loadData(pNode, function (d) {
                if (_cfg.commonlyObjectVisible) {
                    if (_cfg._D) d.push(_colyDeptNode());
                    if (_cfg._U) d.push(_colyUserNode());
                }
                if (_cfg.coVisible) d.push(_coNode());
                _loadChildNodes(d, pNode, _cfg._D, _cfg._U, _cfg.multiSelect, _cfg.selP, _cfg.selDM, _cfg.selDdptAbl, cb);
            });
        };

        var _loadData = function (pNode, cb) {
            if (_tree.fireEvent("beforeloaddata", pNode, cb) === false) return;
            if (_tree.withoutpostuser == "1" && pNode != null && pNode.ObjType == 0 && pNode.SubType == 0) {
                Org.Wgt.TreeViewModel.getOrgUnitChildNodesWithoutPostUser(pNode.Id, pNode.ObjType, _cfg.selMode, _cfg.dmVisible, _cfg.psVisible, _cfg.roleOnlyAuthVisible, _cfg.authCode, _cfg.commonlyObjectVisible, _cfg.includeMapOrg, _cfg.onlyDeptUser, _cfg.showRoleUser, cb); //(_cfg.selU ? _cfg.userAuthCode : null)   
            }
            else {
                Org.Wgt.TreeViewModel.getOrgUnitChildNodes(pNode.Id, pNode.ObjType, _cfg.selMode, _cfg.dmVisible, _cfg.psVisible, _cfg.roleOnlyAuthVisible, _cfg.authCode, _cfg.commonlyObjectVisible, _cfg.includeMapOrg, _cfg.onlyDeptUser, _cfg.showRoleUser, cb); //(_cfg.selU ? _cfg.userAuthCode : null)
            }
        };

        var _callLoadChildNodes = function (d, pNode, cb) {
            //                if (!pNode.Id && _cfg.commonlyObjectVisible && pNode.ObjType == 0) {
            //                    if (_cfg._D) d.push(_colyDeptNode());
            //                    if (_cfg._U) d.push(_colyUserNode());
            //                }
            if (_tree.fireEvent("beforeappendnodes", pNode, d) === false) return;
            _loadChildNodes(d, pNode, _cfg._D, _cfg._U, _cfg.multiSelect, _cfg.selP, _cfg.selDM, _cfg.selDdptAbl, cb);
        };

        var _fixedRootNodesFn = function (fixedNodes, pNode, root, cb) {
            var rNodes = new Array();
            for (var i = 0; i < fixedNodes.length; i++) {
                var n = fixedNodes[i];
                if (n.Root || root) rNodes.push(n);
            }
            _callLoadChildNodes(rNodes, pNode, cb);
        };

        var _loadNodes = function (pNode, cb) {
            if ((!pNode.Id && ((_fixedNodes && _cfg.partTree) || _fixedRootNodes.length > 0))) {
                var node = Ext.isEmpty(_fixedRootNodes) ? _fixedNodes : _fixedRootNodes;
                _fixedRootNodesFn(node, pNode, !Ext.isEmpty(_fixedRootNodes), cb);
            }
            else
                _loadData(pNode, function (d) { _callLoadChildNodes(d, pNode, cb); });
        };
        var _createRootNodes = function (cb) {
            var arr = new Array();
            var tp = _getObjType();
            //_limt ：0 无限制、1 指定权限项、2 指定显示节点Id
            var _R = _cfg.selR || _cfg.selDR || _cfg.selUR || _cfg.selDUR;
            var sR = (_limt == 0) ? _R : _R && (tp.fxR || tp.fxRG);
            var _DU = _cfg.selD || _cfg.selU || _cfg.selDU || _cfg.selUR || _cfg.selDR || _cfg.selDUR;
            var sDU = (_limt == 0) ? _DU : _DU && (tp.fxD || tp.fxU);
            var isLimt = _orgPermis ? (!_orgPermis.getIsLimited() || (_orgPermis.getIsLimited() && ((_orgPermis.permisObj.AllParentRoleGroupIds && _orgPermis.permisObj.AllParentRoleGroupIds.length > 0) || (_orgPermis.permisObj.DeptVisableParentlds && _orgPermis.permisObj.DeptVisableParentlds.length > 0)))) : true;
            if (_cfg.commonlyObjectVisible && (_cfg._U || _R) && isLimt && _cfg.commonlyUserVisible) arr.unshift(_colyUserNode());
            if (_cfg.commonlyObjectVisible && (_cfg._D || _R) && isLimt && _cfg.commonlyDeptVisible) arr.unshift(_colyDeptNode());
            if (sDU) {
                var n = { Id: null, ObjType: 0, isRoot: true, Name: _res.Cpt_All + _res.Obj_Dept, checkable: false };
                if (sR || _cfg.commonlyObjectVisible) {
                    arr.push(n);
                }
                else {
                    //n.isRoot = true;
                    _loadNodes(n, cb);
                }
            }
            if (sR) {
                var n = { Id: null, ObjType: 3, isRoot: true, Name: _res.Cpt_All + _res.Obj_Role, checkable: false };
                if (sDU || _cfg.commonlyObjectVisible) arr.push(n);
                else {
                    //n.isRoot = true;
                    _loadNodes(n, cb);
                }
            }

            if ((sDU && sR) || _cfg.commonlyObjectVisible) {
                cb(arr);
            }
        };
        var _vm = {
            getRootNodes: function (cb) {
                if (_cfg.allRootNodeVisible)
                    cb([{ Id: -2, ObjType: -1, Name: _res.Cpt_All, checkable: false}]);
                else
                    _createRootNodes(cb);
            },
            getChildNodes: function (pNode, cb) {
                if (pNode.Id == -2) _createRootNodes(cb);
                else
                    _loadNodes(pNode, cb);
            }
        }

        var _menu = new Ext.menu.Menu({
            items: [{
                text: _res.Obj_MenuSelectAll,
                handler: function () { _menuItemHandler(true, _menu); }
            }, {
                text: _res.Obj_MenuUnSelectAll,
                handler: function () { _menuItemHandler(false, _menu); }
            }]
        });

        Ext.apply(cfg, {
            id: _gid("tree"),
            viewModel: _vm,
            autoLoadData: false,
            displayAttr: 'Name',
            iconAttr: 'Icon',
            leafAttr: 'Leaf',
            contextMenu: cfg.disableContextMenu ? {
            } : _menu
            //            listeners: {
            //                contextmenu: function (node, e) {
            //                    //node.select
            //                    //if (!node.isSelected() || !_cfg.multiSelect) return;
            //                    if (!_cfg.multiSelect) return;
            //                    var c = node.getOwnerTree().contextMenu;
            //                    c.contextNode = node;
            //                    c.showAt(e.getXY());
            //                }
            //            }
        });

        return Gjs.View.Tree.create(cfg);
    };
    var _createOrgPermissions = function (obj) {
        var _p = obj;
        //--权限验证--
        var IsIncludeArry = function (ary, id) {
            if (!Ext.isArray(ary)) return false;
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] == id) return true;
            }
            return false;
        };

        var getObjByType = function (id, objType) {
            var re = new Object();
            re["IsLimited"] = _p.IsLimited;
            re["IsReadLimited"] = _p.IsReadLimited;

            switch (objType) {
                case 0:
                    re["Oneself"] = _p.DeptIds;
                    re["OnlyInCludeChilds"] = _p.DeptIdOnlyInCludeChilds;
                    re["VisableParentlds"] = _p.DeptVisableParentlds;
                    re["VisableOnlyChilds"] = _p.DeptVisableOnlyChilds;
                    break;
                case 1:
                    re["Oneself"] = _p.UserIds;
                    break;
                case 2:
                    re["Oneself"] = _p.RoleIds;
                    break;
                case 3:
                    re["Oneself"] = _p.RoleGroupIds;
                    re["OnlyInCludeChilds"] = _p.RoleGroupIds;
                    re["VisableParentlds"] = _p.AllParentRoleGroupIds;
                    break;
                case 11:
                    re["VisableParentlds"] = _p.TexClassIds;
                    break;
            }
            return re;
        };

        return {
            permisObj: _p,
            getIsLimited: function () {
                return _p.IsLimited;
            },
            //获取节点权限
            getPermisByNode: function (node, pNode, objType, arr) {
                var p, oty = objType || 0;
                var ar = arr || 'Id';
                if (!pNode) {
                    p = this.getSinglePermis(node[ar], oty);
                }
                else {
                    var pe = pNode.permissions;
                    var ch = (pe) ? pe.children : true;
                    var vch = (pe) ? pe.viewChildren : true;
                    var self = (pe) ? pe.self : true;
                    if ((ch && oty != 1) || (oty == 1 && self)) p = { self: true, children: true };
                    else p = this.getSinglePermis(node[ar], oty);
                    if (vch && pNode.Id != -3) { p.hide = false; p.viewChildren = true };
                    if (oty == 1) { if (!p.self) p.hide = !self; p.self = true };
                }
                return p;
            },
            //获取部门单个节点权限
            getPermisById: function (id) {
                return getSinglePermis(id, 0)
            },
            getSinglePermis: function (id, type) {
                var p = getObjByType(id, type);
                if (!p) return { self: false, children: false, hide: true }; //没权限
                var r = p.IsReadLimited;                       //只读限制
                if (!p.IsLimited) return { self: true, children: true, hide: false }; //无需限制（全部权限）                
                var s = IsIncludeArry(p.Oneself, id);         //自身(查看权限)
                var c = IsIncludeArry(p.OnlyInCludeChilds, id); //仅下级(查看权限)
                var h = IsIncludeArry(p.VisableParentlds, id) || !r; //有权限查看的父节点
                var v = IsIncludeArry(p.VisableOnlyChilds, id) || !r; //查看仅下级(查看权限)
                return { self: s, children: c, hide: !s && !h && !c && !v, viewChildren: v || c };
            }
        };
    };
    //#endregion    
    _init(cfg);
    var _tree = _createTree(cfg);
    if (cfg.withoutpostuser == "1") _tree.withoutpostuser = "1";

    if (_cfg.autoLoadData) _initReconfig();
    var _loopChild = function (pNode, firstNode) {
        var Id = _keyPathArry[0];
        var cn = pNode.childNodes;
        var pId = (pNode.get) ? pNode.get("Id") : "";
        var b = (firstNode) ? firstNode.get("Id") > -1 : true;
        if (pId !== -2 && b) _keyPathArry.shift();
        for (var i = 0; i < cn.length; i++) {
            if ((cn[i].get("Id") == Id && cn[i].get("ObjType") == 0) || (pId == -2 && cn[i].get("ObjType") == 0 && cn[i].get("isRoot"))) {
                cn[i].expand();
                return cn[i];
            }
        }
        return false;
    };
    var _selectNode = function (el, node) {
        el.getSelectionModel().select(node);
        el.fireEvent("selectFirstNode", node);
    };
    var _selectFullPath = function (el, pNode, firstNode) {
        var res = _keyPathArry && _keyPathArry.length > 0;
        var cn = false;
        if (res) {
            cn = _loopChild(pNode, firstNode);
            if (cn && _keyPathArry.length == 0) _selectNode(el, cn);
        }
        return (!cn) ? false : res;
    };
    var _selectNodes = function (el, pNode, firstNode) {
        if (pNode == el.root || pNode.get("Id") == -2) {
            if (!pNode.isExpanded()) { pNode.expanded = false; pNode.expand(); }
            if (pNode == el.root) {
                var b = (_cfg.autoSelectUserDept) ? (firstNode.get("Id") < 0 || Ext.isEmpty(firstNode.get("Id"))) : true;
                if (_cfg.autoSelectFirstNode && b) {
                    _selectNode(el, firstNode);
                    firstNode.expand();
                }
                else if (!_selectFullPath(el, pNode, firstNode))
                    firstNode.expand();
                if (_cfg.expandAllRoot) {
                    var cn = pNode.childNodes;
                    for (var i = 0; i < cn.length; i++) {
                        if (!cn[i].expanded) cn[i].expand();
                    }
                }
            }
            else {
                if (!_selectFullPath(el, pNode, firstNode) && pNode.firstChild) pNode.firstChild.expand();

            }
        }
        else _selectFullPath(el, pNode, firstNode);
    };
    _tree.on("appendnodes", function (pNode, firstNode) {
        _selectNodes(this, pNode, firstNode);
    });
    _tree.on("beforeclick", function (n) {
        var id = n.get("Id");
        var tp = n.get("ObjType");
        var stp = n.get("SubType");
        var p = n.get("permissions");
        var selD = _cfg.selD || _cfg.selDR || _cfg.selDU || _cfg.selDUR;
        var selDM = _cfg.selDM;
        var selP = _cfg.selP;
        var selDPVbl = _cfg.selDdptAbl;
        if (((tp == 0 || tp == -1) && (!selD || (stp == 2 && !selDM) || (stp == 1 && !selP) || (stp == 0 && !selDPVbl))) || tp == 11 || (tp == 8 && !_cfg.isCommonlyUsrGrpSelect)) return false; //(!id && id !== 0) || (id === -2) ||   || (p && !p.self)
    });
    _tree.on("checkchange", function (node, checked) {
        _loopNodeCheck(node, checked, true);
    });
    if (!_cfg.customContextmenu) _tree.on("contextmenu", _contextmenu);
    _tree.reconfig = function (cfg) {
        if (_tree) _tree.clearNodes();
        _init(cfg);
        if (this.rendered || cfg.autoLoadData === false) _initReconfig();
    };
    _tree.reload = function () {
        if (_cacheKeyPathArray) _keyPathArry = _cacheKeyPathArray.split('/');
        if (!_tree) _tree.clearNodes();
        if (_cfg.autoLoadData === false) _initReconfig();
        else
            _reload();
    };
    _tree.getOrgPermisObj = function () {
        return _orgPermis;
    };
    _tree.getPerLoadStus = function () {
        return _perLoadStus;
    };
    _tree.excludeNodeFn = _excludeNodeFn;
    return _tree;
};

Ext.ns("Org.View.OrgTreeSelector");
Org.View.OrgTreeSelector.create = function (cfg) {
    //#region [全局]    
    var _cfg = cfg;
    var _gid = function (id) {
        return _vid ? (_vid + "_" + id) : undefined;
    };

    var _searchText, _delayText;
    var _vid, _selectMode, _authCode, _roleOnlyAuthVisible, _userAuthCode, _dmVisible,
    _psVisible, _psSelectAble, _dmSelectAble, _multiSelect, _clientCtrl, _excludeNodeIds,
    _selUnique, _fullPathColumnHidden, _queryHidden, _autoSelectFirstNode, _includeMapOrg,
    _customContextmenu, _onlyDeptUser, _dynamicVblePost, _qryVblUserRel, _selDdptAbl, _fixedIds,
    _bizTypeCode, _levelTypeCode, _onlyBizLimitness, _currUserId, _showRoleUser, _flipFullName, _defaultSelectFullId, _expandAllRoot;

    var _init = function (cfg) {
        _vid = cfg.id;
        _selectMode = cfg.selectMode || 'DeptUserRole';
        _authCode = cfg.authCode || null;
        _roleOnlyAuthVisible = cfg.roleOnlyAuthVisible || false;
        _userAuthCode = cfg.userAuthCode || null;
        _dmVisible = (cfg.dummyVisible !== false) && (cfg.dummyVisible !== "false");
        _psVisible = (cfg.postVisible !== false) && (cfg.postVisible !== "false");
        _psSelectAble = (cfg.postSelectAble !== false) && (cfg.postSelectAble !== "false");   //是否需要选择岗位     
        _dmSelectAble = (cfg.dummySelectAble !== false) && (cfg.dummySelectAble !== "false"); //是否需要选择虚部门 
        _multiSelect = cfg.multiSelect === true ? true : false;   //多选
        _clientCtrl = cfg.clientCtrl || false;          //当selectMode为Dept和User展现时，客户端控权还是服务端控权
        _excludeNodeIds = cfg.excludeNodeIds || null;   //排除显示节点[{Id:,ObjType:类型0:部门 1：用户 2：角色 3：角色组,DeptId:1}]
        _selUnique = cfg.selectNoUnique || false;       //人员是否唯一选择
        _fullPathColumnHidden = cfg.fullPathColumnHidden || false;  //是否显示全部门名称
        _queryHidden = cfg.queryHidden || false;                    //查询框显示控制
        _autoSelectFirstNode = cfg.autoSelectFirstNode || false;    //是否选中第一个节点
        _includeMapOrg = (cfg.includeMapOrg === false) ? false : true;                 //是否包含互信组织
        _customContextmenu = cfg.customContextmenu;                   //指定树右键事件外部处理函数
        _onlyDeptUser = (cfg.onlyDeptUser === true) ? true : false;   //仅显示主部门用户
        _dynamicVblePost = (cfg.dynamicVblePost === false) ? false : true;   //动态控制岗位显示
        _qryVblUserRel = (cfg.qryVblUserRel === false) ? false : true;   //要求返回用户关系(能返回多部门下的同一个用户)
        _onlyBizLimitness = (cfg.onlyBizLimitness === true) ? true : false;  //仅获取业务范围无限制的分级组织范围
        _selDdptAbl = (cfg.deptSelectAble !== false) && (cfg.deptSelectAble !== "false"); //是否需要选择部门
        _fixedIds = cfg.fixedNodeIds || null;
        _currUserId = cfg.currentUserId ? cfg.currentUserId : -1;                       //子树节点[{Id:,ObjType:类型0:部门 1：用户 2：角色 3：角色组,IncludeChild:1}]
        _showRoleUser = cfg.showRoleUser || 0;
        _flipFullName = (cfg.flipFullName === true) ? true : false; //是否要翻转FullName
        _defaultSelectFullId = cfg.defaultSelectFullId || null;
        _expandAllRoot = (cfg.expandAllRoot === true) ? true : false;   //是否默认展开所有根节点
        var _fixedRootNodesIds = cfg.fixedRootNodesIds || null;              //指定显示的根部门

        if (_fixedIds && _fixedRootNodesIds) {
            _fixedIds = _fixedIds.concat(_fixedRootNodesIds);
        }
        else if (!_fixedIds && _fixedRootNodesIds)
            _fixedIds = _fixedRootNodesIds;

        _bizTypeCode = cfg.bizTypeCode || null;                                       //业务类型 优先级 2
        _levelTypeCode = cfg.levelTypeCode || null;                                   //级别类型 优先级 2


    };

    _init(cfg);

    //#endregion
    //#region [字符资源，完成后挪走]
    var _res = {
        lb_Name: '名称',
        lb_Code: '编码',
        Cpt_Query: '查找',
        Cpt_QueryResult: '查询结果',
        Cpt_Refresh: '刷新',
        lb_FullPath: '全路径',
        hit_PostFilter: '岗位过滤',
        lb_IncPost: '包含岗位',
        lb_UnIncPost: '不含岗位'
    };
    //#endregion    
    //#region [操作]
    var _rp = function () { return $webImgPath || "/Common/images/"; };
    var _setLayout = function (objPnl) {
        _v.getLayout().setActiveItem(objPnl);
        objPnl.show();
        if (Ext.isObject(objPnl.layout)) objPnl.doLayout();
    };
    var _query = function () {
        _searchText = _edQuery.getValue().trim();
        if (!_searchText.length) {
            _queryGrid.clear();
            return;
        }
        else {
            _setLayout(_gridPnl);
            _searchText = "";
            if (!_gridPnl.hidden) _queryGrid.loadData(0);
        }
    };
    var _delayQuery = function () {
        //var s = _edQuery.getValue().trim().replace(/\%|\_/g, '');
        var s = _edQuery.getValue().trim();
        if (s != _delayText) _edQuery.setValue(s);
        if (_delayText == s && s != _searchText && !Ext.isEmpty(s)) _query();
        if (Ext.isEmpty(s)) {
            _searchText = "";
            _setLayout(_tree);
        }
    };
    var _getDelayText = function () {
        _delayText = _edQuery.getValue().trim();
    };
    var _goOnKeyDown;
    var _edQuery = new Ext.form.TriggerField({
        id: _gid("edQuery"),
        triggerClass: 'x-form-search-trigger',
        //emptyText: _res.Cpt_Query,
        width: 160,
        hidden: _queryHidden,
        enableKeyEvents: true,
        listeners: {
            keydown: function (el, e) {
                clearTimeout(_goOnKeyDown);
                if (e.keyCode == 13) {
                    _query();
                    e.stopEvent();
                }
                else {
                    setTimeout(_getDelayText, 500);
                    _goOnKeyDown = setTimeout(_delayQuery, 1000);
                }
            }
        }
    });
    _edQuery.onTriggerClick = _delayQuery;
    //    _edQuery.on("keyup", function (el) {
    //        el.setValue(el.getValue().replace(/\%|\_/g, ''));
    //    });
    var _permisFilter = function (d) {
        var permisCache = new Object();
        var p = _tree.getOrgPermisObj();
        var excludeFn = _tree.excludeNodeFn;
        //if ((!p || !p.getIsLimited()) && !_excludeNodeIds) return d;
        var r = new Array();
        var _perFn = function (fid, id, objType, pid) {
            var ids = fid.split("/");
            if (objType == 1 || objType == 2) ids.push(id);   //处理人员和角色没有加自身的问题
            for (var j = 0; j < ids.length; j++) {
                var maxLen = ids.length - 1;
                var key = ((objType == 0) ? "D" : (objType == 1 && maxLen == j) ? "U" : (objType == 1 && j < maxLen) ? "D" : (objType == 2 && maxLen == j) ? "R" : "RG");
                var _ot = ((objType == 0) ? 0 : (objType == 1 && maxLen == j) ? 1 : (objType == 1 && j < maxLen) ? 0 : (objType == 2 && maxLen == j) ? 2 : 3);
                var $key = "$" + key + ids[j];
                var pe = permisCache[$key] || p.getSinglePermis(ids[j], _ot);
                if ((id == ids[j] && pe.self) || ((objType == 1 || objType == 2) && ((pe.children && pid != ids[j]) || (pe.self && pid == ids[j]))) || (pid == ids[j] && pe.self) || ((objType == 0 || objType == 3) && pe.children && id != ids[j])) {
                    //r.push(d[i]);
                    return true;
                    break;
                }
                else {
                    permisCache[$key] = pe;
                }
            }
            return false;
        };
        var _excludeFn = function (id, objType, deptId) {
            return excludeFn(id, objType, deptId);
        };
        for (var i = 0; i < d.length; i++) {
            var fid = d[i].FullId;
            var id = d[i].Id;
            var ot = d[i].ObjType;
            var hid = d[i].HId;
            var subType = d[i].SubType;
            var aryFid = fid.split("/");
            var pId = aryFid[aryFid.length - 1];
            var _exclude = (_excludeNodeIds) ? _excludeFn(id, ot, hid) : false;
            if (!_exclude) {
                if ((ot == 0 && subType == 2 && (!_dmVisible || (_dmVisible && !_dmSelectAble))) ||
                 (ot == 0 && subType == 1 && (!_psVisible || (_psVisible && !_psSelectAble)))
                ) continue;
                if (p && p.getIsLimited()) {
                    var _per = _perFn(fid, id, ot, pId);
                    if (_per) r.push(d[i]);
                }
                else r.push(d[i]);
            }
        }
        return r;
    };
    var reverse = function (str, type) {
        var news = str.split(type).reverse().join(type);
        return news
    }
    var _filterFn = function (data) {
        var r = new Array();
        for (var i = 0; i < data.length; i++) {
            var id = data[i].Id;
            var ot = data[i].ObjType;
            var hid = data[i].HId;
            if (_flipFullName && ot == "0") {
                data[i].FullName = reverse(data[i].FullName, '/');
            }
            var _exclude = (_excludeNodeIds) ? _tree.excludeNodeFn(id, ot, hid) : false;
            if (!_exclude) {
                if (!Ext.isEmpty(data[i].Propertys))
                    data[i].Propertys = Org.Wgt.TreeViewModel.formatKey_ValueToJson(data[i].Propertys);
                r.push(data[i]);
            }
        }
        return r;
    };

    var _clear = function () {
        (_tree.hidden) ? _queryGrid.clearSelections() : _tree.clearSelections();
    };
    var _refresh = function () {
        if (!_tree.getPerLoadStus()) {
            _tree.on("perMisLoad", function (sta) {
                _v.fireEvent("refresh");
                if (_tree.hidden) _queryGrid.loadData();
                else _tree.reload();
            })
        }
        else {
            _v.fireEvent("refresh");
            if (_tree.hidden) _queryGrid.loadData();
            else _tree.reload();
        }
    };
    var _selectFirstNode = function (node, istree) {
        _v.fireEvent("selectFirstNode", node, istree);
    };
    var _nodeClick = function (node, istree) {
        return _v.fireEvent("nodeClick", node, istree);
    };
    var _nodedbClick = function (node, istree) {
        return _v.fireEvent("nodeDbClick", node, istree);
    };
    var _selectionChange = function (node, istree) {
        return _v.fireEvent("selectionnodechange", node, istree);
    };
    var _checkChange = function (node, checked) {
        _v.fireEvent("checkChange", node, checked);
    };
    var _appendnodes = function (node, firstNode) {
        _v.fireEvent("appendNodes", node, firstNode);
    };
    var _beforeappendnodes = function (pNode, data) {
        return _v.fireEvent("beforeappendnodes", pNode, data);
    };
    var _beforeappendnodesformat = function (pNode, data) {
        return _v.fireEvent("beforeappendnodesformat", pNode, data);
    };
    var _beforeloaddata = function (pNode, data) {
        return _v.fireEvent("beforeloaddata", pNode, data);
    };
    var _closeButton = function (tree) {
        return _v.fireEvent("closeButton", tree);
    };
    var _gridappendnodes = function (node) {
        //        if (!Ext.isEmpty(node)) {
        //            for (var i = 0; i < node.length; i++) {
        //                var n = node[i];
        //                var ObjType = n.get("ObjType");
        //                if (ObjType == 1 || ObjType == 2) {
        //                    n["FullPathId"] = n.get("FullId") + "/" + n.get("Id");
        //                    n["FullPathName"] = n.get("FullName") + "/" + n.get("Name");
        //                }
        //            }
        //        }
        _v.fireEvent("queryGridAppendNodes", node, _edQuery.getValue());
    };
    var _chkItems = function (el, chk) {
        if (el.autoChk) {
            delete el.autoChk;
            return;
        }
        var tar = el.getTar();
        tar.autoChk = true;
        tar.setValue(!chk);
        _psVisible = el.getV();
        _cfg.postVisible = _psVisible;
        if (_tree.hidden)
            _queryGrid.loadData();
        else
            _tree.reconfig(Ext.applyIf({ border: false }, _cfg));
    };
    //#endregion
    //#region [对象定义]    
    var _createQuyerGrid = function () {
        var _meta = [
            { name: "OId", hidden: true },
            { name: "Id", hidden: true },
            { name: "RId", hidden: true },
            { name: "ObjType", hidden: true },
		    { name: "FullId", hidden: true },
            { name: "SubType", hidden: true },
            { name: "Name", sortable: true, alias: _res.lb_Name, width: 120,
                renderer: function (v, m, r, ri, ci) {
                    var s = "";
                    if (!Ext.isEmpty(v)) {
                        s = "<img style='vertical-align:middle' src='" + Org.Wgt.TreeViewModel.calcImageByObjType(r) + "'>";
                        var f = "";
                        var ot = r.get("ObjType");
                        switch (ot.toString()) {
                            case "0":
                                f = "部门全称";
                                break;
                            case "1":
                                f = "所属部门";
                                break;
                            case "2":
                                f = "所属角色组";
                                break;
                            case "3":
                                f = "角色组全称";
                                break;
                        }
                        f += "：" + r.get("FullName");
                        s += Ext.isEmpty(f) ? v : "<span title='" + f + "'>" + v + "</span>";
                    }
                    return s;
                }
            },
            { name: "Code", sortable: true, alias: _res.lb_Code, width: !_fullPathColumnHidden ? 60 : 80 },
            { name: "FullName", sortable: true, alias: _res.lb_FullPath, width: 150, hidden: _fullPathColumnHidden,
                renderer: function (v, m, r, ri, ci) {
                    var _v = v ? v : r.get("Name");
                    return _v ? "<img style='vertical-align:middle' src='" + Org.Wgt.TreeViewModel.calcGroupImage(r) + "'>" + _v + "</img>" : _v;
                }
            },
            { name: "IsMainRel", hidden: true },
            { name: "FullPathId", hidden: true },
            { name: "FullPathName", hidden: true },
            { name: "HId", hidden: true },
            { name: "Propertys", hidden: true },
            { name: "IsMapOrg", hidden: true },
            { name: "BelongsOrgId", hidden: true },
            { name: "BelongsOrgFullId", hidden: true },
            { name: "SourcePlatId", hidden: true },
            { name: "SourceOrgId", hidden: true }
        ];
        var _vm = {
            loadData: function (cb, pi) {
                //var _au = (_clientCtrl) ? null : (_selectMode == "Dept") ? _authCode : (_selectMode == "User") ? _userAuthCode : null;--_selUnique || 
                Org.Wgt.TreeViewModel.queryOrgUnitPage(_edQuery.getValue().trim(), _selectMode, pi, 30, true, _selDdptAbl, _dmVisible && _dmSelectAble, _psVisible && _psSelectAble, _includeMapOrg, _onlyDeptUser, _roleOnlyAuthVisible, _authCode, _qryVblUserRel, _onlyBizLimitness, _fixedIds, _bizTypeCode, _levelTypeCode, _currUserId, function (d) {
                    var _d = {};
                    if (d && d.Entities) {
                        //_d = _permisFilter(d.Entities);
                        //_d = d.Entities;
                        _d = _filterFn(d.Entities);
                        //                        for (var i = 0; i < _d.length; i++) {
                        //                            if (!Ext.isEmpty(_d[i].Propertys))
                        //                                _d[i].Propertys = Org.Wgt.TreeViewModel.formatKey_ValueToJson(_d[i].Propertys);
                        //                        }
                        c = Math.ceil(d.TotalCount / 30.0);
                        //_d = (_selectMode != "Dept" && _selectMode != "User") ? _permisFilter(d.Entities) : d.Entities;
                    }
                    //cb(_d); //回调函数
                    cb({ "pageCount": c, "data": _d }); //回调函数
                });
            }
        };
        return Gjs.View.Grid.create({
            id: _gid("qryList"),
            region: 'center',
            border: false,
            meta: _meta,
            pagingAble: true,
            simpleBar: true,
            multiSelect: _multiSelect,
            autoLoadData: false,
            editable: false,
            //viewConfig: { forceFit: true },
            viewModel: _vm
        })
    };
    var _trCfg = Ext.applyIf({ border: false }, _cfg);
    delete _trCfg.title;
    delete _trCfg.tbar;
    delete _trCfg.fbar;
    delete _trCfg.bbar;
    var _tree = Org.View.OrgTree.create(_trCfg);
    _tree.on("selectFirstNode", function (node) { _selectFirstNode(node, true); });
    _tree.on("appendnodes", _appendnodes);
    _tree.on("beforeappendnodes", _beforeappendnodes);
    _tree.on("beforeappendnodesformat", _beforeappendnodesformat);
    _tree.on("click", function (node) { _nodeClick(node, true); });
    _tree.on("dblclick", function (node) {
        _nodedbClick(node, true);
    });
    _tree.getSelectionModel().on("selectionchange", function (el, node) { _selectionChange(node, true); });
    _tree.on("checkchange", _checkChange);
    _tree.on("beforeloaddata", _beforeloaddata);
    if (_customContextmenu) _tree.on("contextmenu", function (node, e) { _v.fireEvent("contextmenu", true, { el: _tree, node: node, e: e }); });
    var _queryGrid = _createQuyerGrid(_cfg);
    _queryGrid.on("appendData", _gridappendnodes);
    _queryGrid.getSelectionModel().on("rowselect", function (sm, rIdx, r) { _nodeClick(r, false); _checkChange(r, true); });
    _queryGrid.getSelectionModel().on("rowdeselect", function (sm, rIdx, r) { _checkChange(r, false); });
    _queryGrid.getSelectionModel().on("selectionchange", function (sm) {
        var node = sm.selections.last();
        _selectionChange(node, false);
    });
    _queryGrid.on("rowdblclick", function (sm, rIdx, e) {
        var r = this.getStore().getAt(rIdx);
        _nodedbClick(r, false);
    });
    if (_customContextmenu) _queryGrid.on("rowcontextmenu", function (el, rIdx, e) {
        _v.fireEvent("contextmenu", false, { el: _queryGrid, rowIndex: rIdx, e: e });
    });
    if (_autoSelectFirstNode) {
        _queryGrid.on("loaddata", function () {
            this.getSelectionModel().selectFirstRow();
            var n = this.getSelectNodes();
            if (n && n.length > 0) _selectFirstNode(n[0], false);
        });
    }

    var _actRefresh = new Ext.Button({ id: _gid("actRefresh"), cls: 'g-toolbar', name: "actRefresh", text: (_queryHidden) ? _res.Cpt_Refresh : null, handler: _refresh, icon: _rp() + "toolbar/GTP_refresh.png", tooltip: _res.Cpt_Refresh });
    var _actIncPost = new Ext.form.Checkbox({ id: _gid("_actIncPost"), name: "_actIncPost", boxLabel: _res.lb_IncPost, checked: true, handler: function (el, chk) { _chkItems(el, chk); }, getTar: function () { return _actUnIncPost; }, getV: function () { return _actIncPost.getValue(); } });
    var _actUnIncPost = new Ext.form.Checkbox({ id: _gid("_actUnIncPost"), name: "_actUnIncPost", boxLabel: _res.lb_UnIncPost, handler: function (el, chk) { _chkItems(el, chk); }, getTar: function () { return _actIncPost; }, getV: function () { return _actIncPost.getValue(); } });
    var actfltVb = (_psVisible) ? (_dynamicVblePost) ? false : true : true;
    var _actFilter = new Ext.Toolbar.SplitButton({ id: _gid("_actFilter"), name: "_actFilter",
        menu: { items: [_actIncPost, _actUnIncPost] },
        handler: function () { this.showMenu(); },
        hidden: actfltVb, icon: _rp() + "toolbar/GTP_preview.png"
    });
    var infoBox = Gjs.View.InfoBox.create({
        id: _gid("infoBox"),
        height: 25,
        border: false,
        region: 'north',
        alertType: "info",
        showCloseButton: true,
        message: _res.Cpt_QueryResult
    });
    infoBox.on("closebuttonclick", function () {
        if (_closeButton(_tree) !== false) {
            _tree.reloadNodes();
            _setLayout(_tree);
        }
        return false;
    });
    var _gridPnl = new Ext.Panel({
        border: false,
        layout: 'border',
        items: [infoBox, _queryGrid]
    });
    //#endregion
    var _items = [_tree, _gridPnl];
    var _v = new Ext.Panel(Ext.apply({
        border: false,
        layout: 'card',
        activeItem: 0,
        tbar: [_edQuery, _actRefresh, '->', _actFilter],
        items: _items
    }, _cfg));
    _v.on("resize", function () {
        if (_edQuery.wrap) {
            _edQuery.wrap.setWidth(160);
        }
    });
    _v.reconfig = function (cfg) {
        _cfg = cfg;
        _init(_cfg);
        _tree.reconfig(Ext.applyIf({ border: false }, _cfg));
    };
    _v.getSelectNodes = function () {
        return (_tree.hidden) ? _queryGrid.getSelectNodes() : _tree.getSelectNodes();
    };
    _v.clearSelections = function () {
        _clear();
    };
    _v.reload = function () {
        _refresh();
    };
    _v.restore = function (clear) {
        if (this.rendered) {
            _setLayout(_tree);
            _edQuery.reset();
            if (clear) _refresh();
        }
    };
    _v.getActiveViewIndex = function () {
        return _tree.hidden ? 1 : 0;
    };
    _v.getItems = function (idx) {
        var id = idx || 0;
        return _items[idx];
    };
    return _v;
};

Ext.ns("Org.View.OrgTwoSideSelector");
Org.View.OrgTwoSideSelector.create = function (cfg) {
    var _gid = function (id) {
        return _vid ? (_vid + "_" + id) : undefined;
    };
    //#region [字符资源，完成后挪走]
    var _res = Ext.apply({
        lb_Name: '名称',
        lb_Code: '编码',
        lb_FullPath: '全路径',
        lb_DataRange: '包含下级',
        lb_IncludeLowerDept: '包含下级',
        lb_UnIncludeLowerDept: '仅自身',
        lb_OnlyLowerDept: '仅下级',
        lb_IncludeSuperAndLowerDept: '含上下级'
    }, cfg.res);
    //#endregion
    //#region [全局常量]
    var _vid, _cfg, _selUnique, _fullPathColumnHidden, _showIncChild, _keepSelectedSta, _autoTreeNodeSelected;
    var _clientPageAble = cfg.tarClientPageAble || false;                //指定是否要右侧分页显示
    var _tarStoreType = cfg.tarStoreType || 'arrayStore';
    var _tarStroeIdProperty = cfg.tarStroeIdProperty || 'id';
    var _init = function (cfg) {
        _vid = cfg.id;
        _cfg = cfg;
        _selUnique = _cfg.selectNoUnique || false;
        _fullPathColumnHidden = cfg.fullPathColumnHidden || false;      //是否显示全部门名称
        _showIncChild = (cfg.showIncChild === true) ? true : false;     //是否显示包含下级
        _autoTreeNodeSelected = (cfg.autoTreeNodeSelected === true) ? true : false;     //对已选择的节点树自动选中(未完成)
        _keepSelectedSta = (cfg.keepSelectedSta === true) ? true : false;   //保持选中状态
    };
    _init(cfg);
    //#endregion
    //#region [方法操作]
    var _appendNodes = function (nodes, store, apptype, initData) {
        var st = store || _tarGrid.getStore();
        var flds = st.fields.items;
        var arr = new Array();
        var idx = 0;
        var _exact = function (reds, fld, id, objtype) {
            var _cData = _tarGrid.getClientData();
            if (_clientPageAble) {
                var en = _cData.Entities;
                if (en) {
                    var fl = true;
                    for (var i = 0; i < en.length; i++) {
                        var otype = en[i].ObjType;
                        var _id = en[i][fld];
                        if (_id == id && otype == objtype) {
                            fl = false;
                            break;
                        }
                    }
                    if (fl)
                        en.unshift(n.attributes || n.data);
                }
                else {
                    _cData.Entities = new Array();
                    _cData.Entities.push(n.data || n.attributes);
                }
            }

            for (var i = 0; i < reds.length; i++) {
                var otype = reds[i].get("ObjType");
                var _id = reds[i].get(fld);
                //                if (!_id) {
                //                    var otype = en[i].get("ObjType");
                //                    var _id = en[i].get(fld);
                //                }
                if (_id == id && otype == objtype) return true;
            }
            return false;
        };
        var _getIncludeChild = function (n, iniData) {
            if (!Ext.isDefined(iniData))
                return false;
            for (var i = 0; i < iniData.length; i++) {
                var d = iniData[i];
                if (d.Id == n.Id && d.ObjType == n.ObjType)
                    return d.IncludeChild;
            }
        };
        //        if (_clientPageAble)
        //            nodes = nodes.data.Entities;
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            var _objtype = "ObjType";
            var objtype = n.get ? n.get(_objtype) : n[_objtype];
            var _fid = ((_selUnique) && objtype == 1) ? "RId" : "Id";
            var id = n.get ? n.get(_fid) : n[_fid];
            var subtype = n.get ? n.get("SubType") : n["SubType"];
            if ((id == undefined) || _exact(st.getRange(), _fid, id, objtype)) continue;
            var r = new Object();
            for (var j = 0; j < flds.length; j++) {
                var f = flds[j];
                var fm = f.name;
                var s = n.get ? n.get(fm) : n[fm];
                r[f.name] = s;
            }
            var re = new st.recordType(r); // create new record
            if (apptype == "selected") {
                var incChild = _getIncludeChild(r, initData);
                re.set("IncludeChild", incChild);
            }
            else
                if (objtype == 0 && subtype != 1) re.set("IncludeChild", 0);

            if (!_exact(arr, _fid, id, objtype))
                arr[idx++] = re;
        }
        if (!_v.fireEvent("beforeappendnodes", arr)) return;
        st.add(arr);
        st.commitChanges();
        _tarGrid.updatePageState("insert", arr.length, 20, true);
    };

    var _getSelectorNodesByNodeId = function (nodes, noReq) {
        if (noReq === true) _appendNodes(nodes, null, "selected");
        else
            Org.Wgt.TreeViewModel.getSelectorNodesByNodeId(nodes, false, function (d) {
                if (!Ext.isEmpty(d)) {
                    for (var i = 0; i < d.length; i++) {
                        for (var j = 0; j < nodes.length; j++) {
                            if (nodes[j]["RId"] && nodes[j]["RId"] > 0 && d[i]["RId"] && d[i]["RId"] > 0) {
                                if (nodes[j]["RId"] == d[i]["RId"] && nodes[j]["ObjType"] == d[i]["ObjType"]) {
                                    Ext.apply(d[i], nodes[j]);
                                    break;
                                }
                            }
                            else {
                                if (nodes[j]["Id"] == d[i]["Id"] && nodes[j]["ObjType"] == d[i]["ObjType"]) {
                                    Ext.apply(d[i], nodes[j]);
                                    /**Add by xionw**/
                                    Ext.apply(d[i].Propertys, nodes[j].Propertys);
                                    Ext.each(nodes[j].Propertys, function (item) {
                                        if (item.Key == "ContainType") {
                                            d[i].IncludeChild = item.Value;
                                            nodes[j].IncludeChild = item.Value;
                                            return false;
                                        }
                                    });
                                    /**Add by xionw**/
                                    break;
                                }
                            }
                        }
                    }
                }
                var data = d;
                if (_clientPageAble) {
                    var _d = {};
                    _d.Entities = d;
                    var tc = d.length;
                    c = Math.ceil(tc / 20.0);
                    data = { "pageCount": c, "data": _d, recordNum: 20, recordCount: tc, pageIndex: 0 };
                    _tarGrid.setSelectedNodes(data);
                }
                else {
                    _appendNodes(data, null, "selected", nodes);
                }
            });
    };
    var _appendSelection = function () {
        var nodes = _srcTree.getSelectNodes();
        if (!_keepSelectedSta) _srcTree.clearSelections();
        var st = _tarGrid.getStore();
        if (!_v.fireEvent("appendnodes", st, nodes)) return;
        _appendNodes(nodes, st, "move");
    };
    var _removeSelection = function () {
        if (_clientPageAble) {
            var _RemoveExact = function (keyF, value, objtype) {
                var _cData = _tarGrid.getClientData();
                if (_cData) {
                    var en = _cData.Entities || _cData;
                    for (var i = 0; i < en.length; i++) {
                        var otype = en[i].get ? en[i].get("ObjType") : en[i]["ObjType"];
                        var tvalue = en[i].get ? en[i].get(keyF) : en[i][keyF];
                        if (tvalue == value && objtype == otype) {
                            en.splice(i, 1);
                            break;
                        }
                    }
                }
            };
            var n = _tarGrid.getSelectionModel().getSelections();
            for (var i = 0; i < n.length; i++) {
                var id = Ext.isFunction(n[i].get) ? n[i].get("Id") : n[i]["Id"];
                var _objtype = "ObjType";
                var objtype = Ext.isFunction(n[i].get) ? n[i].get(_objtype) : n[i][_objtype];
                var _fid = ((_selUnique) && objtype == 1) ? "RId" : "Id";
                if (_fid == "RId")
                    id = Ext.isFunction(n[i].get) ? n[i].get("RId") : n[i]["RId"];
                _RemoveExact(_fid, id, objtype);
            }
            _tarGrid.getStore().remove(n);
            _tarGrid.updatePageState("delete", n.length, 20, true);
        }
        else
            _tarGrid.getStore().remove(_tarGrid.getSelectionModel().getSelections());
    };
    var _selectFirstNode = function (node) {
        _v.fireEvent("selectFirstNode", node);
    };
    var _tarEditorHandler = function (e) {
        if (e.record.get("ObjType") == 1 || e.record.get("SubType") == 1 || e.record.get("ObjType") == 2 || e.record.get("ObjType") == 3) return false;
    };
    var _tarSelectChange = function (node, checked) {
        _v.fireEvent("tarSelectChange", node, checked, btnItems);
    };
    var _closeButton = function (tree) {
        return _v.fireEvent("closeButton", tree);
    };
    //#endregion
    //#region [对象定义]
    var _createTarGrid = function () {
        var _incItems = [{ key: 0, value: _res.lb_IncludeLowerDept }, { key: 1, value: _res.lb_UnIncludeLowerDept}];
        if (cfg.showOnlyLowerDept !== false) {
            _incItems.push({ key: 2, value: _res.lb_OnlyLowerDept });
        }
        if (cfg.showIncSuperAndLowerDept)
            _incItems.push({ key: 3, value: _res.lb_IncludeSuperAndLowerDept });

        var _meta = [
            { name: "OId", hidden: true },
            { name: "Id", hidden: true },
            { name: "RId", hidden: true },
            { name: "ObjType", hidden: true },
		    { name: "FullId", hidden: true },
            { name: "SubType", hidden: true },
            { name: "Name", sortable: true, alias: _res.lb_Name, width: (!_fullPathColumnHidden || _showIncChild) ? 150 : 180,
                renderer: function (v, m, r, ri, ci) {
                    var s = "";
                    if (!Ext.isEmpty(v)) {
                        s = "<img style='vertical-align:middle' src='" + Org.Wgt.TreeViewModel.calcImageByObjType(r) + "'>";
                        var f = "";
                        var ot = r.get("ObjType");
                        switch (ot.toString()) {
                            case "0":
                                f = "部门全称";
                                break;
                            case "1":
                                f = "所属部门";
                                break;
                            case "2":
                                f = "所属角色组";
                                break;
                            case "3":
                                f = "角色组全称";
                                break;
                        }
                        f += "：" + r.get("FullName");
                        s += Ext.isEmpty(f) ? v : "<span title='" + f + "'>" + v + "</span>";
                    }
                    return s;
                }
            },
            { name: "Code", sortable: true, alias: _res.lb_Code, width: (!_fullPathColumnHidden || _showIncChild) ? 80 : 100 },
            { name: "FullName", sortable: true, alias: _res.lb_FullPath, width: 200, hidden: _fullPathColumnHidden,
                renderer: function (v, m, r, ri, ci) {
                    var _v = v ? v : r.get("Name");
                    return _v ? "<img style='vertical-align:middle' src='" + Org.Wgt.TreeViewModel.calcGroupImage(r) + "'>" + _v + "</img>" : _v;
                }
            },
            { name: "IncludeChild", sortable: true, alias: _res.lb_DataRange, width: 90, hidden: !_showIncChild,
                renderer: function (v, m, r, ri, ci) {
                    var b = Ext.isDefined(v) && r.get("ObjType") == 0 && (r.get("SubType") == 0 || r.get("SubType") == 2);
                    return b ? (v == 0 ? _res.lb_IncludeLowerDept : (v == 1) ? _res.lb_UnIncludeLowerDept : (v == 2) ? _res.lb_OnlyLowerDept : _res.lb_IncludeSuperAndLowerDept) : "";
                },
                editor: Gjs.Form.ComboBox.create(Ext.apply({
                    editable: false,
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus: true,
                    anchor: "95%",
                    items: _incItems
                }, cfg.includeChildConfig))
            },
            { name: "IsMainRel", hidden: true },
            { name: "FullPathId", hidden: true },
            { name: "FullPathName", hidden: true },
            { name: "HId", hidden: true },
            { name: "Propertys", hidden: true },
            { name: "IsMapOrg", hidden: true },
            { name: "BelongsOrgId", hidden: true },
            { name: "BelongsOrgFullId", hidden: true },
            { name: "SourcePlatId", hidden: true },
            { name: "SourceOrgId", hidden: true }
        ];
        return Gjs.View.Grid.create({
            id: _gid("targetList"),
            flex: 1,
            meta: _meta,
            multiSelect: true,
            autoLoadData: false,
            editable: false,
            simpleBar: true,
            editable: true,
            storeType: _tarStoreType,
            idProperty: _tarStroeIdProperty,
            clientPageAble: _clientPageAble,
            IsDisplayTotal: cfg.IsDisplayTotal,
            viewModel: {
                loadData: function (cb, idx) {
                    var data = [];
                    if (_clientPageAble) {
                        data = _tarGrid.getClientData();
                        data["recordNum"] = 20;
                        if (Ext.isArray(data)) data["recordCount"] = data.length;
                        else
                            data["recordCount"] = data.Entities.length;
                    }
                    cb(data);
                }
            }
        })
    };

    var _createTreeCfg = function (cfg) {
        return Ext.applyIf({
            id: _gid("sourcePanel"),
            flex: 1,
            multiSelect: true,
            border: true
            //width: 270
        }, cfg);
    };
    var _srcCfg = _createTreeCfg(_cfg);
    delete _srcCfg.title;
    delete _srcCfg.tbar;
    delete _srcCfg.fbar;
    delete _srcCfg.bbar;
    var _srcTree = Org.View.OrgTreeSelector.create(_srcCfg);
    _srcTree.on("selectFirstNode", _selectFirstNode);
    _srcTree.on("closeButton", _closeButton);
    _srcTree.on("nodeDbClick", function (node) {
        if (node && ((node.ui && node.ui.checkbox) || node.data)) {
            //            var sleaf = false;
            //            sleaf = node.get ? node.get("Leaf") : false;
            //            if (sleaf)
            // _appendSelection();
            // if (!_keepSelectedSta) _srcTree.clearSelections();
            var st = _tarGrid.getStore();
            if (!_v.fireEvent("appendnodes", st, [node])) return;
            _appendNodes([node], st, "move");
        }
    });
    var _tarGrid = _createTarGrid();
    if (_clientPageAble) _tarGrid.on("afteredit", function (e) {
        var data = _tarGrid.getClientData();
        var rec = e.record;
        var field = e.field;
        var cDt = data.Entities || data;
        for (var i = 0; i < cDt.length; i++) {
            {
                if (cDt[i].Id == rec.get("Id") && cDt[i].ObjType == rec.get("ObjType"))
                    cDt[i][field] = e.value;
            }
        }
    });
    _tarGrid.on("beforeedit", _tarEditorHandler);
    _tarGrid.on("dblclick", function (r) {
        if (r.target && (r.target.innerText.trim() == "" || r.target.innerText.indexOf("含") >= 0 || r.target.innerText.indexOf("仅") >= 0))
            return;
        _removeSelection();
    });
    _tarGrid.getSelectionModel().on("rowselect", function (sm, rIdx, r) { _tarSelectChange(r, true); });
    _tarGrid.getSelectionModel().on("rowdeselect", function (sm, rIdx, r) { _tarSelectChange(r, false); });
    var btnItems = [
        new Ext.Button({ id: _gid("btnAdd"), iconCls: "x-tbar-page-next", handler: _appendSelection }),
        new Ext.Button({ id: _gid("btnRemove"), iconCls: "x-tbar-page-prev", handler: _removeSelection })
    ];
    var buttonPanel = new Ext.Panel({
        layout: 'vbox',
        width: 34,
        unstyled: true,
        layoutConfig: { pack: 'center' },
        defaults: { margins: '10 6' },
        flex: 0,
        items: btnItems
    });
    //#endregion
    var _v = new Ext.Panel(Ext.apply({
        layout: 'hbox',
        bodyStyle: 'padding:5px;',
        layoutConfig: { align: 'stretch' },
        items: [_srcTree, buttonPanel, _tarGrid]
    }, cfg));

    _v.getSelectNodes = function () {
        var st = _tarGrid.getStore();
        var flds = st.fields.items;
        var cSt = new Ext.data.ArrayStore({ fields: flds })
        if (_clientPageAble) {
            var data = _tarGrid.getClientData();
            var dd = new Array();
            var _meta = cSt.fields;
            var d = data.Entities || data;
            for (var i = 0; i < d.length; i++) {
                dd[i] = new Array();
                for (var j = 0; j < _meta.length; j++)
                    dd[i][j] = d[i].get ? d[i].get(_meta.get(j).name) : d[i][_meta.get(j).name];
            }
            cSt.loadData(dd, false);
        }
        else cSt = st;
        return cSt.getRange();
    };
    _v.setSelectedNodes = function (nodes, noReq, clearExistingNodes) {
        if (clearExistingNodes) this.clearSelectedNodes();
        _getSelectorNodesByNodeId(nodes, noReq);
    };
    _v.clearSelectedNodes = function () {
        //_tarGrid.getStore().removeAll();
        _tarGrid.removeAll();
    };
    _v.reconfig = function (cfg, isClearSelect) {
        if (isClearSelect !== false) this.clearSelectedNodes();
        _init(cfg);
        _srcTree.reconfig(_createTreeCfg(cfg));
    };
    _v.reload = function () {
        _srcTree.reload();
    };
    _v.restore = function (clear) {
        if (this.rendered) {
            _srcTree.restore(clear);
            var arg = arguments;
            var isClr = true;
            if (arg.length > 0) isClr = arg[0];
            if (isClr) this.clearSelectedNodes();
        }
    };
    return _v;
};

//Org.path = (function () {
//    var arr = document.getElementsByTagName("SCRIPT");
//    var s = arr[arr.length - 1].src.replace(/\\/g, "/");
//    return (s.lastIndexOf("/") < 0) ? "./" : s.substring(0, s.lastIndexOf("/")) + "/";
//})();
//组织视图处理ViewModel
Ext.ns("Org.Wgt");
Org.Wgt.TreeViewModel = function () {

    //#region [字符资源，完成后挪走]
    var _res = {
        Alt_LoadInfo: '加载{0}',
        NewRootDept: '根部门',
        NewLowerDept: '下级部门',
        DeptList: '部门列表',
        DeptInfo: '部门信息',
        Act_Filter: '过滤',
        AuthItem: '权限项',
        VisibleParentNode: '查看父节点',
        SelectedOrgNode: '已选择组织节点'
    }
    //#endregion
    var _getOrgRoot = function () {
        return Gjs.getWebAppPath();
    };
    var _webReqType = function () {
        return (Gjs.webReqType) ? Gjs.webReqType() : null;
    };
    //#region [request方法]
    var _req = function (req) { Gjs.Ajax.request(Ext.apply(req, { url: _getOrgRoot() + 'WebHttpHandle.ashx', reqType: _webReqType() })); };
    var _requestMethods = {
        //获取当前登录用户的全部门路径
        getUserFullDeptId: function (cb) {
            _req({
                ctrl: "GTP.Org.Action.UserRelService",
                cmd: "GetCurrnetUserFullDeptId",
                data: [],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.NewRootDept),
                cb: cb
            });
        },
        //获取指定组织类别的根组织
        getRootDepts: function (orgType, cb) {
            _req({
                ctrl: "GTP.Org.Action.DeptService",
                cmd: "GetRootDepts",
                data: [orgType, ''],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.NewRootDept),
                cb: cb
            });
        },
        //获取指定根节点的子节点信息，incDm：是否显示虚部门、incPt:是否显示岗位
        getChildDetps: function (pId, incDm, incPt, cb) {
            _req({
                ctrl: "GTP.Org.Action.DeptService",
                cmd: "GetChildDepts",
                data: [pId, incDm, incPt],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.NewLowerDept),
                cb: cb
            });
        },
        //获取指定类别下节点信息列表分页显示
        getAllDeptsPage: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.DeptService",
                cmd: "GetAllDeptsPage",
                data: data,
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.DeptList),
                cb: cb
            });
        },
        //获取全部组织数据 parentId为null时获取根组织数据
        getOrgUnitChildNodes: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetChildOrgUnitListXXNew",
                data: data,
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.DeptInfo),
                cb: cb
            });
        },
        //获取全部组织数据 parentId为null时获取根组织数据
        getOrgUnitChildNodesWithoutPostUser: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetChildOrgUnitListXXNewWithoutPostUser",
                data: data,
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.DeptInfo),
                cb: cb
            });
        },
        //查询全部组织列表数据，分页显示
        queryOrgObjectPage: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "QueryOrgObjectPage",
                data: data,
                dataNode: "Data",
                title: _res.Act_Filter + _res.DeptInfo,
                cb: cb
            });
        },
        //根据权限Code加载有权限的信息
        getOrgPermisByAuthCode: function (authCode, limness, userId, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetCommonAuthItemsByUserId",
                data: [authCode, limness, userId],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.AuthItem),
                cb: cb
            });
        },
        //根据有权限的NodeId获取所有父节点Id
        getParentIdByNodeId: function (ids, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetDeptParentListByDeptIds",
                data: [ids],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.VisibleParentNode),
                cb: cb
            });
        },
        //根据Id获取对应的组织节点对象
        getSelectorNodesByNodeId: function (ids, incPartTimeUser, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetOrgUnitListByOrg",
                data: [ids, incPartTimeUser],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.SelectedOrgNode),
                cb: cb
            });
        },
        getOrgNodeByBizTypeCode: function (typeCodes, levCodes, fixedNodes, cb) {
            var _formatCode = function (code) {
                return (Ext.isArray(code)) ? code : (!Ext.isEmpty(code)) ? function () {
                    var idx = code.indexOf(",");
                    if (idx > 0) {
                        var sc = code.split(",");
                        var ret = [];
                        for (var i = 0; i < sc.length; i++) {
                            ret.push(sc[i]);
                        }
                        return ret;
                    }
                    return [code];
                } () : null;
            };
            var tycds = _formatCode(typeCodes);
            var lvcds = _formatCode(levCodes);
            _req({
                ctrl: "GTP.Org.Action.DeptService",
                cmd: "GetQueryDeptListByLevelOrBizTypeCodes",
                data: [tycds, lvcds, null, null, fixedNodes],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.SelectedOrgNode),
                cb: cb
            });
        },

        //根据业务类别 级别 和权限项验权
        getOrgByFixNodeIdAndAuthCode: function (typeCodes, levCodes, authCode, fixedNodes, cb) {
            _req({
                ctrl: "GTP.Org.Action.DeptService",
                cmd: "GetOrgByFixNodeIdAndAuthCode",
                data: [typeCodes, levCodes, authCode, fixedNodes, -1],
                dataNode: "Data",
                title: String.format(_res.Alt_LoadInfo, _res.SelectedOrgNode),
                cb: cb
            });
        },

        //获取设置的范围
        getOrgSelectorBelonesScope: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetOrgSelectorBelonesScope",
                data: [data],
                dataNode: "Data",
                title: _res.Act_Filter + _res.DeptInfo,
                cb: cb
            });
        },

        //获取设置的范围
        getOrgSelectorExpandAllRoot: function (cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetOrgSelectorExpandRoot",
                data: [],
                dataNode: "Data",
                title: _res.Act_Filter + _res.DeptInfo,
                cb: cb
            });
        },
        //获取是否存在常用联系人 常用联系部门
        getUserCommonOrgScope: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetUserCommonOrgScope",
                data: [data],
                dataNode: "Data",
                title: _res.Act_Filter + _res.DeptInfo,
                cb: cb
            });
        },

        //部门树查询列表
        queryOrgUnitPage: function (data, cb) {
            _req({
                ctrl: "GTP.Org.Action.CommonObjectService",
                cmd: "GetOrgUnitListPage",
                data: data,
                dataNode: "Data",
                title: _res.Act_Filter + _res.DeptInfo,
                cb: cb
            });
        }
    }
    //#endregion

    var _rp = function () { return ($webImgPath || "/Common/images/") + "org/"; };
    var _calcImage = function (type) {
        var img = isRoot ? "dept_root.png" : ((type == "Common") ? "dept.png" : (type == "Position") ? "post.png" : "dummy.png");
        return _rp() + img;
    };
    var _calcImageByObjType = function (rec) {
        var img;
        var tp = rec.get("ObjType");
        var stp = rec.get("SubType");
        var isMapOrg = rec.get("IsMapOrg");
        var isPtys = rec.get("Propertys");
        var isMainRel = 1;
        if (isPtys) isMainRel = isPtys.IsMainRel;
        switch (parseInt(tp)) {
            case 0:
                img = (stp == 1) ? "post" : (stp == 2) ? "dummy" : "dept";
                break;
            case 1:
                img = (stp == 1) ? "female" : "male";
                if (isMainRel == 0) img += "_pt";
                break;
            case 2:
                img = "role";
                break;
            case 3:
                img = "role_group";
                break;
            default:
                img = "role_group";
                break;
        };
        if (isMapOrg) img += "_net";
        return _rp() + img + ".png";
    };
    var _calcGroupImage = function (rec) {
        var tp = rec.get("ObjType");
        switch (parseInt(tp)) {
            case 0:
            case 1:
                img = "dept";
                break;
            case 2:
            case 3:
                img = "role_group";
                break;
            default:
                img = "dept";
                break;
        };
        var isMapOrg = rec.get("IsMapOrg");
        if (isMapOrg && tp == 0) img += "_net";
        return _rp() + img + ".png";
        //        var img = (isMapOrg && tp == 0) ? "sys_net.png" : (tp < 2) ? "dept.png" : "role_group.png";
        //        return _rp() + img;
    };

    //格式化节点节点属性
    var _formatNodes = function (node, isRoot, multiSelect) {
        var d = Gjs.EntityHelper.decodeEntityReference(node);
        var n = {
            id: node.DeptId,
            name: node.Name,
            leaf: node.IsLeaf,
            nodeType: node.NodeType.name,
            viewType: node.DeptGroup.ViewType.Id,
            icon: _calcImage(node.NodeType.name),
            fullDeptId: node.FullDeptId,
            orgRoot: isRoot === true
        };
        if (multiSelect && n.checkable !== false) {
            n.checked = n.checked || false;
        }
        else n.checked = undefined;
        return n;
    };

    var changeNodeAttrToLower = function (node) {
        var n = new Object();
        for (var ar in node) {
            var r = ar.toLowerCase();
            n[r] = node[ar];
        }
        return n;
    };

    var _formatPropertys = function (pty) {
        var r = {};
        for (var i = 0; i < pty.length; i++) {
            var p = pty[i];
            var ar = p.Key;
            var v = p.Value || "";
            r[ar] = v;
        }
        return r;
    };
    var _formatOrgUnitNode = function (node, pNode, deptSelectAble, userSelectAble, multiSelect, postSelectAble, dummySelectAble, showTip, onlySelDept) {
        //var n = changeNodeAttrToLower(node);
        //Ext.apply(n, node);
        var n = node;
        var pfPId = (pNode.FullPathId && pNode.FullPathId != "null") ? pNode.FullPathId : "";
        var pfPName = (pNode.FullPathName) ? pNode.FullPathName : "";
        var pfEx = pNode.fullidEx ? pNode.fullidEx + "/" : "";
        n.Name = n.Name.replace("<", "&lt;").replace(">", "&gt;");
        n.ObjType = parseInt(n.ObjType);
        if (node.Propertys) n.Propertys = _formatPropertys(node.Propertys);
        n.FullPathId = (pfPId == "") ? n.Id : pfPId + "/" + n.Id;
        n.FullPathName = (pfPName == "") ? n.Name : pfPName + "/" + n.Name;
        if (multiSelect && n.checkable !== false) {
            n.checked = n.checked || false;
        }
        else n.checked = undefined;
        n.SubType = (isNaN(n.SubType)) ? null : parseInt(n.SubType);
        var sEx = n.Id;
        switch (n.ObjType) {
            case 0:
                switch (n.SubType) {
                    case 0:
                        var img = _rp() + (pNode.isRoot ? "dept_root" : "dept");
                        if (n.IsMapOrg) img += "_net";
                        img += ".png";
                        n.Icon = img
                        if (multiSelect && (!deptSelectAble || !onlySelDept)) n.checkable = false;
                        sEx += ".DPT";
                        break;
                    case 1:
                        var img = _rp() + "post";
                        if (n.IsMapOrg) img += "_net";
                        img += ".png";
                        n.Icon = img
                        if (multiSelect && (!postSelectAble || !deptSelectAble))
                            n.checkable = false;
                        sEx += ".POS";
                        break;
                    case 2:
                        var img = _rp() + "dummy";
                        if (n.IsMapOrg) img += "_net";
                        img += ".png";
                        n.Icon = img
                        if (multiSelect && (!dummySelectAble || !deptSelectAble))
                            n.checkable = false;
                        sEx += ".DUM";
                        break;
                    case 3:
                        n.Icon = _rp() + "sys_net.png";
                        if (multiSelect && (!dummySelectAble || !deptSelectAble))
                            n.checkable = false;
                        sEx += ".TRUST";
                        break;
                }
                if (userSelectAble) n.Leaf = null;
                break;
            case 1:
                var img = "";
                if (n.SubType == "0") img += "male";
                else if (n.SubType == "1") img += "female";
                if (n.Propertys) {
                    var isMainRel = n.Propertys.IsMainRel;
                    img += (isMainRel == 1) ? "" : "_pt";
                    n.FullName = n.Propertys.FullDeptName;
                    n.HId = n.Propertys.DeptId;
                    n.Propertys.FullId = n.FullId;
                }
                if (n.IsMapOrg) img += "_net";
                img += ".png";
                n.Icon = _rp() + img;

                sEx += ".PS";
                break;
            case 2:
                n.Icon = _rp() + "role.png";
                sEx += ".RL";
                n.FullName = pNode.FullName;
                //n.FullId = (pfPId == "") ? n.Id : pfPId;
                //                n.FullId = n.FullPathId;
                //                n.FullName = n.FullPathName;
                break;
            case 3:
                n.Icon = _rp() + (pNode.isRoot ? "role_root.png" : "role_group.png");
                sEx += ".RLG";
                //n.FullId = (pfPId == "") ? n.Id : pfPId;
                n.FullId = n.FullPathId;
                n.FullName = n.FullPathName;
                break;
            case 8:
                n.Icon = _rp() + "role_group.png";
                break;
            case 10:
                if (!pNode.isRoot) n.Icon = _rp() + "dep_function.png";
                n.FullId = (pfPId == "") ? n.Id : pfPId;
                n.FullName = (pfPName == "") ? n.Name : pfPName;
                sEx += ".FTN";
                break;
            case 11:
                n.Icon = _rp() + "sys_net.png";
                n.checkable = false;
                sEx += ".TRUST";
                break;
        }
        n.fullidEx = pfEx + sEx;
        if (showTip) n.qtip = n.FullName;
        return n;
    };

    return {
        //获取指定组织类别的根组织
        getRootNodeByOrgType: function (orgType, cb) {
            var orgType = orgType || "";
            _requestMethods.getRootDepts(orgType, cb);
        },
        //获取指定根节点的子节点信息，includeDummy：是否显示虚部门、includePost:是否显示岗位
        getChildNodeById: function (parentId, includeDummy, includePost, cb) {
            var incDm = includeDummy || true;
            var incPt = includePost || true;
            _requestMethods.getChildDetps(parentId, incDm, incPt, cb);
        },
        //获取指定类别下节点信息列表分页显示
        getOrgNodeListByOrgType: function (orgType, strKey, pageIndex, pageSize, isCount, includeDummy, cb) {
            var oty = orgType ? orgType : "";
            var ic = isCount ? isCount : true;
            var idm = includeDummy ? includeDummy : true;
            var d = [oty, strKey, pageIndex, pageSize, ic, idm, true];
            _requestMethods.getAllDeptsPage(d, cb);
        },
        //获取全部组织数据 parentId为null时获取根组织数据
        getOrgUnitChildNodes: function (parentId, objType, viewModel, dummyVisible, postVisible, roleOnlyAuthVisible, authCode, commonlyObjectVisible, includeMapOrg, onlyDeptUser, showRoleUser, cb) {
            var d = [parentId, objType, viewModel, dummyVisible, postVisible, onlyDeptUser, roleOnlyAuthVisible, authCode, commonlyObjectVisible, includeMapOrg, showRoleUser];
            _requestMethods.getOrgUnitChildNodes(d, cb);
        },
        //获取全部组织数据 parentId为null时获取根组织数据(排除岗位用户)
        getOrgUnitChildNodesWithoutPostUser: function (parentId, objType, viewModel, dummyVisible, postVisible, roleOnlyAuthVisible, authCode, commonlyObjectVisible, includeMapOrg, onlyDeptUser, showRoleUser, cb) {
            var d = [parentId, objType, viewModel, dummyVisible, postVisible, onlyDeptUser, roleOnlyAuthVisible, authCode, commonlyObjectVisible, includeMapOrg, showRoleUser];
            _requestMethods.getOrgUnitChildNodesWithoutPostUser(d, cb);
        },
        //查询全部组织列表数据
        queryOrgNodePage: function (strKey, sType, pageIndex, pageSize, isCount, includeDummy, includePost, cb) {
            var ic = isCount ? isCount : true;
            var idm = includeDummy ? includeDummy : true;
            var d = [strKey, sType, pageIndex, pageSize, ic, idm, includePost];
            _requestMethods.queryOrgObjectPage(d, cb);
        },
        //根据authCode获取权限项
        getPermissionByAuthCode: function (authCode, limness, userId, cb) {
            var ac = authCode || null;
            _requestMethods.getOrgPermisByAuthCode(ac, limness, userId, cb);
        },
        //根据有权限的NodeId获取所有父节点nodeIds:[id,id1,id2]
        getVisibleNodesPath: function (nodeIds, cb) {
            _requestMethods.getParentIdByNodeId(nodeIds, cb);
        },
        //根据Id和objtype获取对应的组织节点对象nodeIds:[{Id:xx,ObjType:xx, IncludeChild:true},{Id:xx1,ObjType:xx1, IncludeChild:true}]
        getSelectorNodesByNodeId: function (nodeIds, incPartTimeUser, cb) {
            _requestMethods.getSelectorNodesByNodeId(nodeIds, incPartTimeUser, function (d) {
                if (Ext.isArray(d)) {
                    for (i = 0; i < d.length; i++)
                        d[i].Propertys = Gjs.EntityHelper.decodePoco(d[i].Propertys);
                }
                cb(d);
            });
        },
        //根据业务类型编码获取组织ID
        getOrgNodeByBizTypeCode: function (bizCode, levCode, fixedNodes, cb) {
            _requestMethods.getOrgNodeByBizTypeCode(bizCode, levCode, fixedNodes, cb);
        },
        //根据组织业务类别级别 以及权限项获取组织
        getOrgByFixNodeIdAndAuthCode: function (bizCode, levCode, authCode, fixedNodes, cb) {
            _requestMethods.getOrgByFixNodeIdAndAuthCode(bizCode, levCode, authCode, fixedNodes, cb);
        },

        //获取设置的范围
        getOrgSelectorBelonesScope: function (id, cb) {
            _requestMethods.getOrgSelectorBelonesScope(id, cb);
        },
        //是否展开所有根节点
        getOrgSelectorExpandAllRoot: function (cb) {
            _requestMethods.getOrgSelectorExpandAllRoot(cb);
        },


        //获取是否存在常用联系人 常用联系部门
        getUserCommonOrgScope: function (id, cb) {
            _requestMethods.getUserCommonOrgScope(id, cb);
        },
        //对标准的组织树节点格式化
        formatNode: function (node, isRoot, multiSelect) {
            return _formatNodes(node, isRoot, multiSelect);
        },
        //对包含角色、角色组的组织树节点格式化
        formatOrgUnitNode: function (node, pNode, deptSelectAble, userSelectAble, multiSelect, postSelectAble, dummySelectAble, showTip, onlySelDept) {
            return _formatOrgUnitNode(node, pNode, deptSelectAble, userSelectAble, multiSelect, postSelectAble, dummySelectAble, showTip, onlySelDept);
        },
        //查询全部组织列表数据根据权限
        queryOrgUnitPage: function (strKey, objType, pageIndex, pageSize, isCount, includeDept, includeDummy, includePost, includeMapOrg, onlyMainDeptUser, onlyAuth, authCode, allUserRel, onlyBizLimitness, fixNodeIds, bizType, levType, userId, cb) {
            var d = [strKey, objType, pageIndex, pageSize, isCount, includeDept, includeDummy, includePost, includeMapOrg, onlyMainDeptUser, onlyAuth, authCode, allUserRel, onlyBizLimitness, fixNodeIds, bizType, levType, userId];
            _requestMethods.queryOrgUnitPage(d, cb);
        },
        calcImageByObjType: function (r) {
            return _calcImageByObjType(r);
        },
        calcGroupImage: function (r) {
            return _calcGroupImage(r);
        },
        getUserFullDeptId: function (cb) {
            _requestMethods.getUserFullDeptId(cb);
        },

        formatKey_ValueToJson: function (o) {
            return _formatPropertys(o);
        }
    };
} ();