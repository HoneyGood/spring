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
    var scene, camera, renderer, threejs;
    var gui = null;

    var mouse, raycaster, isShiftDown = false;
    var objects = [];


    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

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

        var geometry = new THREE.BoxGeometry(2, 2, 2); //создаем блок
        color = Math.random() * 0xffffff; //рандомный цвет
        var material = new THREE.MeshLambertMaterial({ //создаем компанент "матирьял" (свойства) в дальнейшем добавляем к каждому объекту этот матерьял, оч удобно
            ambient: color,
            color: color,
            transparent: true
        });
        mesh = new THREE.Mesh(geometry, material); //добавили блок и его свойства
        mesh.position.set(0, 3, 0); //поставили его
        mesh.rotation.set(0, 0, 0);
        mesh.rotation.y = de2ra(-90); //повернули
        mesh.scale.set(1, 1, 1);
        mesh.doubleSided = true;
        mesh.castShadow = true;
        scene.add(mesh); //отобразили

        /*дальше по аналогии, только с подставкой для блока белой*/
        var planeGeometry = new THREE.BoxGeometry(10, 10, 0.1);
        var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            ambient: 0x000000,
            side: THREE.DoubleSide
        });
        planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.position.set(0, 0, 0);
        planeMesh.rotation.set(0, 0, 0);
        planeMesh.rotation.x = de2ra(90);
        planeMesh.receiveShadow = true;
        scene.add(planeMesh);

        // grid
        var gridHelper = new THREE.GridHelper(50, 50);
        scene.add(gridHelper);

        /*свет*/
        var object3d = new THREE.DirectionalLight('white', 0.15);
        object3d.position.set(6, 3, 9);
        object3d.name = 'Back light';
        scene.add(object3d);

        object3d = new THREE.DirectionalLight('white', 0.35);
        object3d.position.set(-6, -3, 0);
        object3d.name = 'Key light';
        scene.add(object3d);

        object3d = new THREE.DirectionalLight('white', 0.55);
        object3d.position.set(9, 9, 6);
        object3d.name = 'Fill light';
        scene.add(object3d);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(3, 30, 3);
        spotLight.castShadow = true;
        spotLight.shadowMapWidth = 2048;
        spotLight.shadowMapHeight = 2048;
        spotLight.shadowCameraNear = 1;
        spotLight.shadowCameraFar = 4000;
        spotLight.shadowCameraFov = 45;
        scene.add(spotLight);

        /*библиотека Контроля Осей, я ее добавлял для того, чтобы отобразить XYZ вектора, тут хз зач нужна*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        /*mouse move*/
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector3();

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('keydown', onDocumentKeyDown, false);
        document.addEventListener('keyup', onDocumentKeyUp, false);

        window.addEventListener('resize', onWindowResize, false);

        /*панелька для контроля блока*/
        //какие параметры принимаем
        var controller = new function () {
            this.scaleX = 1;
            this.scaleY = 1;
            this.scaleZ = 1;
            this.positionX = 0;
            this.positionY = 3;
            this.positionZ = 0;
            this.rotationX = 0;
            this.rotationY = 90;
            this.rotationZ = 0;
            this.boxColor = color;
            this.castShadow = true;
            this.boxOpacity = 1;

            this.positionx=false;
            this.positiony=false;
            this.positionz=false;
        }();

        var gui = new dat.GUI(); //создали gui
        var f4 = gui.addFolder('Camera');
        f4.add(controller, 'positionx',true).onChange(function () {
            camera.position.set(50,0,0);
        });
        f4.add(controller, 'positiony',true).onChange(function () {
            camera.position.set(0,50,0);
        });
        f4.add(controller, 'positionz',true).onChange(function () {
            camera.position.set(0,0,50);
        });
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
        gui.addColor(controller, 'boxColor', color).onChange(function () {
            mesh.material.color.setHex(dec2hex(controller.boxColor));
        });
        gui.add(controller, 'castShadow', false).onChange(function () {
            mesh.castShadow = controller.castShadow;
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

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
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

    /*mouse*/
    function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            var intersect = intersects[0];
            rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
            rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        }
        renderScene();
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();
        mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            var intersect = intersects[0];
            // delete cube
            if (isShiftDown) {
                if (intersect.object !== plane) {
                    scene.remove(intersect.object);
                    objects.splice(objects.indexOf(intersect.object), 1);
                }
                // create cube
            } else {
                var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                scene.add(voxel);
                objects.push(voxel);
            }
            render();
        }
    }

    function onDocumentKeyDown(event) {
        switch (event.keyCode) {
            case 16:
                isShiftDown = true;
                break;
        }
    }

    function onDocumentKeyUp(event) {
        switch (event.keyCode) {
            case 16:
                isShiftDown = false;
                break;
        }
    }

});