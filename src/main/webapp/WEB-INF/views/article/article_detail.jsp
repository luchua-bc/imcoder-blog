﻿<%@ page language="java" import="site.imcoder.blog.setting.Config" pageEncoding="UTF-8" %>
<%@ page import="site.imcoder.blog.setting.ConfigConstants" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt_rt" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
    String staticPath = Config.get(ConfigConstants.SITE_CDN_ADDR);
    String cloudPath = Config.get(ConfigConstants.SITE_CLOUD_ADDR);
%>
<!DOCTYPE html>
<html class="no-js">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>${article.title} - ImCODER博客's 文章</title>
    <meta name="description" content="${article.title}...">
    <meta name="keywords" content="<c:forTokens items='${article.tags}' delims='#' var='tag'>${tag},</c:forTokens>">
    <!-- 使用url函数转换相关路径 -->
    <!-- <script async="" src="http://www.google-analytics.com/analytics.js"></script> -->

    <!-- 引入文件 -->
    <link rel="icon" href="<%=staticPath%>img/favicon.ico">
    <link rel="stylesheet" href="<%=staticPath%>lib/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="<%=staticPath%>lib/animate/animate.min.css">
    <link rel="stylesheet" href="<%=staticPath%>lib/css/style.hplus.css">
    <link rel="stylesheet" href="<%=staticPath%>css/style.css">
    <link rel="stylesheet" href="<%=staticPath%>lib/toastr/toastr.min.css">
    <link rel="stylesheet" href="<%=staticPath%>lib/magnific-popup/magnific-popup.min.css">

    <style>
        .mfp-bg {
            opacity: .6;
        }

        button.mfp-arrow {
            opacity: 0;
            transition: all 0.3s linear;
        }

        .mfp-arrow:focus {
            opacity: 0;
        }

        .mfp-arrow:hover {
            opacity: 0.6;
        }

        .mfp-with-zoom .mfp-container,
        .mfp-with-zoom.mfp-bg {
            opacity: 0;
            -webkit-backface-visibility: hidden;
            /* ideally, transition speed should match zoom duration */
            -webkit-transition: all 0.3s ease-out;
            -moz-transition: all 0.3s ease-out;
            -o-transition: all 0.3s ease-out;
            transition: all 0.3s ease-out;
        }

        .mfp-with-zoom.mfp-ready .mfp-container {
            opacity: 1;
        }

        .mfp-with-zoom.mfp-ready.mfp-bg {
            opacity: 0.8;
        }

        .mfp-with-zoom.mfp-removing .mfp-container,
        .mfp-with-zoom.mfp-removing.mfp-bg {
            opacity: 0;
        }
    </style>

</head>
<body uid="${loginUser.uid}">
<!-- <body background="../../img/bg-site.png"> -->
<!-- START THE COVER  background-image: url(img/bg-site.png);" -->
<div id="first" class="" style="z-index:1000;background-image: url(<%=staticPath%>img/bg-site.png);">
    <div class="carousel-inner">
        <div class="">
            <div class="container">
                <div class="" style="text-align:center">
                    <br>
                    <h1>${article.author.nickname}</h1>
                    <p>${article.author.description}</p>
                    <!-- hide 'follow' button when article's author is loginUser  -->
                    <c:if test="${ !( (!empty loginUser) and (loginUser.uid==article.author.uid) ) }">
                        <p><a name="follow" followed="false" class="btn btn-large btn-success follow"><b>关注</b></a></p>
                    </c:if>
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
                <p><a class="logo" style="color: #333;" href="<%=basePath%>">博客Blog</a></p>
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
                                <div class="coldesc"><a href="article.do?method=list&category.atid=0" target="_blank">默认</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="article.do?method=list&category.atid=1" target="_blank">开发</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="article.do?method=list&category.atid=2" target="_blank">教程</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="article.do?method=list&category.atid=3" target="_blank">资源</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="article.do?method=list&category.atid=4" target="_blank">科技</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="article.do?method=list&category.atid=5" target="_blank">游戏</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="article.do?method=list&category.atid=6" target="_blank">段子</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a href="article.do?method=list&category.atid=7" target="_blank">杂谈</a></div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-2 rowname">
                                <div class="coldesc">服务</div>
                            </div>
                            <div class="col-xs-1	morespace">
                                <div class="coldesc"><a class="toolbar_jump_writeblog">写博客</a></div>
                            </div>
                            <div class="col-xs-1	morespace">
                                <div class="coldesc"><a class="toolbar_jump_paste_code" href="http://paste.ubuntu.com" target="_blank">贴代码</a></div>
                            </div>
                            <div class="col-sm-1	">
                                <div class="coldesc"><a class="toolbar_jump_albums" href="<%=basePath%>photo.do?method=user_albums" target="_blank">相册</a></div>
                            </div>
                            <div class="col-sm-1  ">
                                <div class="coldesc"><a class="toolbar_jump_ftp" href="ftp://imcoder.site:21" target="_blank">FTP</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_login">登录</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_register" href="user.do?method=toregister" target="_blank">注册</a></div>
                            </div>
                            <c:if test="${ !empty loginUser && loginUser.userGroup.gid == 1 }">
                                <div class="col-sm-1">
                                    <div class="coldesc"><a class="toolbar_jump_manager" href="manager.do?method=backstage" target="_blank">管理</a></div>
                                </div>
                            </c:if>
                        </div>
                        <div class="row">
                            <div class="col-sm-2 rowname">
                                <div class="coldesc">关于</div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_notice" target="_blank" href="site.do?method=list">公告</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_help" target="_blank" href="#">帮助</a></div>
                            </div>
                            <div class="col-sm-1">
                                <div class="coldesc"><a class="toolbar_jump_about" target="_blank" href="<%=basePath%>site.do?method=about">关于</a></div>
                            </div>
                        </div>
                    </ul>
                </li>
                <li><a href="<%=basePath%>">首页</a></li>
                <li class="active"><a>${article.title}</a></li>
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
                            <img src="<%=staticPath%>${loginUser.head_photo}"/><span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <h4><a class="anav-menu_user toolbar_user_profilecenter" href="<%=basePath%>user.do?method=profilecenter" target="_blank">个人中心</a></h4>
                            <h4><a class="anav-menu_user toolbar_user_userhome" href="<%=basePath%>user.do?method=home&uid=${loginUser.uid}" target="_blank">我的博客</a></h4>
                            <h4><a class="anav-menu_user toolbar_user_albums" href="<%=basePath%>photo.do?method=user_albums&uid=${loginUser.uid}" target="_blank">我的相册</a></h4>
                            <h4><a class="anav-menu_user toolbar_user_messages" href="<%=basePath%>user.do?method=profilecenter&action=messages" target="_blank">我的消息</a></h4>
                            <h4><a class="anav-menu_user toolbar_user_setting" href="<%=basePath%>user.do?method=profilecenter&action=settings" target="_blank">修改设置</a></h4>
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
        <article class="row">

            <!-- 作者区  start -->
            <aside class="col-md-3 col-sm-12 col-xs-12" id="rank_col">

                <section class="post-author" id="user_rank">
                    <div class="widget-head-color-box navy-bg text-center" style="padding-top:30px;padding-bottom:30px;">
                        <address class="m-b-md">
                            <h2 class="font-bold no-margins author_id" id="h_auid" auid="${article.author.uid}">
                                <a class="author_nickname" style="color:white;" href="<%=basePath%>user.do?method=home&uid=${article.author.uid}" target="_blank">${article.author.nickname}</a>
                            </h2>
                            <small class="author_group">${article.author.userGroup.group_name}</small>
                        </address>
                        <img src="<%=staticPath%>${article.author.head_photo}" class="img-circle circle-border m-b-md author-head" style="width:120px;height:120px;" alt="profile">
                        <div>
                            <span><a class="author-articleCount" target="_blank" style="color:white;" href="<%=basePath%>user.do?method=home&uid=${article.author.uid}">${article.author.articleCount} 动态</a></span> |
                            <span><a class="author-followCount" target="_blank" style="color:white;" href="<%=basePath%>user.do?method=contact&action=follows&query_uid=${article.author.uid}">${article.author.followCount} 关注</a></span> |
                            <span><a class="author-fansCount" target="_blank" style="color:white;" href="<%=basePath%>user.do?method=contact&action=fans&query_uid=${article.author.uid}">${article.author.fansCount} 关注者</a></span>
                        </div>
                    </div>
                    <div class="widget-text-box">
                        <!-- hide 'follow' button when article's author is loginUser  -->
                        <c:choose>
                            <c:when test="${ !( (!empty loginUser) and (loginUser.uid==article.author.uid) ) }">
                                <div class="text-right">
                                    <a name="follow" followed="false" class="btn btn-xs btn-primary follow"><i class="fa fa-thumbs-up"></i> 关注 </a>
                                    <a name="letter" class="btn btn-xs btn-white letter"><i class="fa fa-heart"></i> 私信</a>
                                </div>
                            </c:when>
                            <c:otherwise>
                                <div class="text-center author-description">
                                        ${article.author.description}
                                </div>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </section>

                <section class="post" id="article_rank">
                    <p class="ui red ribbon label">文章Rank</p>
                    <p>
                    <ul>
                        <li>访问：<span class="article_click">${article.click}</span>&nbsp;次</li>
                        <li>评论：<span class="article_comment">${article.comment}</span>&nbsp;次</li>
                        <li>点赞：<span class="">0</span>&nbsp;次</li>
                        <li>收藏：<span class="article_collection">${article.collection}</span>&nbsp;次</li>
                    </ul>
                </section>

                <section class="post hidden-xs" id="photos_show">
                    <p class="ui red ribbon label"><a title="点击打开相册" target="_blank" href="photo.do?method=user_albums&uid=${article.author.uid}" style="color:white;text-decoration: none;">Photos</a></p>
                    <p></p>
                    <div class="photos">
                    </div>
                </section>

                <section class="post hidden-xs" id="article_class">
                    <p class="ui red ribbon label">文章分类</p>
                    <p>
                    <ul id="rank_class">
                        <c:forEach items="${categoryCount}" var="category">
                            <li><a href="article.do?method=list&category.atid=${ category.atid }">${ category.atname }：(<span>${ category.count }</span>)</a></li>
                        </c:forEach>
                    </ul>
                </section>

                <section class="post hidden-xs" id="article_hot">
                    <p class="ui red ribbon label">热门文章</p>
                    <p>
                    <ul id="rank_hot">
                    </ul>
                </section>

                <section class="post hidden-xs" id="article_new">
                    <p class="ui red ribbon label">最新文章</p>
                    <p>
                    <ul id="rank_newest">
                    </ul>
                </section>

            </aside>
            <!-- 作者区  end -->

            <!-- main div start -->
            <article class="col-md-9 col-sm-12 col-xs-12" id="main" role="main">

                <!-- 文章头  start -->
                <header class="post post-container article_header" style="overflow:visible">
                    <h1 class="post-title	article_id" itemprop="name headline" id="h_aid" aid="${article.aid}">
                        <a class="article_title" itemtype="url" href="article.do?method=detail&aid=${article.aid}">${article.title}</a>
                    </h1>
                    <p>
                    <ul class="post-meta">
                        <li>
                            <time class="article_time" title="更新时间：<fmt:formatDate value='${article.update_time}' pattern='yyyy-MM-dd HH:mm'/>" datetime="${article.create_time}" itemprop="datePublished"><fmt:formatDate value="${article.create_time}"
                                                                                                                                                                                                                           pattern="yyyy-MM-dd HH:mm"/></time>
                        </li>
                        <li>分类: <a class="article_category" href="article.do?method=list&category.atid=${article.category.atid}" target="_blank">${article.category.atname}</a></li>
                    </ul>
                    <div class="btn-group	article_handle" style="margin-top:-33px;float:right">
                        <button type="button" style="margin-right:-7px;" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown"><b>操作</b></button>
                        <button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="glyphicon glyphicon-align-justify"></span>
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu" style="min-width:30px">
                            <li class="hidden-xs"><a style="padding:4px 12px 3px 12px;" id="fullArticleBtn" status="no"><span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span><b> 全屏</b></a></li>
                            <li><a style="padding:4px 12px 3px 12px;" id="collectArticleBtn" status="no"><span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span><b> 收藏</b></a></li>
                            <c:if test="${ not empty loginUser and loginUser.uid == article.author.uid }">
                                <li><a style="padding:4px 12px 3px 12px;" href="article.do?method=edit&flag=update&aid=${ article.aid }"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><b> 编辑</b></a></li>
                                <li><a style="padding:4px 12px 3px 12px;" id="showDeleteModalBtn" onclick="$('#validateMailModal').modal({backdrop: 'static', keyboard: false});"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span><b>
                                    删除</b></a></li>
                            </c:if>
                            <c:if test="${ not empty loginUser and loginUser.userGroup.gid == 1 }">
                                <li><a style="padding:4px 12px 3px 12px;" href="manager.do?method=article_modify&aid=${ article.aid }"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span><b> 管理</b></a></li>
                            </c:if>
                        </ul>
                    </div>
                    </p>
                </header>
                <!-- 文章头  end -->

                <article class="post" id="article_content">
                    <!-- 文章内容 start -->
                    <section class="post-container">
                        <div class="post-content article_detail" itemprop="articleBody">
                            ${article.detail}
                        </div>
                    </section>
                    <!-- 文章内容 end -->

                    <!-- 标签 start -->
                    <footer class="post-footer">
                        <p itemprop="keywords" class="tags">标签:
                            <c:forTokens items="${article.tags}" delims="#" var="tag">
                                &nbsp;&nbsp;&nbsp;<a href="article.do?method=list&tags=${tag}" target="_blank">#${tag}</a>
                            </c:forTokens>
                        </p>
                    </footer>
                    <!-- 标签 end -->
                </article>

                <!-- 评论区 start -->
                <article>
                    <!-- 已有评论 -->
                    <section id="comments">
                    </section>
                    <!-- 评论 input start -->
                    <div id="comments-respond-post" class="respond">
                        <div class="cancel-comment-reply">
                            <a id="cancel-comment-reply-link" href="" rel="nofollow" style="display:none" onclick="return cancelReply();">取消回复</a>
                        </div>

                        <form method="post" action="" id="comment-form" role="form" class="card">
                            <h3 id="response">添加新评论</h3>
                            <p>
                                <label for="comment_form_content" class="required">内容</label>
                                <input type="checkbox" id="tagInner" value="tagInner"/>html注入
                                <input type="hidden" name="parentid" id="comment_form_parentid" value="0"/>
                                <input type="hidden" name="replyuid" id="comment_form_replyuid" value="${article.author.uid}"/>
                                <textarea rows="4" cols="50" name="content" id="comment_form_content" class="textarea" required="" placeholder=""></textarea>
                            </p>
                            <p>
                                <button type="button" id="comment_form_submit" class="submit ripple"><span>提交评论</span>
                                    <ripple-container></ripple-container>
                                </button>
                            </p>
                        </form>
                    </div>
                    <!-- 评论 input end -->
                </article>
                <!-- 评论区 end -->

                <!-- 相关文章区 start -->
                <footer class="card">
                    <h3>其它文章</h3>
                    <ul class="post-near">
                        <c:if test="${ not empty preArticle }">
                            <li>上一篇: <a href="article.do?method=detail&aid=${preArticle.aid }" title="">${preArticle.title }</a></li>
                        </c:if>
                        <c:if test="${ not empty nextArticle }">
                            <li>下一篇: <a href="article.do?method=detail&aid=${nextArticle.aid }" title="">${nextArticle.title }</a></li>
                        </c:if>
                    </ul>
                </footer>
                <!-- 相关文章区 end -->

            </article><!-- main div end -->

        </article><!-- end .row -->
    </div>
</div>
<!-- body end -->
<div id="goTop" class="" style="bottom: 70px;">
    <div class="arrow"></div>
    <div class="stick"></div>
</div>

<c:if test="${ not empty loginUser and loginUser.uid == article.author.uid }">
    <!--validateMailModal start -->
    <div class="modal fade" id="validateMailModal" tabindex="-1" role="dialog" aria-labelledby="validateMailModalLabel">
        <div style="width:350px;margin-top:180px;" class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title" id="validateMailModalLabel">验证邮箱(防止误删，需填写验证码)</h4>
                </div>
                <div class="modal-body">
                    <form method="post" id="validateMailForm" class="form-horizontal" onsubmit="return false;">
                        <div class="form-group">
                            <label class="col-sm-3 control-label">邮箱:</label>
                            <div class="col-sm-7" style="margin-left:-20px;">
                                <input type="text" required="required" class="form-control" disabled="disabled" name="email" value="${article.author.email}"/>
                            </div>
                            <div class="col-sm-3" style="margin-left:-20px;">
                                <input type="button" id="sendValidateMailBtn" class="form-control btn-primary" value="发送"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-3 control-label">验证码:</label>
                            <div class="col-sm-7" style="margin-left:-20px;">
                                <input type="text" required="required" class="form-control" name="validateCode"/>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="margin-top:-20px;">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="submit" id="deleteArticleBtn" form="validateMailForm" class="btn btn-danger">删除</button>
                </div>
            </div>
        </div>
    </div>
    <!-- validateMailModal end -->
</c:if>

<!-- login modal start -->
<div style="margin-top:100px;" class="modal fade" id="login_Modal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel">
    <div style="width: 350px;" class="modal-dialog" role="document">
        <div class="modal-content animated flipInY">
            <div class="modal-header text-center">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h2 class="modal-title" id="loginModalLabel">登录/<a href="user.do?method=toregister" target="_blank">注册</a></h2>
            </div>
            <form role="form" id="login_form">
                <div class="modal-body" style="height:200px;">
                    <div class="form-group">
                        <label>用户名</label>
                        <input type="email" name="username" class="form-control" placeholder="输入用户名/email">
                    </div>
                    <div class="form-group">
                        <label>密码</label>
                        <input type="password" name="password" class="form-control" placeholder="输入密码">
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

<div id="enlargephoto-modal" class="animated pulse" style="display:none; position: fixed;left: 0;top: 0;width: 100%;height: 100%;z-index: 3000;">
    <div class="fog" style="width: 100%;height: 100%;background: rgba(0,0,0,.6);"></div>
    <div id="photo-content" style="max-width:100%;max-height:100%;position:absolute;background:rgba(0, 0, 0, 0.6);">
        <div class="close" title="Close" style="background: #ddd;width:15px;right: 0;position: absolute;opacity: .8;color:#fff;text-align: center;font-size:15px;font-style: normal;">X</div>
        <img id="photo-content-img" style="border:5px solid #FFFFFF;"/>
    </div>
</div>

<footer id="footer" role="contentinfo" class="card">
    <span>© 2016 </span><a href="https://imcoder.site" target="_blank">ImCoder</a>
    <span>博客 ，基于 </span><a>Java</a><span> 语言开发</span>
    <span>，ICP备案：</span><a href="http://www.miibeian.gov.cn" target="__blank">湘ICP备17002133号</a>
</footer>
<script src="<%=staticPath%>lib/highlight/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
<a id="basePath" href="<%=basePath%>" style="display:none;"></a>
<a id="staticPath" href="<%=staticPath%>" style="display:none;"></a>
<a id="cloudPath" href="<%=cloudPath%>" style="display:none;"></a>
<!-- Bootstrap & Plugins core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script baseUrl="<%=staticPath%>" data-main="<%=staticPath%>js/config.js" src="<%=staticPath%>lib/requirejs/require.min.js" defer="true" async="true" id="require_node" page="article_detail"></script>

<!-- ######################################### -->

<!--  添加行数
   <style>
       .hljs {
           /*background: #eee !important;*/
           color: white;
       }
         .hljs ul {
           list-style: decimal;
           margin: 0px 0px 0 40px !important;
           padding: 0px;
           background: #23241f !important;
       }
       .hljs ul li {
           list-style: decimal-leading-zero;
           border-left: 1px solid #ddd !important;
           padding-left: 9px!important;
           padding-top: 4px!important;
           padding-bottom: 4px!important;
           margin: 0 !important;
           line-height: 14px;
           word-break: break-all;
           word-wrap: break-word;
       }
   </style>
   <script>
       $("code").each(function(){
           var length = $(this).html().split('\n').length-1;
           if( length > 1 ){
               $(this).html("<ul><li>" + $(this).html().replace(/\n/g,"\n</li><li>") +"\n</li></ul>");
           }
       });*/
   </script>
-->

</body>
</html>