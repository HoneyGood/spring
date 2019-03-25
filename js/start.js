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
    scene = new THREE.Scene();

    //CanvasRenderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.autoClear = true;
    renderer.sortObjects = true;
    renderer.generateMipmaps = true;
    renderer.setClearColor(0x1B1E21, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    /*Create camera and set position*/
    camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 50);
    camera.position.set(20, 5, 30);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    $('#WebGL-output').html(renderer.domElement)
});


//main function
function start() {


    //axes OX OY OZ
    var axes = new THREE.AxesHelper(200);
    scene.add(axes);
    //grid-plane
    var plane = new THREE.GridHelper(50, 50);
    scene.add(plane);

/*    var sqrt3 = Math.sqrt(3) / 2;
    var radius = 2;

    var curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(radius, 0, 0),
        new THREE.Vector3(radius / 2, radius * sqrt3, 0),
        new THREE.Vector3(-radius / 2, radius * sqrt3, 0),
        new THREE.Vector3(-radius, 0, 0),
        new THREE.Vector3(-radius / 2, -radius * sqrt3, 0),
        new THREE.Vector3(radius / 2, -radius * sqrt3, 0)

    ]);

    var points = curve.getPoints(50);

    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    var material = new THREE.LineBasicMaterial({
        color: 0x00ffff
    });

    var curveObject = new THREE.Line(geometry, material);

    scene.add(curveObject);*/
    var sqrt3 = Math.sqrt(3) / 2;
    var radius = 2;

    var numPoints = 100;

    spline = new THREE.SplineCurve3([
        new THREE.Vector3(radius, 0, 0),
        new THREE.Vector3(radius / 2, radius * sqrt3, 1),
        new THREE.Vector3(-radius / 2, radius * sqrt3, 2),
        new THREE.Vector3(-radius, 0, 3),
        new THREE.Vector3(-radius / 2, -radius * sqrt3, 4),
        new THREE.Vector3(radius / 2, -radius * sqrt3, 5)
    ]);

    var material = new THREE.LineBasicMaterial({
        color: 0x00ffff,
    });

    var geometry = new THREE.Geometry();
    var splinePoints = spline.getPoints(numPoints);

    for(var i = 0; i < splinePoints.length; i++){
        geometry.vertices.push(splinePoints[i]);
    }

    var line = new THREE.Line(geometry, material);
    scene.add(line);


    //for move camera
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}