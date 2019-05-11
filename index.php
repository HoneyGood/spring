<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

    <title>Korzhov/Kazunin</title>

    <!--LIBRARIES-->
    <script type="text/javascript" src="/js/dat.gui.js"></script>
    <script type="text/javascript" src="/js/three.js"></script>
    <script type="text/javascript" src="/js/OrbitControls.js"></script>
    <script type="text/javascript" src="/js/stats.min.js" defer></script> <!--statistic-->
    <script type="text/javascript" src="/js/STLLoader.js"></script> <!--load from user stl file-->
    <script type="text/javascript" src="/js/STLExporter.js"></script> <!--export scene to stl-->
    <script type="text/javascript" src="/js/FileSaver.js"></script> <!--download from server-->


    <script type="text/javascript" src="/js/jquery-3.3.1.js"></script>

    <!--FONTS-->
    <link href="https://fonts.googleapis.com/css?family=Rationale" rel="stylesheet">


    <!--CSS (I'm use bootstrap)-->
    <link href="/css/bootstrap.css" rel="stylesheet" type="text/css">
    <link type="text/css" href="/css/main.css" rel="stylesheet">

    <!--MAIN SCRIPT-->
    <script defer type="text/javascript" src="js/main.js"></script>
    <script defer type="text/javascript" src="js/fileloader.js"></script>


</head>
<body>
<nav class="navbar navbar-expand-lg dark_nav bg-dark">
    <span class="navbar-brand">Korzhov/Kazunin project</span>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!--enctype="multipart/form-data"-->
        <form class="form-inline my-2 my-lg-0 m-auto" action="" method="post" enctype="multipart/form-data">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <!--                    <input type="file" class="form-control-file mr-sm-2" name="filename">-->
                    <input type="file" name="userfile" id="file" class="input-file">
                    <label for="file" class="btn btn-outline-light btn-left">
                        <i class="icon fa fa-check"></i>
                        <span class="js-fileName">Choose a file</span>
                    </label>
                </li>
                <li class="nav-item">
                    <input id="load" type="submit" class="btn btn-outline-light my-sm-0 btn-right" value="Load">
                </li>
            </ul>
            <ul class="navbar-nav ml-2">
                <li class="nav-item">
                    <button class="btn btn-outline-light my-sm-0">Download</button>
                </li>
            </ul>
        </form>

    </div>
</nav>
<div class="text-center" id="threejs">
</div>

<!--For bootstrap(css) scripts -->
<script type="text/javascript" src="/js/popper.min.js"></script>
<script type="text/javascript" src="/js/bootstrap.min.js"></script>
</body>
</html>
