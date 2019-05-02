(function () {
    var script = document.createElement('script');
    script.onload = function () {
        var stats = new Stats();
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function loop() {
            stats.update();
            requestAnimationFrame(loop)
        });
    };
    script.src = 'js/stats.min.js';
    document.head.appendChild(script);
})()


$(document).ready(function () {
    // Переменная куда будут располагаться данные файлов
    var files;

// Вешаем функцию на событие
// Получим данные файлов и добавим их в переменную
    $('input[type=file]').change(function(){
        files = this.files;
    });
    // Вешаем функцию ан событие click и отправляем AJAX запрос с данными файлов

    $('input[type=submit]').click(function( event ){
        event.stopPropagation(); // Остановка происходящего
        event.preventDefault();  // Полная остановка происходящего

        // Создадим данные формы и добавим в них данные файлов из files

        var data = new FormData();
        $.each( files, function( key, value ){
            data.append( key, value );
        });

        // Отправляем запрос

        $.ajax({
            url: './submit.php?uploadfiles',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Не обрабатываем файлы (Don't process the files)
            contentType: false, // Так jQuery скажет серверу что это строковой запрос
            success: function( respond, textStatus, jqXHR ){

                // Если все ОК
                if( typeof respond.error === 'undefined' ){
                    // Файлы успешно загружены, делаем что нибудь здесь

                    // выведем пути к загруженным файлам в блок '.ajax-respond'

                    var files_path = respond.files;
                    var html = '';
                    $.each( files_path, function( key, val ){ html += val +'<br>'; } )
                    $('.ajax-respond').html( html );
                }
                else{
                    console.log('ОШИБКИ ОТВЕТА сервера: ' + respond.error );
                }
            },
            error: function( jqXHR, textStatus, errorThrown ){
                console.log('ОШИБКИ AJAX запроса: ' + textStatus );
            }
        });
        var loader = new THREE.STLLoader();
        alert(files[0].name)
        loader.load( 'uploads/'+files[0].name, function ( geometry ) {
            geometry.computeFaceNormals()
            var material = new THREE.MeshPhongMaterial( {
                ambient: 0xff5533,
                color: 0xf77e,
                specular: 0x111111,
                shininess: 200 }

            );
            var mesh = new THREE.Mesh( geometry, material );

            scene.add( mesh );
        } );
    });

    var scene, camera, renderer, threejs;
    var gui = null;
    var mouse = new THREE.Vector2(), INTERSECTED;
    var raycaster, isShiftDown = false;
    var objects = [];


    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight - 5;

    var mesh, color;

    var de2ra = function (degree) {
        return degree * (Math.PI / 180);
    };
    init();
    animate();

    function init() {

        threejs = document.getElementById('threejs'); //парсим id "threejs"
        scene = new THREE.Scene(); //создаем сцену

        renderer = new THREE.WebGLRenderer({antialias: true}); //выбираем рендер
        renderer.setSize(WIDTH, HEIGHT); //устанавливаем высоту и ширину рендера
        renderer.setClearColor(0x333F47, 1); //цвет заднего фона и прозрачность
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        threejs.appendChild(renderer.domElement); //добавляем в DOM элемент наш рендер

        camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 1000); //угол обзора камеры (FoV), *** , ***, дальность прорисовки
        camera.position.set(16, 8, 16); //где камера стоит
        camera.lookAt(scene.position); // куда смотрим


        scene.add(camera); //добавление каменры на сцену
        function CustomSinCurve( scale ) {

            THREE.Curve.call( this );
            this.scale = ( scale === undefined ) ? 1 : scale;
        }
        CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
        CustomSinCurve.prototype.constructor = CustomSinCurve;
        CustomSinCurve.prototype.getPoint = function ( t ) {
            var tx = Math.cos(t*360*20);
            var ty = Math.sin(t*360*20);
            var tz = 3*t;
            return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

        };

        var path = new CustomSinCurve( -6 );
        var geometry = new THREE.TubeBufferGeometry( path, 50, 1, 64, false );
        var material = new THREE.MeshBasicMaterial( { color: 0xf77e } );
        var mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        // grid
        var gridHelper = new THREE.GridHelper(50, 50);
        scene.add(gridHelper);

        /*библиотека Контроля Осей, я ее добавлял для того, чтобы отобразить XYZ вектора, тут хз зач нужна*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight - 5);
        }

        /*панелька для контроля блока*/
        //какие параметры принимаем
        var controller = new function () {
            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;
            this.positionX = 0;
            this.positionY = 0;
            this.positionZ = 0;
            this.rotationX = 0;
            this.rotationY = 0;
            this.rotationZ = 0;
            this.boxOpacity = 1;

            function addEvent() {
                document.addEventListener('mousemove', onDocumentMouseMove, false);
                document.addEventListener('mousedown', onDocumentMouseDown, false);
                document.addEventListener('mouseup', onDocumentMouseUp, false);
                controls.noRotate = !controls.noRotate;
                controls.update()
            }
            function removeEvent() {
                document.removeEventListener('mousemove', onDocumentMouseMove, false);
                document.removeEventListener('mousedown', onDocumentMouseDown, false);
                document.removeEventListener('mouseup', onDocumentMouseUp, false);
                controls.noRotate = !controls.noRotate;
                controls.update()
            }
            var x0,y0 = 0;
            function onDocumentMouseMove(event) {
                event.preventDefault();
                // planeMesh.rotation.x = planeMesh.rotation.x+de2ra(1);
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


                // renderScene();
            }
            function onDocumentMouseDown(event) {
                event.preventDefault();
                // objects.push(mouse.x);
                x0=mouse.x
                y0=mouse.y
                // alert('mouse down')
                renderScene();
            }
            function onDocumentMouseUp(event) {
                event.preventDefault();
                var geometry = new THREE.PlaneGeometry( (x0-mouse.x)*50, (y0-mouse.y)*25, 32 );
                var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
                var plane = new THREE.Mesh( geometry, material );
                scene.add( plane );
                removeEvent()
                renderScene();
            }
            this.line = function () {
                /*mouse move*/
                raycaster = new THREE.Raycaster();
                addEvent();
            }

            this.positionx = function () {
                camera.position.set(0, 0, 50);
            };
            this.positiony = function () {
                camera.position.set(50, 0, 0);
            };
            this.positionz = function () {
                camera.position.set(0, 50, 0);
            };

            /*function download(content, fileName, contentType) {
                var a = document.createElement("a");
                var file = new Blob([content], {type: contentType});
                a.href = URL.createObjectURL(file);
                a.download = fileName;
                a.click();
            }*/
        }();

        var gui = new dat.GUI(); //создали gui

        var f5 = gui.addFolder('Drow2D');
        f5.add(controller, 'line');

        var f4 = gui.addFolder('Camera');
        f4.add(controller, 'positionx');
        f4.add(controller, 'positiony');
        f4.add(controller, 'positionz');

        var f1 = gui.addFolder('Scale'); //поле Scale, потом установили событие onChange на него
        f1.add(controller, 'scaleX', 0.1, 5).onChange(function () {
            mesh.scale.x = (controller.scaleX); //присваиваем блоку позицию по X
        });
        /*по аналогии*/
        f1.add(controller, 'scaleY', 0.1, 5).onChange(function () {
            mesh.scale.y = (controller.scaleY);
        });
        f1.add(controller, 'scaleZ', 0.1, 5).onChange(function () {
            mesh.scale.z = (controller.scaleZ);
        });

        var f2 = gui.addFolder('Position');
        f2.add(controller, 'positionX', -5, 5).onChange(function () {
            mesh.position.x = (controller.positionX);
        });
        f2.add(controller, 'positionY', -3, 5).onChange(function () {
            mesh.position.y = (controller.positionY);
        });
        f2.add(controller, 'positionZ', -5, 5).onChange(function () {
            mesh.position.z = (controller.positionZ);
        });

        var f3 = gui.addFolder('Rotation');
        f3.add(controller, 'rotationX', -180, 180).onChange(function () {
            mesh.rotation.x = de2ra(controller.rotationX);
        });
        f3.add(controller, 'rotationY', -180, 180).onChange(function () {
            mesh.rotation.y = de2ra(controller.rotationY);
        });
        f3.add(controller, 'rotationZ', -180, 180).onChange(function () {
            mesh.rotation.z = de2ra(controller.rotationZ);
        });
        gui.add(controller, 'boxOpacity', 0.1, 1).onChange(function () {
            material.opacity = (controller.boxOpacity);
        });
    }

    /*разбор цвета*/
    function dec2hex(i) {
        var result = "0x000000";
        if (i >= 0 && i <= 15) {
            result = "0x00000" + i.toString(16);
        } else if (i >= 16 && i <= 255) {
            result = "0x0000" + i.toString(16);
        } else if (i >= 256 && i <= 4095) {
            result = "0x000" + i.toString(16);
        } else if (i >= 4096 && i <= 65535) {
            result = "0x00" + i.toString(16);
        } else if (i >= 65535 && i <= 1048575) {
            result = "0x0" + i.toString(16);
        } else if (i >= 1048575) {
            result = '0x' + i.toString(16);
        }
        if (result.length == 8) {
            return result;
        }

    }


    /*для движение камеры*/
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderScene();
    }

    /*тоже для движения, выделили в еще доп функцию renderScene*/
    function renderScene() {
        renderer.render(scene, camera);
    }


});