<!DOCTYPE html>
<html lang="ru">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

    <title>Korzhov/Kazunin</title>

    <!--LIBRARIES-->
    <script src="js/dat.gui.js"></script>
    <script src="js/three.js"></script>
    <script src="js/OrbitControls.js"></script>
    <script src="js/stats.min.js" defer></script>
    <script src="js/STLLoader.js"></script>

    <script type="text/javascript" src="js/jquery-3.3.1.js"></script>

    <!--FONTS-->
    <link href="https://fonts.googleapis.com/css?family=Rationale" rel="stylesheet">


    <!--CSS (I'm use bootstrap)-->
    <link href="css/bootstrap.css" rel="stylesheet" type="text/css">
    <link type="text/css" href="css/main.css" rel="stylesheet">

    <!--MAIN SCRIPT-->
    <script defer type="text/javascript" src="js/main.js"></script>

</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Korzhov/Kazunin project</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <form class="form-inline my-2 my-lg-0" action="" method="post" enctype="multipart/form-data">
            <ul class="navbar-nav m-auto">
                <li class="nav-item">
                    <input type="file" class="form-control-file mr-sm-2" name="filename">
                </li>
                <li class="nav-item">
                    <input type="submit" class="btn btn-primary my-2 my-sm-0" value="Загрузить">
                </li>
            </ul>
        </form>
    </div>
</nav>
<div class="ajax-respond"></div>
<div class="text-center" id="threejs">
</div>

<!--For bootstrap(css) scripts -->
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>
</body>
</html>
