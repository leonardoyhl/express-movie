
$('.btn-logout').click(function (e) {
    $.ajax({
        url: '/logout',
        method: 'post',
        success: function (data) {
            if (data.code == 0) {
                location.href = '/';
            }
        }
    });
});
$('.user-center .profile button').click(function (e) {
    var data = $("#form_personal_info").serialize();
    console.log(data);
    $.ajax({
        url: '/user/profile',
        method: 'post',
        data: data,
        dataType: 'json',
        success: function (data, status, xhr) {
            if (data.code == 0) {
                $('.user-center .profile .alert-success').show();
            } else {
                $('.user-center .profile .alert-danger').show().delay(3000).hide();
            }
            setTimeout(function () {
                $('.user-center .profile .alert').hide();
            }, 3000);
        },
        error: function (xhr, status, text) {
            $('.user-center .profile .alert-danger').show().delay(3000).hide();
            setTimeout(function () {
                $('.user-center .profile .alert').hide();
            }, 3000);
        }
    });
});

$('.btn-back').click(function () {
    history.back(-1);
});