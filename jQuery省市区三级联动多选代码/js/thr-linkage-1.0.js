/**
 *
 * id，插件内部唯一Id
 * zIndex，层级，默认899
 * shade，遮罩，默认0.2。支持true，false，0~1
 * fadeTime，淡入淡出时间（毫秒）
 * dataModel，插件数据来源模式：http 通过url插件自动请求获取数据源，data 通过 “dataSource” 注入数据源
 * dataHttpUri，当 dataModel = http时，代表请求数据源的URL地址（使用GET请求方式）
 * dataHttpPidKeyName，当 dataModel = http时，请求 dataHttpUri 时携带当前选项Id的键值名称，默认 pid
 * dataHttpParams，当 dataModel = http时，需另外携带的请求参数
 * dataHttpResultHandle，当 dataModel = http时，请求数据成功后，将调用该方法进行数据二次处理，然后返回给插件使用
 * dataIndex， 联动数据层级，范围2~5，默认2
 * dataName，联动显示名称，默认：['一级' , '二级' , '三级']
 * dataSource，当 dataModel = data时，为数据源
 * dataOnePid，当 dataModel = data时，一级数据源Id，默认0
 * dataIdKey，数据源Id键值名，默认id
 * selectedValues，默认选中项，形式：[{id:442001001,name:'测试项1',route:id路径}]，route可选
 * maxChecked，最大支持选中项数量，默认5
 * boxClickShow，选择后显示下一级列表，默认true。支持true，false
 * showHtml，Box主体模板
 * showListHtml，下拉框主体Box html
 * showSelectHtml，下拉选择行 html，模板可自定义。内置变量：{id}，{name}，{route}
 * showCheckHtml，单项选择 html，模板可自定义。内置变量：{id}，{name}，{route}，{_on_}（高亮class）
 * showCheckedHtml，已选择项 html，模板可自定义。内置变量：{id}，{name}，{route}
 * showShadeHtml，遮罩 html
 * closeCallBack，关闭按钮回调方法，传入已选中的项
 * confirmCallBack，确认按钮回调方法，传入已选中的项
 * msgCallBack，提示信息处理方法，传入提示消息
 * @type {{id: number, zIndex: number, shade: boolean, fadeTime: number, dataModel: string, dataHttpUri: Array, dataHttpPidKeyName: string, dataHttpParams: {}, dataHttpResultHandle: (function(*): *), dataIndex: number, dataName: string[], dataSource: Array, dataOnePid: number, dataIdKey: string, selectedValues: Array, maxChecked: number, showHtml: string, showListHtml: string, showSelectHtml: string, showCheckHtml: string, showCheckedHtml: string, showShadeHtml: string, closeCallBack: string, confirmCallBack: string, msgCallBack: msgCallBack}}
 * @returns {*}
 */

;
(function($) {

    var instanceNums = 0;

    $.extend({
        linkAgeInit: function(options) {
            var defaults = {
                id: 12138,
                zIndex: 899,
                shade: 0.2,
                fadeTime: 100,
                boxTitle: '请选择地区',
                dataModel: 'http',
                dataHttpUri: [],
                dataHttpPidKeyName: 'pid',
                dataHttpParams: {},
                dataHttpResultHandle: function(res) {
                    return res.data;
                },
                dataIndex: 2,
                dataName: ['省', '市', '区'],
                dataSource: [],
                dataOnePid: 0,
                dataIdKey: 'id',
                //已选择Id项
                selectedValues: [],
                // maxChecked:,
                boxClickShow: true,
                showHtml: ' <div class="thr-linkage thr-box-{id}" style="z-index: {z_index};display:block;">\n' +
                    '            <div class="thr-header">{boxTitle}\n' +
                    '                <i id="closeBox" class="thr-close thr-close-{id} fr lh30"></i>\n' +
                    '            </div>\n' +
                    '            <div class="thr-areas pd10" style="max-height: 150px;overflow: auto;">\n' +
                    '                <h4 class="mtb5">您已选择 <span style="font-weight:400;">（ <span id="selNum" style="color:#0997DC;">0</span>个区 ）</span><small class="fz12 fw"></small><button style="display:none" class="fr thr-confirm">确定</button></h4>\n' +
                    '                <dl class="fz14 thr-select-area">\n' +
                    '                   {selectedList}' +
                    '                </dl>\n' +
                    '            </div>\n' +
                    '{selectList}' +

                    '            <div class="thr-check-box fz14" style="float:left;width: 56%;">\n' +
                    '<li class="fz16 thr-name" style="height: 26px;line-height: 26px;background-color: #e4e4e4;border-bottom: 1px solid #eee;text-align: center;padding-right: 66px;">区</li>' +
                    '<span class="checkAllSpan" style="margin-top: -6px; display: inline-block;position:relative;" style="display:none;"><input type="checkbox" id="checkAll" style="margin:20px 0 0 20px;"><span style="position: absolute;bottom: 1px;left: 36px;z-index:-1;">全选</span></span>' +
                    '                <dl class="pd10" style="padding-top:2px !important;">\n' +
                    '                </dl>\n' +
                    '            </div>\n' +
                    '        </div>',
                showListHtml: '<div class="thr-list-area thr-list-{index} fz14 mt10 fl" data-index="{index}" {display}>\n' +
                    '                <ul>\n' +
                    '                    <li class="fz16 thr-name">{name}</li>\n' +
                    '                    {volistItem}' +
                    '                </ul>\n' +
                    '            </div>',
                showSelectHtml: '<li data-id="{id}" data-route="{route}" class="">{name}</li>',
                showCheckHtml: '<dd data-id="{id}" data-route="{route}" class="{_on_}">{name}</dd>',
                showCheckedHtml: '<div span-router="{spanRouter}" style="margin-top: 10px;"><span style="position:relative;font-weight:700;font-size:15px;margin-left: 16px;line-height: 30px;"><i style="right:-10px;"></i>{provinceName}{cityName}</span><dd data-id="{id}" data-route="{route}" class="on">{name}<i></i></dd></div>',
                showShadeHtml: '<div  class="thr-linkage-shade" style="display: block;z-index: {z_index}"></div>',
                closeCallBack: '',
                confirmCallBack: '',
                msgCallBack: function(msg) {
                    alert(msg);
                }
            };

            if (!options) options = {};
            //初始化配置
            options = $.extend(defaults, options);
            //唯一Id
            instanceNums++;
            options.id = options.id + instanceNums;

            if (options.dataIndex < 2) {
                console.log('Error : dataIndex 不能小于2！');
                return false;
            }

            try {
                //实例化
                return init(options);
            } catch (e) {
                console.log('Error : ', e);
                return false;
            }

        },
    });


    //私有业务方法
    //实例化插件
    function init(options) {

        return {
            options: options,
            /**
             * 打开窗口
             * @param areaItem
             */
            open: function(areaItem) {
                var $this = this;
                var $thisSys = $this.options;
                //选择元素
                if (!areaItem) areaItem = 'body';
                //BoxId
                var thisBoxId = '.thr-box-' + $thisSys.id + ' ';

                //遮罩
                if ($thisSys.shade !== false) {
                    var thisShadeTpl = $thisSys.showShadeHtml;
                    var shadeNums = $thisSys.shade === true ? 0.2 : $thisSys.shade;
                    thisShadeTpl = thisShadeTpl.replace(/{shadeNums}/g, shadeNums);
                    thisShadeTpl = thisShadeTpl.replace(/{z_index}/g, $thisSys.zIndex - 1);
                    $(areaItem).append(thisShadeTpl);
                }

                //判断Box是否存在
                var thisStatus = $(".thr-box-" + $thisSys.id).css('display');
                if (thisStatus == 'none') {
                    $(".thr-box-" + $thisSys.id).fadeIn($thisSys.fadeTime);
                    //局部渲染
                    if ($thisSys.selectedValues.constructor == Array && $thisSys.selectedValues.length > 0) {
                        var thisSelectedIds = [];
                        for (var i in $thisSys.selectedValues) {
                            thisSelectedIds.push($thisSys.selectedValues[i].id);
                        }
                        $(thisBoxId + '.thr-select-area dd').each(function() {
                            var $this = $(this);
                            var $thisId = $(this).data('id');
                            if (!in_array($thisId, thisSelectedIds)) {
                                //丢弃选项
                                $this.remove();
                                //丢球选中
                                $(thisBoxId + ".thr-check-box dd[data-id='" + $thisId + "']").removeClass('on');
                            }
                        })
                    }
                    return;
                }

                var thisHtml = $thisSys.showHtml;
                //替换
                thisHtml = thisHtml.replace(/{id}/g, $thisSys.id);
                thisHtml = thisHtml.replace(/{z_index}/g, $thisSys.zIndex);
                thisHtml = thisHtml.replace(/{boxTitle}/g, $thisSys.boxTitle);
                thisHtml = thisHtml.replace(/{maxChecked}/g, $thisSys.maxChecked);
                //遍历结构体
                thisHtml = thisHtml.replace(/{selectList}/g, loopSelectBoxInit($thisSys));
                //遍历已选择项
                var existCiryArr = []
                if ($thisSys.selectedValues.constructor == Array) {
                    var selectedHtml = '';
                    for (var s in $thisSys.selectedValues) {
                        var selectedTpl = $thisSys.showCheckedHtml;

                        // selectedTpl = selectedTpl.replace(/{id}/g, $thisSys.selectedValues[s].id);
                        // selectedTpl = selectedTpl.replace(/{name}/g, $thisSys.selectedValues[s].provinceName + '/' + $thisSys.selectedValues[s].cityName + '/' + $thisSys.selectedValues[s].name);
                        // selectedTpl = selectedTpl.replace(/{route}/g, '');
                        // selectedHtml += selectedTpl;
                        if (!existCiryArr.includes($thisSys.selectedValues[s].cityName)) {
                            existCiryArr.push($thisSys.selectedValues[s].cityName);
                            selectedTpl = selectedTpl.replace(/{id}/g, $thisSys.selectedValues[s].id);
                            selectedTpl = selectedTpl.replace(/{name}/g, $thisSys.selectedValues[s].name);
                            selectedTpl = selectedTpl.replace(/{route}/g, '');
                            selectedTpl = selectedTpl.replace(/{spanRouter}/g, $thisSys.selectedValues[s].provinceId + '-' + $thisSys.selectedValues[s].cityId);
                            selectedTpl = selectedTpl.replace(/{provinceName}/g, $thisSys.selectedValues[s].provinceName + '/');
                            selectedTpl = selectedTpl.replace(/{cityName}/g, $thisSys.selectedValues[s].cityName + '</br>');
                            selectedHtml += selectedTpl;

                        } else {
                            BselectedTpl = '<dd data-id="{id}" data-route="{route}" class="on">{name}<i></i></dd>'
                            BselectedTpl = BselectedTpl.replace(/{id}/g, $thisSys.selectedValues[s].id);
                            BselectedTpl = BselectedTpl.replace(/{name}/g, $thisSys.selectedValues[s].name);
                            BselectedTpl = BselectedTpl.replace(/{route}/g, '');
                            var id = $thisSys.selectedValues[s].provinceId + '-' + $thisSys.selectedValues[s].cityId
                                // var lastindex = selectedHtml.lastIndexOf('span-router="' + id + '"') - 1
                            var lastindex = selectedHtml.lastIndexOf("</div>")
                                // setTimeout(() => {
                                //     $("div[span-router='" + id + "']").append(BselectedTpl)
                                // }, 1)
                            let insertStr = (soure, start, newStr) => {
                                return soure.slice(0, start) + newStr + soure.slice(start)
                            }
                            selectedHtml = insertStr(selectedHtml, lastindex, BselectedTpl);
                        }
                    }

                    thisHtml = thisHtml.replace(/{selectedList}/g, selectedHtml);
                } else {
                    thisHtml = thisHtml.replace(/{selectedList}/g, '');
                }
                //输出
                $(areaItem).append(thisHtml);
                //显示
                $(thisBoxId).fadeIn($thisSys.fadeTime);

                //移除事件
                $('body').off('click', thisBoxId + '.thr-list-area ul li');
                $('body').off('click', thisBoxId + '.thr-check-box dl dd');
                $('body').off('click', thisBoxId + '.thr-select-area dd');
                $('body').off('click', thisBoxId + '.thr-confirm');
                $('body').off('click', thisBoxId + '.thr-close-' + $thisSys.id);
                $('#selNum').html($thisSys.selectedValues.length)
                if ($thisSys.selectedValues.length > 0) {
                    $('.thr-confirm').css('display', 'block')
                } else {
                    $('.thr-confirm').css('display', 'none')
                }
                setTimeout(() => {
                    $('.thr-list-1 li:nth-child(2)').click()
                    $('.thr-list-2 li:nth-child(2)').click()
                        // $('.thr-list-area').find('li[data-id="100"]').click()
                }, 1);
                //绑定事件
                //下拉选择区点击
                $('body').on('click', thisBoxId + '.thr-list-area ul li:not(:first-child)', function() {
                    $('#checkAll')[0].checked = false
                    $('.checkAllSpan').css('display', 'none')
                    $('.thr-check-box .pd10').css('opacity', '0')
                    var $thisLi = $(this);
                    var $index = $thisLi.parent().parent().data('index');
                    if ($index == 2) {
                        $('.checkAllSpan').css('display', 'block')
                    }
                    var nextIndex = parseInt($index) + 1;
                    var $thisId = $thisLi.data('id');
                    var $thisRoute = $thisLi.data('route');

                    $thisLi.siblings().removeClass('on');
                    $thisLi.addClass('on');
                    if (nextIndex < $thisSys.dataIndex) {
                        if ($thisSys.boxClickShow) {
                            //显示
                            $('.thr-box-' + $thisSys.id + ' .thr-list-' + nextIndex).show();
                        }

                        var nextHtml = loopSelectBoxItem($thisId, $thisSys.showSelectHtml, nextIndex, $thisRoute, $thisSys);
                        $('.thr-box-' + $thisSys.id + ' .thr-list-' + nextIndex + ' ul li.thr-name').nextUntil().remove();
                        $('.thr-box-' + $thisSys.id + ' .thr-list-' + nextIndex + ' ul').append(nextHtml);
                        return;
                    }
                    //最后一级
                    var nextHtml = loopSelectBoxItem($thisId, $thisSys.showCheckHtml, nextIndex, $thisRoute, $thisSys);
                    $('.thr-box-' + $thisSys.id + ' .thr-check-box dl').html('').append(nextHtml);
                    $('#checkAll')[0].checked = true
                    var pd10 = $($('.pd10'))[1].childNodes
                    for (var i = 0; i < pd10.length; i++) {
                        var $thisDd = $(pd10[i]);
                        if ($thisDd[0].className == '') {
                            $('#checkAll')[0].checked = false
                        }
                    }
                    $('.thr-check-box .pd10').css('opacity', '1')
                });

                //选择项事件
                $('body').on('click', thisBoxId + '.thr-check-box dl dd', function() {
                    var $thisDd = $(this);
                    var $thisId = $thisDd.data('id');
                    var $thisRoute = $thisDd.data('route');
                    var $thisName = $.trim($thisDd.text());

                    if ($thisSys.selectedValues.constructor != Array) {
                        $thisSys.selectedValues = [];
                    }

                    //验证已选择
                    for (var s in $thisSys.selectedValues) {
                        if ($thisId == $thisSys.selectedValues[s].id) {
                            //删除操作
                            $thisSys.selectedValues.splice(s, 1);
                            $thisDd.removeClass('on');
                            if ($(thisBoxId + ".thr-select-area dd[data-id='" + $thisId + "']").siblings('dd').length == 0) {
                                var html = $(thisBoxId + ".thr-select-area dd[data-id='" + $thisId + "']").parent().children('span')[0].innerHTML;
                                var start = html.indexOf('/') + 1;
                                var end = html.indexOf('<br>')
                                existCiryArr.splice(existCiryArr.indexOf(html.substring(start, end)), 1)
                                $(thisBoxId + ".thr-select-area dd[data-id='" + $thisId + "']").parent().remove();

                            }
                            $(thisBoxId + ".thr-select-area dd[data-id='" + $thisId + "']").remove();

                            $('#selNum').html($thisSys.selectedValues.length)
                            if ($thisSys.selectedValues.length > 0) {
                                $('.thr-confirm').css('display', 'block')
                            } else {
                                $('.thr-confirm').css('display', 'none')
                            }
                            $('#checkAll')[0].checked = true
                            var pd10 = $($('.pd10'))[1].childNodes
                            for (var i = 0; i < pd10.length; i++) {
                                var $thisDd = $(pd10[i]);
                                if ($thisDd[0].className == '') {
                                    $('#checkAll')[0].checked = false
                                }
                            }
                            return false;
                        }
                    }
                    //验证最大选择数量
                    if ($thisSys.selectedValues.length >= $thisSys.maxChecked) {
                        if (typeof $thisSys.msgCallBack == 'function') {
                            $thisSys.msgCallBack('您最多只可选择 ' + $thisSys.maxChecked + ' 个哦！');
                        }
                        return false;
                    }
                    //添加
                    var thisTpl = $thisSys.showCheckedHtml;

                    // thisTpl = thisTpl.replace(/{id}/g, $thisId);
                    // thisTpl = thisTpl.replace(/{name}/g, $('.thr-list-area li.on')[0].innerHTML + '/' + $('.thr-list-area li.on')[1].innerHTML + '/' + $thisName);
                    // thisTpl = thisTpl.replace(/{route}/g, $thisRoute);
                    var id = $thisRoute.substring(0, $thisRoute.lastIndexOf('-'))
                    if (!existCiryArr.includes($('.thr-list-area li.on')[1].innerHTML)) {
                        existCiryArr.push($('.thr-list-area li.on')[1].innerHTML);
                        thisTpl = thisTpl.replace(/{id}/g, $thisId);
                        thisTpl = thisTpl.replace(/{name}/g, $thisName);
                        thisTpl = thisTpl.replace(/{route}/g, '');
                        thisTpl = thisTpl.replace(/{spanRouter}/g, id);
                        thisTpl = thisTpl.replace(/{provinceName}/g, $('.thr-list-area li.on')[0].innerHTML + '/');
                        thisTpl = thisTpl.replace(/{cityName}/g, $('.thr-list-area li.on')[1].innerHTML + '</br>');
                        $(thisBoxId + '.thr-select-area').append(thisTpl);
                    } else {
                        BselectedTpl = '<dd data-id="{id}" data-route="{route}" class="on">{name}<i></i></dd>'
                        BselectedTpl = BselectedTpl.replace(/{id}/g, $thisId);
                        BselectedTpl = BselectedTpl.replace(/{name}/g, $thisName);
                        BselectedTpl = BselectedTpl.replace(/{route}/g, '');
                        $("div[span-router=" + id + "]").append(BselectedTpl)
                    }
                    $thisSys.selectedValues.push({ provinceId: $thisRoute.split('-')[0], cityId: $thisRoute.split('-')[1], id: $thisId, name: $thisName, route: $thisRoute, provinceName: $('.thr-list-area li.on')[0].innerHTML, cityName: $('.thr-list-area li.on')[1].innerHTML });
                    $thisDd.addClass('on');
                    $('#selNum').html($thisSys.selectedValues.length)

                    if ($thisSys.selectedValues.length > 0) {
                        $('.thr-confirm').css('display', 'block')
                    } else {
                        $('.thr-confirm').css('display', 'none')
                    }
                    $('#checkAll')[0].checked = true
                    var pd10 = $($('.pd10'))[1].childNodes
                    for (var i = 0; i < pd10.length; i++) {
                        var $thisDd = $(pd10[i]);
                        if ($thisDd[0].className == '') {
                            $('#checkAll')[0].checked = false
                        }
                    }

                });
                $('#checkAll').click(function() {

                        // })
                        // $('body').on('click', '#checkAll', function() {
                        var selId = [];
                        for (var i = 0; i < $thisSys.selectedValues.length; i++) {
                            selId.push($thisSys.selectedValues[i].id)
                        }
                        if ($(this)[0].checked) {
                            //全选   

                            var pd10 = $($('.pd10'))[1].childNodes
                            for (var i = 0; i < pd10.length; i++) {
                                var $thisDd = $(pd10[i]);

                                var $thisId = $thisDd.data('id');
                                if (!selId.includes($thisId)) {
                                    var $thisRoute = $thisDd.data('route');
                                    var $thisName = $.trim($thisDd.text());

                                    if ($thisSys.selectedValues.constructor != Array) {
                                        $thisSys.selectedValues = [];
                                    }
                                    //添加
                                    var thisTpl = $thisSys.showCheckedHtml;
                                    var id = $thisRoute.substring(0, $thisRoute.lastIndexOf('-'))

                                    if (!existCiryArr.includes($('.thr-list-area li.on')[1].innerHTML)) {
                                        existCiryArr.push($('.thr-list-area li.on')[1].innerHTML);
                                        thisTpl = thisTpl.replace(/{id}/g, $thisId);
                                        thisTpl = thisTpl.replace(/{name}/g, $thisName);
                                        thisTpl = thisTpl.replace(/{route}/g, '');
                                        thisTpl = thisTpl.replace(/{spanRouter}/g, id);
                                        thisTpl = thisTpl.replace(/{provinceName}/g, $('.thr-list-area li.on')[0].innerHTML + '/');
                                        thisTpl = thisTpl.replace(/{cityName}/g, $('.thr-list-area li.on')[1].innerHTML + '</br>');
                                        $(thisBoxId + '.thr-select-area').append(thisTpl);
                                    } else {
                                        BselectedTpl = '<dd data-id="{id}" data-route="{route}" class="on">{name}<i></i></dd>'
                                        BselectedTpl = BselectedTpl.replace(/{id}/g, $thisId);
                                        BselectedTpl = BselectedTpl.replace(/{name}/g, $thisName);
                                        BselectedTpl = BselectedTpl.replace(/{route}/g, '');
                                        $("div[span-router=" + id + "]").append(BselectedTpl)
                                    }
                                    $thisSys.selectedValues.push({ provinceId: $thisRoute.split('-')[0], cityId: $thisRoute.split('-')[1], id: $thisId, name: $thisName, route: $thisRoute, provinceName: $('.thr-list-area li.on')[0].innerHTML, cityName: $('.thr-list-area li.on')[1].innerHTML });
                                    $thisDd.addClass('on');
                                }
                            }
                            var allArr = []; //新数组
                            for (var i = 0; i < $thisSys.selectedValues.length; i++) {　　
                                var flag = true;　　
                                for (var j = 0; j < allArr.length; j++) {　　　　
                                    if ($thisSys.selectedValues[i].id == allArr[j].id) {　　
                                        flag = false;　　　　
                                    };　　
                                };　　
                                if (flag) {
                                    allArr.push($thisSys.selectedValues[i]);
                                };
                            }
                            $thisSys.selectedValues = allArr

                            // console.log($(thisBoxId + '.thr-select-area')[0].childNodes)
                            // var childNodes = $(thisBoxId + '.thr-select-area')[0].childNodes;
                            // var nodesAllArr = []; //新数组
                            // for (var i = 0; i < childNodes.length; i++) {　　
                            //     var flag = true;　　
                            //     for (var j = 0; j < nodesAllArr.length; j++) {　　　　
                            //         if (childNodes[i].innerHTML == nodesAllArr[j].innerHTML) {　　
                            //             flag = false;　　　　
                            //         };　　
                            //     };　　
                            //     if (flag) {
                            //         nodesAllArr.push(childNodes[i]);
                            //     };
                            // }
                            // console.log('childNodes :', childNodes);
                            // $(thisBoxId + '.thr-select-area')[0].childNodes = nodesAllArr
                            // console.log(nodesAllArr)

                        } else {
                            //全删除
                            var pd10 = $($('.pd10'))[1].childNodes

                            for (var i = 0; i < pd10.length; i++) {

                                var $thisDd = $(pd10[i]);

                                var $thisId = $thisDd.data('id');

                                if ($thisSys.selectedValues.constructor != Array) {
                                    $thisSys.selectedValues = [];
                                    return false;
                                }

                                //删除数据
                                for (var s in $thisSys.selectedValues) {
                                    if ($thisId == $thisSys.selectedValues[s].id) {
                                        //删除
                                        $thisSys.selectedValues.splice(s, 1);
                                    }
                                }

                                // $('.thr-select-area dd').remove();
                                // $thisDd.remove();
                                // var html = $(thisBoxId + ".thr-select-area dd[data-id='" + $thisId + "']").siblings()[0].innerHTML;
                                // var start = html.indexOf('/') + 1;
                                // var end = html.indexOf('<br>')
                                if (existCiryArr.indexOf($('.thr-list-area li.on')[1].innerHTML) >= 0) {
                                    existCiryArr.splice(existCiryArr.indexOf($('.thr-list-area li.on')[1].innerHTML), 1)
                                }
                                $(thisBoxId + ".thr-select-area dd[data-id='" + $thisId + "']").parent().remove();
                                // $(thisBoxId + ".thr-select-area dd[data-id='" + $thisId + "']").remove();
                                $(thisBoxId + ".thr-check-box dl dd[data-id='" + $thisId + "']").removeClass('on');
                            }
                        }

                        $('#selNum').html($thisSys.selectedValues.length)
                        if ($thisSys.selectedValues.length > 0) {
                            $('.thr-confirm').css('display', 'block')
                        } else {
                            $('.thr-confirm').css('display', 'none')
                        }
                    })
                    //点击删除项
                $('body').on('click', thisBoxId + '.thr-select-area i', function() {
                    if ($(this).parent()[0].tagName == 'SPAN') {
                        var html = $(this).parent()[0].innerHTML
                        var start = html.lastIndexOf('/') + 1;
                        var end = html.indexOf('<br>')
                        existCiryArr.splice(existCiryArr.indexOf(html.substring(start, end)), 1)
                        for (var i = 0; i < $(this).parent().siblings('dd').length; i++) {
                            var $thisDd = $($(this).parent().siblings('dd')[i]);
                            var $thisId = $thisDd.data('id');
                            if ($thisSys.selectedValues.constructor != Array) {
                                $thisSys.selectedValues = [];
                                return false;
                            }
                            // 删除数据
                            for (var s in $thisSys.selectedValues) {
                                if ($thisId == $thisSys.selectedValues[s].id) {
                                    //删除 
                                    $thisSys.selectedValues.splice(s, 1);
                                }
                            }

                            //$thisDd.parent().remove();
                            $(thisBoxId + ".thr-check-box dl dd[data-id='" + $thisId + "']").removeClass('on');

                        }
                        $(this).parent().parent().remove()
                    } else {
                        var $thisDd = $(this).parent();
                        var $thisId = $thisDd.data('id');
                        if ($thisSys.selectedValues.constructor != Array) {
                            $thisSys.selectedValues = [];
                            return false;
                        }

                        //删除数据
                        for (var s in $thisSys.selectedValues) {
                            if ($thisId == $thisSys.selectedValues[s].id) {
                                //删除 
                                $thisSys.selectedValues.splice(s, 1);
                            }
                        }
                        if ($thisDd.siblings('dd').length == 0) {
                            var html = $thisDd.parent().children('span')[0].innerHTML;
                            var start = html.lastIndexOf('/') + 1;
                            var end = html.indexOf('<br>')
                            existCiryArr.splice(existCiryArr.indexOf(html.substring(start, end)), 1)
                            $thisDd.parent().remove();
                        }
                        $thisDd.remove();

                        $(thisBoxId + ".thr-check-box dl dd[data-id='" + $thisId + "']").removeClass('on');

                        // $('#selNum').html($thisSys.selectedValues.length)
                        // $('#checkAll')[0].checked = true
                        // var pd10 = $($('.pd10'))[1].childNodes
                        // for (var i = 0; i < pd10.length; i++) {
                        //     var $thisDd = $(pd10[i]);
                        //     if ($thisDd[0].className == '') {
                        //         $('#checkAll')[0].checked = false
                        //     }
                        // }
                    }
                    $('#selNum').html($thisSys.selectedValues.length)
                    if ($thisSys.selectedValues.length > 0) {
                        $('.thr-confirm').css('display', 'block')
                    } else {
                        $('.thr-confirm').css('display', 'none')
                    }
                    $('#checkAll')[0].checked = true
                    var pd10 = $($('.pd10'))[1].childNodes
                    for (var i = 0; i < pd10.length; i++) {
                        var $thisDd = $(pd10[i]);
                        if ($thisDd[0].className == '') {
                            $('#checkAll')[0].checked = false
                        }
                    }


                });
                //确定事件
                $('body').on('click', thisBoxId + '.thr-confirm', function() {
                    $(".thr-linkage-shade").remove();
                    $(".thr-box-" + $thisSys.id).fadeOut($thisSys.fadeTime);
                    //回调
                    if (typeof $thisSys.confirmCallBack == 'function') {
                        $thisSys.confirmCallBack($thisSys.selectedValues);
                    }
                });
                //关闭
                $('body').on('click', "#closeBox", function() {
                    $(".thr-linkage-shade").remove();
                    $(".thr-box-" + $thisSys.id).fadeOut($thisSys.fadeTime, function() {
                        $(this).remove();
                    });
                    //回调
                    if (typeof $thisSys.closeCallBack == 'function') {
                        $thisSys.closeCallBack($thisSys.selectedValues);
                    }
                    //清空已选数据
                    existCiryArr = []
                    $thisSys.selectedValues = []
                    selDataed.map((item) => {
                        $thisSys.selectedValues.push(item)
                        existCiryArr.push(item.cityName)
                    })

                    existCiryArr = Array.from(new Set(existCiryArr))
                        // existCiryArr = []
                        // existCiryArr.push($thisSys.selectedValues[s].cityName);
                });
            },
            /**
             * 注入已选数据，格式：[{id:1,name:名称,route:id路径}]
             * @param selected
             */
            set: function(selected) {
                var $this = this;
                if (selected && selected.constructor == Array) {
                    $this.options.selectedValues = selected;
                    return;
                }
                $this.options.selectedValues = [];
            }
        };
    }


    /**
     * 根据配置遍历单项下拉选择数据（初始化）
     * @param thisSys
     */
    function loopSelectBoxInit(thisSys) {

        var thisList = '';
        for (var i = 0; i < (thisSys.dataIndex - 1); i++) {
            var volistItem = '';
            var thisListHtml = thisSys.showListHtml;
            thisListHtml = thisListHtml.replace(/{index}/g, (i + 1));
            thisListHtml = thisListHtml.replace(/{name}/g, thisSys.dataName[i]);

            //初始化
            if (i == 0) {
                thisListHtml = thisListHtml.replace(/{display}/g, '');
                volistItem = loopSelectBoxItem(thisSys.dataOnePid - 1, thisSys.showSelectHtml, (i + 1), '', thisSys);
            } else {
                thisListHtml = thisListHtml.replace(/{display}/g, thisSys.boxClickShow ? 'style="display:none;"' : '');
                volistItem = '';
            }
            thisListHtml = thisListHtml.replace(/{volistItem}/, volistItem)
            thisList += thisListHtml;
        }

        return thisList;

    }


    function loopSelectBoxItem(thisPid, thisHtml, thisIndex, thisRoute, thisSys) {
        var thisData = [];
        var thisSelectIdValue = [];
        if (thisSys.selectedValues.constructor == Array) {
            for (var s in thisSys.selectedValues) {
                thisSelectIdValue.push(thisSys.selectedValues[s].id);
            }
        }

        switch (thisSys.dataModel) {
            case 'http':
                if (thisSys.dataHttpUri.constructor == Array) {
                    var thisUrl = thisSys.dataHttpUri[thisIndex - 1];
                } else {
                    var thisUrl = thisSys.dataHttpUri;
                }
                if (isNull(thisUrl)) {
                    throw new Error('dataHttpUri Error : data error !');
                }

                //构造请求参数
                var requestData = {};
                requestData[thisSys.dataHttpPidKeyName] = thisPid;
                requestData = $.extend(requestData, thisSys.dataHttpParams);
                //请求
                $.ajax({
                    async: false,
                    type: 'GET',
                    url: thisUrl,
                    data: requestData,
                    error: function() {},
                    success: function(res) {
                        if (typeof thisSys.dataHttpResultHandle == 'function') {
                            thisData = thisSys.dataHttpResultHandle(res);
                        }
                    }
                });
                break;
            case 'data':
                if (!(thisSys.dataSource).hasOwnProperty(thisPid)) {
                    throw new Error('dataSource Error : ' + thisPid + ' Property does not exist !');
                }
                thisData = thisSys.dataSource[thisPid];
                break;
            default:
                throw new Error('dataModel Error !');
        }
        if (isNull(thisData)) return '';

        //遍历html
        var returnHtml = '';
        for (var i in thisData) {
            var thisForHtml = thisHtml;
            if (thisData[i].constructor == Object) {
                for (var j in thisData[i]) {
                    var thisExp = new RegExp('{' + j + '}', 'g');
                    thisForHtml = thisForHtml.replace(thisExp, thisData[i][j]);
                    //选项高亮
                    if (!isNull(thisSelectIdValue) && thisIndex == thisSys.dataIndex && in_array(thisData[i][thisSys.dataIdKey], thisSelectIdValue)) {
                        thisForHtml = thisForHtml.replace(/{_on_}/, 'on');
                    } else {
                        thisForHtml = thisForHtml.replace(/{_on_}/, '');
                    }

                    //路由Id
                    var thisRouteTxt = '';
                    if (isNull(thisRoute)) {
                        thisRouteTxt = thisData[i][thisSys.dataIdKey];
                    } else {
                        thisRouteTxt = thisRoute + '-' + thisData[i][thisSys.dataIdKey];
                    }
                    thisForHtml = thisForHtml.replace(/{route}/, thisRouteTxt);
                }
            } else {
                throw new Error('dataSource Error : ', thisData[i]);
            }
            returnHtml += thisForHtml;
        }
        //返回
        return returnHtml;
    }


    //公共方法
    /**
     * 检验数据是否为 null，undefined，""
     * @param string
     * @returns {boolean}
     */
    function isNull(string) {
        string = $.trim(string);
        if (string === 0) {
            return false;
        }
        if (string == "" || string == undefined || string == null || string == "undefined") {
            return true;
        }
        return false;
    }


    /**
     * 搜索某个值是否存在数组之内
     * @param needle 搜索的值
     * @param haystack 被搜索的数组
     * */
    function in_array(needle, haystack) {
        if (haystack.constructor != Array) {
            haystack = String(haystack).split(',');
        }
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
            if (haystack[i] == needle) return true;
        }
        return false;
    }
    //  关闭事件

})(jQuery);