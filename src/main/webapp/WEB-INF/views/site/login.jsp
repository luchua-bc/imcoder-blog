<%@ page language="java" import="site.imcoder.blog.setting.Config" pageEncoding="UTF-8" %>
<%@ page import="site.imcoder.blog.setting.ConfigConstants" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
    String staticPath = Config.get(ConfigConstants.SITE_CDN_ADDR);
    String cloudPath = Config.get(ConfigConstants.SITE_CLOUD_ADDR);
%>
<%
    Object http_code = request.getAttribute("http_code");
    if (http_code != null) {
        response.setStatus((int) http_code);
    } else {
        response.setStatus(401);
    }
%>
<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>登录 - ImCODER's 博客</title>
    <meta name="keywords" content="imcoder.site,登录,ImCODER's 博客">
    <meta name="description" content="登录，输入账号密码登录到imcoder.site">

    <link rel="icon" href="<%=staticPath%>img/favicon.ico">
    <link rel="stylesheet" href="<%=staticPath%>lib/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="<%=staticPath%>lib/animate/animate.min.css">
    <link rel="stylesheet" href="<%=staticPath%>lib/css/style.hplus.css">
    <link rel="stylesheet" href="<%=staticPath%>lib/font-awesome/font-awesome.min.css">
    <link rel="stylesheet" href="<%=staticPath%>lib/toastr/toastr.min.css">
    <style>
        .toast-success-no-icon {
            background-color: #51A351 !important;
        }

        .toast-error-no-icon {
            background-color: #BD362F !important;
        }

        .toast-info-no-icon {
            background-color: #2F96B4 !important;
        }

        .toast-warning-no-icon {
            background-color: #F89406 !important;
        }
    </style>
</head>

<body class="gray-bg">

<div class="middle-box text-center loginscreen  animated fadeInDown">
    <div>
        <div>
            <br><br><br>
            <a href="<%=basePath%>" target="_blank"><h1 class="logo-name" style="font-size:1000%;">博客</h1></a>
            <br>
        </div>
        <h3>欢迎使用 blog</h3>

        <form class="m-t" role="form" id="login_form" action="user.do?method=login">
            <div class="form-group">
                <!--  <input type="email" class="form-control" placeholder="用户名" required=""> -->
                <input name="username" type="text" class="form-control" placeholder="用户名" required="">
            </div>
            <div class="form-group">
                <input name="password" type="password" class="form-control" placeholder="密码" required="">
                <input name="remember" type="checkbox" checked="checked" style="display: none;">
            </div>
            <button type="button" jumpUrl="<%=basePath%>" class="btn btn-primary block full-width m-b login_submit">登 录</button>

            <p class="text-muted text-center"><a href="#">忘记密码了？</a> | <a href="user.do?method=toregister">注册一个新账号</a></p>

        </form>
    </div>
</div>

<!-- Bootstrap & Plugins core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script baseUrl="<%=staticPath%>" data-main="<%=staticPath%>js/config.js" src="<%=staticPath%>lib/requirejs/require.min.js" defer="true" async="true" id="require_node" page="login"></script>
</body>
</html>
