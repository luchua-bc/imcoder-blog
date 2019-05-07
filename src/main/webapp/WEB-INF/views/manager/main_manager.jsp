﻿<%@ page language="java" import="site.imcoder.blog.setting.Config" pageEncoding="UTF-8" %>
<%@ page import="site.imcoder.blog.setting.ConfigConstants" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt_rt" %>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
    String staticPath = Config.get(ConfigConstants.SITE_CDN_ADDR);
    String cloudPath = Config.get(ConfigConstants.SITE_CLOUD_ADDR);
    String urlArgs = Config.get(ConfigConstants.SITE_CDN_ADDR_ARGS);
    request.setAttribute("site_icp_record_code", Config.get(ConfigConstants.SITE_ICP_RECORD_CODE));
    request.setAttribute("site_police_record_code", Config.get(ConfigConstants.SITE_POLICE_RECORD_CODE));
    request.setAttribute("site_police_record_number", Config.get(ConfigConstants.SITE_POLICE_RECORD_NUMBER));
    //request.setAttribute("settingArray", Config.getAll().entrySet());
%>
<!DOCTYPE html>
<html class="no-js">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <base href="<%=basePath%>" target="_self">
    <title>Website Administer System - ImCoder's 博客</title>
    <meta name="description" content="博客后台管理中心">
    <meta name="keywords" content="博客后台管理中心">
    <!-- 使用url函数转换相关路径 -->
    <!-- <script async="" src="http://www.google-analytics.com/analytics.js"></script> -->

    <!-- 引入文件 -->
    <link rel="icon" href="<%=staticPath%>img/favicon.ico">
    <link rel="stylesheet" href="<%=staticPath%>lib/bootstrap/bootstrap.min.css<%=urlArgs%>">
    <link rel="stylesheet" href="<%=staticPath%>lib/animate/animate.min.css<%=urlArgs%>">
    <%--<link rel="stylesheet" href="<%=staticPath%>lib/css/style.hplus.min.css<%=urlArgs%>">--%>
    <link rel="stylesheet" href="<%=staticPath%>lib/toastr/toastr.min.css<%=urlArgs%>">
    <link rel="stylesheet" href="<%=staticPath%>css/style.css<%=urlArgs%>">
</head>
<body uid="<c:if test="${not empty loginUser}"><s:eval expression="loginUser.uid"/></c:if>">
<!-- <body background="../../img/bg-site.png"> -->
<!-- START THE COVER  background-image: url(img/bg-site.png);" -->
<div id="first" class="" style="z-index:1000;background-image: url(<%=staticPath%>img/bg-site.png);">
    <div class="carousel-inner">
        <div class="">
            <div class="container">
                <div class="" style="text-align:center">
                    <h1>Website Administer System</h1>
                </div>
            </div>
        </div>
    </div><!-- END COVER -->
</div>

<!-- start #toolbar -->
<nav id="header" class="navbar navbar-default toolbar" role="navigation">
    <div class="container-fluid">
        <div class="navbar-header">
            <div class="navbar-brand">
                <p><a class="logo" style="color: #333;" href="<%=basePath%>">ImCoder</a></p>
            </div>
            <button type="button" class="navbar-toggle collapsed " data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <div class="collapse navbar-collapse hiddenscorll" id="navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="dropdown sitenavigation">
                    <a class="dropdown-toggle" data-toggle="dropdown">导航<span class="caret"></span></a>
                    <ul class="dropdown-menu " role="menu">
                        <div class="row">
                            <div class="col-sm-2 rowname">
                                <div class="coldesc">分类</div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="a/list?category.atid=0" target="_blank">默认</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="a/list?category.atid=1" target="_blank">开发</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="a/list?category.atid=2" target="_blank">折腾</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="a/list?category.atid=3" target="_blank">资源</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="a/list?category.atid=4" target="_blank">科技</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="a/list?category.atid=5" target="_blank">游戏</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="a/list?category.atid=6" target="_blank">段子</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="a/list?category.atid=7" target="_blank">杂谈</a></div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-2 rowname">
                                <div class="coldesc">服务</div>
                            </div>
                            <div class="col-xs-1 morespace">
                                <div class="coldesc"><a class="toolbar_jump_writeblog">写博客</a></div>
                            </div>
                            <div class="col-xs-1 morespace">
                                <div class="coldesc"><a class="toolbar_jump_paste_code" href="http://paste.ubuntu.com" target="_blank">贴代码</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_albums" href="<%=basePath%>p/dashboard" target="_blank">相册</a></div>
                            </div>
                            <div class="col-sm-1" style="padding-left: 5px">
                                <div class="coldesc"><a class="toolbar_jump_cloud" href="<%=cloudPath%>" target="_blank">cloud</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_archives" href="<%=basePath%>a/archives" target="_blank">归档</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_tags" href="<%=basePath%>a/tags" target="_blank">标签</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_user_history" href="<%=basePath%>u/history" target="_blank">历史</a></div>
                            </div>
                            <c:if test="${ (!empty loginUser) && loginUser.userGroup.isManager() }">
                                <div class="col-sm-1">
                                    <div class="coldesc"><a class="toolbar_jump_manager" href="manager/backstage" target="_blank">管理</a></div>
                                </div>
                            </c:if>
                        </div>
                        <div class="row">
                            <div class="col-sm-2 rowname">
                                <div class="coldesc">站点</div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_login">登录</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_register" href="auth/register" target="_blank">注册</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_notice" target="_blank" href="notices">公告</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_help" target="_blank" href="help">帮助</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_about" target="_blank" href="<%=basePath%>about">关于</a></div>
                            </div>
                        </div>
                    </ul>
                </li>
                <li><a href="<%=basePath%>">首页</a></li>
                <li class="active"><a>后台管理</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <form class="navbar-form navbar-left" role="search">
                    <div class="form-group">
                        <input type="text" class="search-query form-control span3 toolbar_search_input" style="margin:auto;" name="kw" placeholder="输入关键字搜索">
                    </div>
                    <button type="button" class="btn-search submit toolbar_search_trigger">搜索</button>
                </form>
                <c:if test="${ !empty loginUser }">
                    <li class="dropdown user">
                        <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                            <img src="<s:eval expression="loginUser.head_photo"/>"/><span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <h4><a class="anav-menu_user toolbar_user_profilecenter" href="<%=basePath%>u/<s:eval expression="loginUser.uid"/>/center" target="_blank">个人中心</a></h4>
                            <h4><a class="anav-menu_user toolbar_user_userhome" href="<%=basePath%>u/<s:eval expression="loginUser.uid"/>/home" target="_blank">我的博客</a></h4>
                            <h4><a class="anav-menu_user toolbar_user_albums" href="<%=basePath%>u/<s:eval expression="loginUser.uid"/>/albums" target="_blank">我的相册</a></h4>
                            <h4><a class="anav-menu_user toolbar_user_messages" href="<%=basePath%>u/<s:eval expression="loginUser.uid"/>/center/messages" target="_blank">我的消息</a></h4>
                            <h4><a class="anav-menu_user toolbar_user_setting" href="<%=basePath%>u/<s:eval expression="loginUser.uid"/>/center/settings" target="_blank">修改设置</a></h4>
                            <h4><a class="anav-menu_user toolbar_user_logout" title="点击退出登录">安全退出</a></h4>
                        </ul>
                    </li>
                </c:if>
            </ul>
        </div><!-- navbar-collapse end -->
    </div><!-- container-fluid end -->
</nav>
<!-- end #toolbar -->

<!-- body start -->
<div id="body">
    <div class="container">
        <div class="row" style=" margin-top: 2em;">

            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="panel panel-primary" id="blog_panel">
                    <div class="panel-heading">
                        <h3 class="panel-title">BLOG INFO</h3>
                    </div>
                    <div class="panel-body" style="text-align: center">
                        <div class="col-sm-2 col-xs-6"><a class="article-count" href="manager/article_manager" target="_blank"><b>文章数：${articleCount}</b></a></div>
                        <div class="col-sm-2 col-xs-6"><a class="user-count" href="manager/user_manager" target="_blank"><b>注册用户数：${userCount}</b></a></div>
                        <div class="col-sm-2 col-xs-6"><b class="total-access-count">总访问量：${totalAccessCount}</b></div>
                        <div class="col-sm-2 col-xs-6"><b class="article-access-count">文章点击量：${articleAccessCount}</b></div>
                        <div class="col-sm-2 col-xs-6"><b class="today-access-count">今日访问量：${todayAccessCount}</b></div>
                        <div class="col-sm-2 col-xs-6"><b class="user-active-count">在线人数：${userActiveCount}</b></div>
                    </div>
                </div>
            </div>

        </div><!-- end .row -->

        <div class="row" style=" margin-top: 2em;">

            <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="panel panel-success" id="system_panel">
                    <div class="panel-heading">
                        <h3 class="panel-title">System Status</h3>
                    </div>
                    <div class="panel-footer">
                        <div class="btn-group btn-group-justified" role="group" aria-label="...">
                            <div class="btn-group" role="group" id="btn_update_config">
                                <button type="button" class="btn btn-info">update_config</button>
                            </div>
                            <div class="btn-group" role="group" id="btn_reload_config">
                                <button type="button" class="btn btn-warning">reload_config</button>
                            </div>
                            <div class="btn-group" role="group" id="btn_reload_cache">
                                <button type="button" class="btn btn-danger">reload_cache</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="panel panel-success" id="log_panel">
                    <div class="panel-heading">
                        <h3 class="panel-title">System Log</h3>
                    </div>
                    <div class="panel-footer">
                        <div class="btn-group btn-group-justified" role="group" aria-label="...">
                            <div class="btn-group" role="group" id="log_info_trigger">
                                <a class="btn btn-info" href="manager/log_view?type=info" target="_blank">info</a>
                            </div>
                            <div class="btn-group" role="group" id="log_warn_trigger">
                                <a class="btn btn-warning" href="manager/log_view?type=warn" target="_blank">warn</a>
                            </div>
                            <div class="btn-group" role="group" id="log_error_trigger">
                                <a class="btn btn-danger" href="manager/log_view?type=error" target="_blank">error</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6 col-sm-6 col-xs-12">
                <div class="panel panel-success" id="ws_panel">
                    <div class="panel-heading">
                        <h3 class="panel-title">WebSocket Status</h3>
                    </div>
                    <div class="panel-footer">
                        <div class="btn-group btn-group-justified" role="group" aria-label="...">
                            <div class="btn-group" role="group" id="btn_ws_pv">
                                <button type="button" class="btn btn-info">pv：0</button>
                            </div>
                            <div class="btn-group" role="group" id="btn_ws_uv">
                                <button type="button" class="btn btn-warning">uv：0</button>
                            </div>
                            <div class="btn-group" role="group" id="btn_push_message">
                                <button type="button" class="btn btn-danger">push</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div><!-- end .row -->
    </div>
</div>
<!-- body end -->


<div class="modal fade" tabindex="-1" role="dialog" id="modal_system_status">
    <div class="modal-dialog" role="document" style="margin-top:10%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">重新初始化系统缓存</h4>
            </div>
            <div class="modal-body">
                <p class="modal-confirm">你确定要从数据库重新加载文章、用户等资料以刷新缓存中的数据吗?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default modal_btn_cancel" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary modal_btn_confirm">确定</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="modal_update_config">
    <div class="modal-dialog" role="document" style="margin-top:10%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">更新系统配置</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>配置项：</label>
                    <select class="form-control config_key" name="config_key">
                        <%--<c:forEach items="${settingArray}" var="entry" >
                            <option value="${entry.key}">${entry.key}</option>
                        </c:forEach>--%>
                    </select>
                </div>
                <div class="form-group">
                    <label>配置值：</label>
                    <input class="form-control config_value" type="text" name="config_value">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default modal_btn_cancel" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary modal_btn_confirm">确定</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="modal_push_message">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">推送消息</h4>
            </div>
            <div class="modal-body" style="padding-bottom: 0px;">
                <div class="form-group push_type_group">
                    <label>推送类型：</label>
                    <select class="form-control push_type" name="push_type">
                        <option value="push_message" selected="selected">消息</option>
                        <option value="push_script">脚本</option>
                    </select>
                </div>
                <div class="form-group push_users_group">
                    <label>推送对象：</label>
                    <select multiple="multiple" class="form-control push_users" name="push_users" style="height: 100px;"></select>
                </div>
                <div class="form-group push_user_group">
                    <label>推送用户：</label>
                    <select class="form-control push_user" name="push_user">
                    </select>
                </div>
                <div class="form-group push_page_group">
                    <label>推送页面：</label>
                    <select class="form-control push_page" name="push_page">
                    </select>
                </div>
                <div class="form-group push_handle_impl_group">
                    <label>脚本类型：</label>
                    <select class="form-control push_handle_impl" name="push_handle_impl">
                        <option value="user_defined">自定义</option>
                        <option value="close_tab">close_tab</option>
                        <option value="open_tab">open_tab</option>
                        <option value="scroll_tab">scroll_tab</option>
                        <option value="zip_photos_token">zip_photos_token</option>
                    </select>
                </div>
                <div class="form-group push_content_group">
                    <label>推送内容：</label>
                    <textarea class="form-control push_content" type="text" name="push_content" rows="5"></textarea>
                </div>
                <div class="form-group push_notify_opts_group">
                    <label>显示选项：</label>
                    <textarea class="form-control push_notify_opts" type="text" name="push_notify_opts"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default modal_btn_cancel" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary modal_btn_confirm">确定</button>
            </div>
        </div>
    </div>
</div>

<div id="goTop" class="" style="bottom: 70px;">
    <div class="arrow"></div>
    <div class="stick"></div>
</div>

<!-- login modal start -->
<div class="modal fade" id="login_Modal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content animated flipInY">
            <div class="modal-header text-center">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h2 class="modal-title" id="loginModalLabel">登录 / <a href="auth/register" target="_blank">注册</a></h2>
            </div>
            <form role="form" id="login_form">
                <div class="modal-body">
                    <div class="form-group">
                        <label>用户名</label>
                        <input type="email" name="identifier" class="form-control" placeholder="输入用户名/email">
                    </div>
                    <div class="form-group">
                        <label>密码</label>
                        <input type="password" name="credential" class="form-control" placeholder="输入密码">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="remember">记住我
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <a class="btn btn-primary login_submit">登录</a>
                </div>
            </form>
        </div>
    </div>
</div>
<!-- login modal end -->

<footer id="footer" role="contentinfo" class="card site-footer">
    <span>© 2016 </span><a href="https://imcoder.site" target="_blank">ImCoder</a><span> 博客 ，基于 </span><a>Java</a><span> 语言开发</span>
    <c:if test="${not empty site_icp_record_code}">
        <span>，ICP备案：</span><a href="http://beian.miit.gov.cn/" target="_blank">${site_icp_record_code}</a>
    </c:if>
    <c:if test="${not empty site_police_record_code}">
        <span>，公安备案：</span><img class="police-record-icon" src="<%=staticPath%>img/police_record_icon.png"><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${site_police_record_number}" target="_blank">${site_police_record_code}</a>
    </c:if>
</footer>

<a id="basePath" class="site-path-prefix" href="<%=basePath%>" style="display:none;"></a>
<a id="staticPath" class="site-path-prefix" href="<%=staticPath%>" style="display:none;"></a>
<a id="cloudPath" class="site-path-prefix" href="<%=cloudPath%>" style="display:none;"></a>
<!-- Bootstrap & Plugins core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script baseUrl="<%=staticPath%>" urlArgs="<%=urlArgs%>" data-main="<%=staticPath%>js/config.js<%=urlArgs%>" src="<%=staticPath%>lib/requirejs/require.min.js" defer="true" async="true" id="require_node" page="main_manager"></script>

</body>
</html>