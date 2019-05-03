$(document).ready(function () {
// Переменная куда будут располагаться данные файлов
    var files;

// Вешаем функцию на событие
// Получим данные файлов и добавим их в переменную
    $('input[type=file]').change(function () {
        files = this.files;
        var $input = $(this),
            $label = $('.js-fileName');
            $label.html(files[0].name)
    });
// Вешаем функцию ан событие click и отправляем AJAX запрос с данными файлов

    $('#load').click(function (event) {
        event.stopPropagation(); // Остановка происходящего
        event.preventDefault();  // Полная остановка происходящего

        // Создадим данные формы и добавим в них данные файлов из files

        var data = new FormData();
        $.each(files, function (key, value) {
            data.append(key, value);
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
            success: function (respond, textStatus, jqXHR) {

                // Если все ОК
                if (typeof respond.error === 'undefined') {
                    // Файлы успешно загружены, делаем что нибудь здесь

                    // выведем пути к загруженным файлам в блок 'алерта'

                    var files_path = respond.files;
                    var html = '';
                    $.each(files_path, function (key, val) {
                        html += val + ' - Файл загружен';
                    })
                    alert(html)
                    var loader = new THREE.STLLoader();
                    // alert(files[0].name)
                    loader.load('uploads/' + files[0].name, function (geometry) {
                        geometry.computeFaceNormals()
                        /*            var material = new THREE.MeshPhongMaterial({
                                            ambient: 0xff5533,
                                            color: 0xf77e,
                                            specular: 0x111111,
                                            shininess: 200
                                        }
                                    );*/

                        var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );

                        var mesh = new THREE.Mesh(geometry, material);

                        // alert(loader.parse(mesh))
                        scene.add(mesh);
                    });
                }
                else {
                    console.log('ОШИБКИ ОТВЕТА сервера: ' + respond.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('ОШИБКИ AJAX запроса: ' + textStatus);
            }
        });

    });
});
